import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { time } from "ag-charts-community";
import "./CSS/chart.css";
import { AgCharts } from "ag-charts-react";

interface Props {
  selectedDate: Date ;
  setSelectedDate: Function;
  stompClient: Client | null;
  chartData: DataPoint[];
  setChartData: Function;
  setLastTemp: Function;
  lastTemp: number | null;
  endTime: Date;
  setEndTime: Function;
  startTime: Date;
  setStartTime: Function;
}

interface DataPoint {
  id: number;
  date: string;
  time: string;
  temp: number;
}

const combineDateTime = (date: string, time: string): Date => {
  return new Date(date + "T" + time);
};


export default function Temp(props: Props) {
  

  const [chartOptions, setChartOptions] = useState<any>({
    title: {
      text: "temperature",
    },
    data: [],
    series: [
      {
        type: "line",
        xKey: "dateTime",
        yKey: "temp",
        yName: "temperature C°",
        marker: {
          enabled: false,
        },
      },
    ],
    axes: [
      {
        type: "number",
        position: "left",
        title: { text: "temperature C°" },
        min: -10,
        max: 40,
        interval: { step: 10 },
      },
      {
        type: "time",
        nice: false,
        position: "bottom",
        min: props.startTime,
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
          title: { text: "temperature C°" },
          min: -10,
          max: 40,
          interval: { step: 10 },
        },
        {
          type: "time",
          nice: false,
          position: "bottom",
          min: props.startTime,
          max: props.endTime.setMinutes(props.endTime.getMinutes() + 10) ,
          interval: { step: time.minute },
          label: {
            format: "%H:%M",
          },
        },
      ],
    }))

    
  }, [props.startTime,props.endTime]);

  

  useEffect(() => {
      getTemp(props.selectedDate.toLocaleDateString());
      
  }, [props.selectedDate]);

  function getTemp(input: string) {
    fetch("http://localhost:8080/temp/" + input)
      .then((res) => res.json())
      .then(
        (data: DataPoint[]) => {
          
          const transformedData = data.map((item) => ({
            ...item,
            dateTime: combineDateTime(item.date, item.time),
          }));
          props.setStartTime(new Date(transformedData[0].dateTime));
          props.setEndTime(new Date(transformedData[data.length - 1].dateTime));

          if(props.lastTemp === null){
          props.setLastTemp(data[data.length - 1].temp);
          
        }
          props.setChartData(transformedData);
          
        }
      );
  }
  return <>
  <div className="outer-container">
  <div className="chart-container">
        <AgCharts options={chartOptions} />
      </div>
        <div>
          <input id="date-selector" type="Date" value={props.startTime.toLocaleDateString()} max={new Date().toLocaleDateString()} onChange={(e)=>{
            if(e.target.value){
            props.setSelectedDate(new Date(e.target.value));
            }
            
          }
          } />
        </div>
      </div>
  </>;
}
