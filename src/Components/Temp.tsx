import { Client } from "@stomp/stompjs";
import React from "react";

interface props {
  stompClient: Client | null;
}

export default function Temp(props: props) {
  function getTemp(input: string) {
    fetch("http://localhost:8080/temp/" + input)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Temp: ", data);
      });
  }

  getTemp("hour");
  return <div>Temp</div>;
}
