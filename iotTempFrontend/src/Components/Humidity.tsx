import { Client } from "@stomp/stompjs";
import { AgCharts } from "ag-charts-react";
import { useEffect, useState } from "react";

interface props {
  stompClient: Client | null;
}

interface DataPoint {
  id: number;
  date: string;
  time: string;
  humidity: number;
}

const combineDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

export default function Humidity(props: props) {
  const [lastHumidity, setLastHumidity] = useState<String | null>(null);
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
        stroke: "#000000",
        strokeWidth: 3,
      },
    ],
    axes: [
      {
        type: "number",
        position: "left",
        title: { text: "Humidity (%)" },
        min: 0,
        max: 100,
      },
      {
        type: "time",
        position: "bottom",
        title: { text: "Time" },
        tick: {},
      },
    ],
  });

  useEffect(() => {
    getHumidity("hour");
    if (props.stompClient) {
      console.log("test: " + props.stompClient);
      const lastHumiditySub = props.stompClient.subscribe(
        "/arduino/latest",
        (message) => {
          setLastHumidity(JSON.parse(message.body));
        }
      );
      lastHumiditySub;
    }
  }, [props.stompClient]);

  useEffect(() => {
    console.log(lastHumidity);
  }, [lastHumidity]);

  const getHumidity = (input: string) => {
    fetch(`http://localhost:8080/humidity/${input}`)
      .then((res) => res.json())
      .then((data: DataPoint[]) => {
        const transformedData = data.map((item) => ({
          ...item,
          dateTime: combineDateTime(item.date, item.time),
        }));

        setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          data: transformedData,
        }));
      });
  };

  return (
    <>
      <div>Humidity</div>
      <AgCharts options={chartOptions} />
    </>
  );
}
