import React, { useEffect } from 'react';
import stompClient from './socket';

const WebSocketComponent = () => {
  // alert("ccall")
  useEffect(() => {
    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/field-executive-location', (message) => {
        const payload = JSON.parse(message.body);
        console.log('Received location:', payload);
      });
    };

    stompClient.activate();

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, []);

  return null;
};

export default WebSocketComponent;
