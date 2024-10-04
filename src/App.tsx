import { useEffect, useState } from "react";
import "./App.css";
import Humidity from "./Components/Humidity";
import Temp from "./Components/Temp";
import { Client } from "@stomp/stompjs";
import LatestTempAndHumid from "./Components/LatestTempAndHumid";


interface HumidityDataPoint {
  id: number;
  date: string;
  time: string;
  humidity: number;
}
interface TempDataPoint {
  id: number;
  date: string;
  time: string;
  temp: number;
}

function App() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [humidity, sethumidity] = useState<HumidityDataPoint[]>([]);
  const [temp, setTemp] = useState<TempDataPoint[]>([]);
  const [lastTemp, setLastTemp] = useState<number | null>(null);
  const [lastHumidity, setLastHumidity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    console.log("Trying to connect!");

    const socket = /* new SockJS("http://localhost:8080/connect") */new WebSocket('ws://localhost:8080/connect');

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

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <>
     <h1>IoT Temperature and Humidity Monitor</h1>
     <LatestTempAndHumid lastTemp={lastTemp} lastHumidity={lastHumidity}/>
      <Temp stompClient={stompClient} chartData={temp} setChartData={setTemp} setLastTemp={setLastTemp} lastTemp={lastTemp} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Humidity stompClient={stompClient} chartData={humidity} setChartData={sethumidity} setLastTemp={setLastTemp} lastHumidity={lastHumidity} setLastHumidity={setLastHumidity} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </>
  );
}

export default App;
