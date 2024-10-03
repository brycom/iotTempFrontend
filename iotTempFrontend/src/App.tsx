import { useEffect, useState } from "react";
import "./App.css";
import Humidity from "./Components/Humidity";
import Temp from "./Components/Temp";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

(function () {
  if (typeof global === "undefined") {
    (window as any).global = window;
  }
})();

function App() {
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    console.log("Trying to connect!");

    const socket = new SockJS("http://localhost:8080/connect");
    console.log(socket);

    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        setStompClient(client);
        console.log("Connection established");
      },
      onDisconnect: () => {
        console.log("Disconnected from websocket");
      },
      onWebSocketError: (error) => {
        console.error("WebSocket Error: ", error);
      },
    });
    console.log(client.connected);

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <>
      <Humidity stompClient={stompClient} />
      <Temp stompClient={stompClient} />
    </>
  );
}

export default App;
