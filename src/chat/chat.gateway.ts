import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(9000, {
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  private connectedClients = new Map<number, any>();

  afterInit(): void {
    console.log('websocket initialized ');
  }

  handleConnection(client: any, ...args): void {
    //console.log('client connected', client.id);
  }

  handleDisconnect(client: any): any {
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('connect-user')
  handleConnectUser(client: any, payload: any): any {
    this.connectedClients.set(payload, client.id);
    console.log('client: ', this.connectedClients);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): any {
    const receiverId = payload.recieverId;
    console.log(payload);
    const receiver = this.connectedClients.get(receiverId);
    console.log(this.connectedClients);
    console.log('reciever: ', receiver);

    if (receiver) {
      this.server.to(receiver).emit('message', payload);
    }
  }
}
