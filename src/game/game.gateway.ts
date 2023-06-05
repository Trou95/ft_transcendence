import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

@WebSocketGateway(9000, {
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: Socket) {
    console.log('Connected Client: ', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected:  ', client.id);
    await this.gameService.removePendingList(client.id);
  }

  @SubscribeMessage('matchRequest')
  async matchGame(
    @MessageBody('id') userId: number,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.gameService.addPendingList(socket, userId);
    console.log(await this.gameService.getPendingList());
  }

  @SubscribeMessage('movePlayer')
  movePlayer(@MessageBody() body, @ConnectedSocket() client: Socket) {
    console.log(body);
    client.emit('movePlayer', body);

    // return 'deneme';
  }
}
