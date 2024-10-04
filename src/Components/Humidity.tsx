import { Client } from "@stomp/stompjs";
import { AgCharts } from "ag-charts-react";
import { time } from "ag-charts-community";
import { useEffect, useState } from "react";
import "./CSS/chart.css";

interface Props {
  selectedDate: Date | null;
  setSelectedDate: Function;
  stompClient: Client | null;
  chartData: DataPoint[];
  setChartData: Function;
  setLastTemp: Function;
  lastHumidity: number | null;
  setLastHumidity: Function;
}

interface DataPoint {
  id: number;
  date: string;
  time: string;
  humidity: number;
}

const combineDateTime = (date: string, time: string): Date => {
  return new Date(date + "T" + time);
};

export default function Humidity(props: Props) {
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  
  
  const [chartOptions, setChartOptions] = useState<any>({
    title: {
      text: "Humidity Levels",
    },
    data: [],
    series: [
      {
        type: "line",
        xKey: "dateTime",
        yKey: "humidity",
        yName: "Humidity (%)",
        marker: {
          enabled: false,
        },
      },
    ],
    axes: [
      {
        type: "number",
        position: "left",
        title: { text: "Humidity (%)" },
        min: 0,
        max: 100,
        interval: { step: 20 },
      },
      {
        type: "time",
        nice: false,
        position: "bottom",
        min: startTime,
        max: new Date(),
        interval: { step: time.minute },
        label: {
          format: "%H:%M",
        },
      },
    ],
    background: {
      fill: "transparent",
    },
  });

  useEffect(() => {
    if(props.selectedDate !== null){
      getHumidity(props.selectedDate.toLocaleDateString());
    }else{
      getHumidity("today");
      if (props.stompClient) {
        const lastSub = props.stompClient.subscribe("/latest",
          (message) => {
            const parsedData = JSON.parse(message.body);
            props.setLastHumidity(parsedData.humidity);
            props.setLastTemp(parsedData.temperature);

            const newDataPoint: DataPoint = {
              id: props.chartData.length + 1, 
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), 
              humidity: parsedData.humidity,
            }

            props.setChartData([...props.chartData,newDataPoint]);
            console.log("newDataPoint: " + JSON.stringify(newDataPoint));
            //console.log("chartData: " + JSON.stringify(props.chartData));
            
          }
        );
        
        return () => {
          lastSub.unsubscribe();
        };
      
    }
    }
  }, [props.stompClient,props.selectedDate]);

  const getHumidity = (input: string) => {
    fetch("http://localhost:8080/humidity/" + input )
      .then((res) => res.json())
      .then((data: DataPoint[]) => {
        const transformedData = data.map((item) => ({
          ...item,
          dateTime: combineDateTime(item.date, item.time),
        }));
        props.setChartData(transformedData);
        
        if(props.lastHumidity === null){
        props.setLastHumidity(data[data.length - 1].humidity);
        }
      });
  };

  useEffect(() => {
    
    
    setChartOptions((prevOptions: any) => ({
      ...prevOptions,
      data: props.chartData,
    }));
  }, [props.chartData]);

  return (
    <>
      <div className="chart-container">
        <AgCharts options={chartOptions} />
      </div>
    </>
  );
}
