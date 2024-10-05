import { Client } from "@stomp/stompjs";
import { AgCharts } from "ag-charts-react";
import { time } from "ag-charts-community";
import { useEffect, useState } from "react";
import "./CSS/chart.css";

interface Props {
  selectedDate: Date | null;
  stompClient: Client | null;
  chartData: DataPoint[];
  setChartData: Function;
  lastHumidity: number | null;
  setLastHumidity: Function;
  endTime: Date;
  setEndTime: Function;
  startTime: Date;
  setStartTime: Function;
}

interface DataPoint {
  id: number;
  date: string;
  time: string;
  humidity: number;
  dateTime: Date | null;
}

const combineDateTime = (date: string, time: string): Date => {
  return new Date(date + "T" + time);
};

export default function Humidity(props: Props) {
  
  
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
        min:props.startTime,
        max: props.endTime ,
        interval: { step: time.hour },
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
      
    }
  }, [props.selectedDate]);

  const getHumidity = (input: string) => {
    fetch("http://localhost:8080/humidity/" + input )
      .then((res) => res.json())
      .then((data: DataPoint[]) => {
        const transformedData = data.map((item) => ({
          ...item,
          dateTime: combineDateTime(item.date, item.time),
        }));
        props.setChartData(transformedData);
        props.setStartTime(new Date(transformedData[0].dateTime));
        props.setEndTime(new Date(transformedData[data.length - 1].dateTime));
        props.endTime.setMinutes(props.endTime.getMinutes() + 10)
        
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

  useEffect(() => {
    setChartOptions((prevOptions: any) => ({
      ...prevOptions,
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
          min:props.startTime,
          max: props.endTime ,
          interval: { step: time.minute },
          label: {
            format: "%H:%M",
          },
        },
      ],
    }))
    

    
  }, [props.startTime,props.endTime,props.chartData]);

  return (
    <>
      <div className="chart-container">
        <AgCharts options={chartOptions} />
      </div>
    </>
  );
}
