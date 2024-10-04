
import "./CSS/Latest.css"

interface Props{
    lastTemp: number | null,
    lastHumidity: number | null,
  
}

export default function LatestTempAndHumid(props: Props) {
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
