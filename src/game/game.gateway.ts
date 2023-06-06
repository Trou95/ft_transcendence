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
    await this.gameService.finishGame(client.id);
  }

  @SubscribeMessage('match')
  async match(
    @ConnectedSocket() socket: Socket,
    @MessageBody('id') userId: number,
  ) {
    console.log('Emit Match ', socket.id);
    return await this.gameService.match(socket, userId);
    // await this.gameService.matchUser(socket, userId);
    // console.log(await this.gameService.getPendingList());
  }

  @SubscribeMessage('movePlayer')
  movePlayer(@MessageBody() body, @ConnectedSocket() client: Socket) {
    console.log(body);
    client.emit('movePlayer', body);

    // return 'deneme';
  }
}
