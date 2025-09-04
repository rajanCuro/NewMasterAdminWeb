import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://192.168.1.5:8082/ws'; 

const stompClient = new Client({
  brokerURL: SOCKET_URL, 
  webSocketFactory: () => new SockJS(SOCKET_URL), 
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  debug: (str) => console.log(str),
});

export default stompClient;
