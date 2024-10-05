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
  dateTime: Date| null;
}
interface TempDataPoint {
  id: number;
  date: string;
  time: string;
  temp: number;
  dateTime: Date| null;
}

function App() {
  const today = new Date();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [humidity, sethumidity] = useState<HumidityDataPoint[]>([]);
  const [temp, setTemp] = useState<TempDataPoint[]>([]);
  const [lastTemp, setLastTemp] = useState<number | null>(null);
  const [lastHumidity, setLastHumidity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date >(today);
  const [startTime, setStartTime] = useState<Date>(today);
  startTime.setHours(0, 0, 0, 0);
  const [endTime, setEndTime] = useState<Date>(today);

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

  useEffect(() => {
    console.log("Selected date in App:", selectedDate);
  }, [selectedDate]);

  return (
    <>
     <h1>IoT Temperature and Humidity Monitor</h1>
     <LatestTempAndHumid stompClient={stompClient} lastTemp={lastTemp} lastHumidity={lastHumidity}
      setLastHumidity={setLastHumidity} temp={temp} humidity={humidity} setTemp={setTemp} setHumidity={sethumidity} setLastTemp={setLastTemp} setEndTime={setEndTime} selectedDate={selectedDate}/>
      <Temp stompClient={stompClient} chartData={temp} setChartData={setTemp} setLastTemp={setLastTemp} lastTemp={lastTemp} selectedDate={selectedDate} setSelectedDate={setSelectedDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} />
      <Humidity stompClient={stompClient} chartData={humidity} setChartData={sethumidity} lastHumidity={lastHumidity} setLastHumidity={setLastHumidity} selectedDate={selectedDate}  endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} />
    </>
  );
}

export default App;
