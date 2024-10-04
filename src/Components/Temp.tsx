import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { time } from "ag-charts-community";
import "./CSS/chart.css";
import { AgCharts } from "ag-charts-react";

interface Props {
  selectedDate: Date | null;
  setSelectedDate: Function;
  stompClient: Client | null;
  chartData: DataPoint[];
  setChartData: Function;
  setLastTemp: Function;
  lastTemp: number | null;
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

  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);

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
    
    
    setChartOptions((prevOptions: any) => ({
      ...prevOptions,
      data: props.chartData,
    }));
    
  }, [props.chartData]);

  useEffect(() => {
    if(props.selectedDate !== null){
      // här ska du peta in data i chartData som igentligen heter tempData i app.
      getTemp(props.selectedDate.toLocaleDateString());
      
    }else{
      getTemp("today");
    }
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
          <input id="date-selector" type="Date" defaultValue={startTime.toLocaleDateString()} max={new Date().toLocaleDateString()} onChange={(e)=>{
            props.setSelectedDate(new Date(e.target.value));
            
          }
          } />
        </div>
      </div>
  </>;
}
