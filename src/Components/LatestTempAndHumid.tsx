
import { useEffect } from "react";
import "./CSS/Latest.css"

interface Props{
    stompClient: any;
    setLastHumidity: Function;
    setLastTemp: Function;
    temp: TempDataPoint[];
    humidity: HumidityDataPoint[];
    setTemp: Function;
    setHumidity: Function;
    lastTemp: number | null,
    lastHumidity: number | null,
    setEndTime: Function;
    selectedDate: Date ;
}
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


export default function LatestTempAndHumid(props: Props) {
  const date = props.selectedDate;

  useEffect(() => {
    if (props.stompClient) {
      const lastSub = props.stompClient.subscribe("/latest",
        (message: { body: string; }) => {
          const parsedData = JSON.parse(message.body);
          props.setLastHumidity(parsedData.humidity);
          props.setLastTemp(parsedData.temperature);

          const newhumidityDataPoint: HumidityDataPoint = {
            id: props.humidity.length + 1, 
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), 
            humidity: parsedData.humidity,
            dateTime: new Date()
          }

          const newTempDataPoint: TempDataPoint = {
            id: props.temp.length + 1, 
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), 
            temp: parsedData.temperature,
            dateTime: new Date()
          }
          if(date.getDay() === new Date().getDay()){
          props.setTemp([...props.temp,newTempDataPoint])
          props.setHumidity([...props.humidity,newhumidityDataPoint]);
          
          }
          
        }
      );
      
      return () => {
        lastSub.unsubscribe();
      };
    
  }
  }, [props.stompClient]);

  return (
    <>
    <div className='div-container'>
    <div className='valeu-div'>
        <h5 id='head'> Temp</h5>
        <h2 className='valeu' id='last-temp' >{props.lastTemp}°C</h2>
    </div>
    <div  className='valeu-div'>
        <h5 id='head'>Humidity</h5>
        <h2 className='valeu' id='last-humidity'>{props.lastHumidity}%</h2>
    </div>
    </div>
    </>
  )
}
