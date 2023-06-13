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

@WebSocketGateway(9000, {
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{

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
      console.log(room);
      if(room.gameStatus == 1) {
        //Mirror player
        //console.log("adasdsa");
        this.gameService.server.to(room.player1).emit("client:updateGame", room.player2_pos);
        this.gameService.server.to(room.player2).emit("client:updateGame", room.player1_pos);
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

  /*
  @SubscribeMessage('movePlayer')
  movePlayer(@MessageBody() body, @ConnectedSocket() client: Socket) {
    console.log(body);
    client.emit('movePlayer', body);

    // return 'deneme';
  }
  */
}
