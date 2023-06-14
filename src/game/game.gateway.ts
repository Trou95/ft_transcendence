import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import {Vector2} from "./entities/game.entity";

@WebSocketGateway(9000, {
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{

  private readonly SCREEN_WIDTH = 1920;
  private readonly SCREEN_HEIGHT = 1080;
  private readonly PLAYER_WIDTH_SCALE = 0.01;
  private readonly PLAYER_HEIGHT_SCALE = 0.25;
  private readonly PLAYER_WIDTH = this.SCREEN_WIDTH * this.PLAYER_WIDTH_SCALE;
  private readonly PLAYER_HEIGHT = this.SCREEN_HEIGHT * this.PLAYER_HEIGHT_SCALE;
  private readonly PLAYER_MARGIN = this.PLAYER_WIDTH / 2;
  private readonly BALL_RADIUS = this.SCREEN_WIDTH * this.PLAYER_WIDTH_SCALE;

  constructor(private readonly gameService: GameService) {
  }

  afterInit(server: Server) {
    this.gameService.server = server;
    setInterval(() => {
      this.updateGames(this.gameService);
    },30);
  }

  async handleConnection(client: Socket) {
    console.log('Connected Client: ', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected:  ', client.id);
    await this.gameService.deleteRoom(client.id);
    //await this.gameService.finishGame(client.id);
  }

  async updateGames(gameService)
  {

    const rooms = await this.gameService?.getGameRooms();
    for(let i = 0; i < rooms.length; i++)
    {
      const room = await this.gameService.getGameRoom(rooms[i]);
      //console.log(room);
      if(room.gameStatus == 1) {
        //Mirror player
        this.gameService.moveBall(rooms[i]);

        let ballMirrorX;
        if(room.ball_pos.X < 960)
          ballMirrorX = 960 + (960 - room.ball_pos.X);
        else
          ballMirrorX = 960 - (room.ball_pos.X - 960);

        this.gameService.server.to(room.player1).emit("client:updateGame", {rival: room.player2_pos, ballPos: room.ball_pos});
        this.gameService.server.to(room.player2).emit("client:updateGame", {rival : room.player1_pos, ballPos: {X: ballMirrorX, Y: room.ball_pos.Y}});
      }
    }

  }

  @SubscribeMessage('server:match')
  async match(
    @ConnectedSocket() socket: Socket,
    @MessageBody('id') userId: number,
  ) {
    const user = await this.gameService.getUser(userId);
    console.log('Emit Match ', socket.id, "User", user.full_name);
    return await this.gameService.match(socket, userId);
  }

  //body : player entity
  @SubscribeMessage('server:updatePlayer')
  async movePlayer(@ConnectedSocket() socket : Socket, @MessageBody() body : any)
  {
    const gamePlayers = await this.gameService.getGamePlayers();
    const gameId = gamePlayers.get(socket.id);
    //console.log("Game", gameId, "Socket", socket.id);
    //console.log(await this.gameService.getGameRooms());
    const game = await this.gameService.getGameRoom(gameId);
    //console.log(game);

    if(game.player1 == socket.id) {
      game.player1_pos = body;
    }
    else {
      game.player2_pos = body;
    }
  }

  @SubscribeMessage('server:hit')
  async hit(@ConnectedSocket() socket : Socket, @MessageBody() body : any)
  {
    const gamePlayers = await this.gameService.getGamePlayers();
    const gameId = gamePlayers.get(socket.id);
    const game = await this.gameService.getGameRoom(gameId);

    if(game.player1 == socket.id) {
      const playerPos = this.SCREEN_HEIGHT * game.player1_pos.Y / 100;
      if(game.ball_pos.X - this.BALL_RADIUS <= game.player1_pos.X + this.PLAYER_WIDTH && game.ball_pos.Y >= playerPos && game.ball_pos.Y <= (playerPos + this.PLAYER_HEIGHT)) {
        game.ball_speed.X = -game.ball_speed.X;
        game.ball_speed.X  = Math.min(Math.max(game.ball_speed.X * 1.2, -12), 12);
      }
    }
    else
    {
      const playerPos = this.SCREEN_HEIGHT * game.player2_pos.Y / 100;
      if(game.ball_pos.X + this.BALL_RADIUS >= playerPos && game.ball_pos.Y >= playerPos && playerPos + this.PLAYER_HEIGHT) {
        game.ball_speed.X = -game.ball_speed.X;
        game.ball_speed.X  = Math.min(Math.max(game.ball_speed.X * 1.2, -12), 12);
      }
    }
  }


}
