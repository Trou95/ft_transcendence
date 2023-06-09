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

  constructor(private readonly gameService: GameService) {}

  afterInit(server: Server) {
    this.gameService.server = server;
  }

  async handleConnection(client: Socket) {
    console.log('Connected Client: ', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected:  ', client.id);
    await this.gameService.deleteRoom(client.id);
    //await this.gameService.finishGame(client.id);
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
  @SubscribeMessage('server:movePlayer')
  async movePlayer(@ConnectedSocket() socket : Socket, @MessageBody() body : any)
  {
    const players = await this.gameService.getGamePlayers();
    console.log(players);
    const gameId = players.get(socket.id);
    console.log("Game", gameId, "Socket", socket.id);
    console.log(await this.gameService.getGameRooms());
    const game = await this.gameService.getGameRoom(gameId);
    console.log(game);

    game.ball_pos = {
      X: game.ball_pos.X + 1,
      Y: game.ball_pos.Y + 1,
    }

    if(game.player1 == socket.id) {
      game.player1_pos = body;
      socket.to(game.player2).emit("movePlayer", body);
      socket.to(game.player2).emit("moveBall", game.ball_pos);
    }
    else {
      game.player2_pos = body;
      socket.to(game.player1).emit("movePlayer", body);
      socket.to(game.player1).emit("moveBall", game.ball_pos);
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
