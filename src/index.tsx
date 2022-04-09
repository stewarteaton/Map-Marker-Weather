import config from './config'
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react";
import * as ReactDom from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
// Components
import Map from './components/Map'
import { Marker } from '@react-google-maps/api';
// import Marker from './components/Marker'
import WeatherTable from './components/WeatherTable';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

interface WeatherData {
  data: any
}

const App: React.FC = () => {
  const [zoom, setZoom] = React.useState(6); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 25.848829675175036,  // initialize to miami
    lng: -80.21877539364475,
  });
  const [markerCoord, setMarkerCoord] = React.useState<google.maps.LatLng>();
  const [weatherData, setWeatherData] = React.useState<WeatherData>();
  // User Location status
  const [status, setStatus] = React.useState<string>('');

  // Fetch Weather Data when marker moved
  React.useEffect(() => {
    let fetchWeather = async () => {
      let response:any = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${markerCoord?.toJSON().lat}&lon=${markerCoord?.toJSON().lng}&appid=${config.weatherAPI.key}`);
      let res = await response.json()
      // console.log(res)
      if (res.cod === '400') {
        return console.log('Bad request to Weather API')
      } else setWeatherData(res)
    }
    fetchWeather()
    }, [markerCoord],
  );


  const onDragMarkerEnd = (e: google.maps.MapMouseEvent) => {
    console.log(String(e.latLng!))
    setMarkerCoord(e.latLng!)
  }


  return (
    <>
    <div className='App'>
      <nav className="navbar navbar-dark bg-dark ">
        <span className="navbar-brand mb-0 h1 title">Map Location Weather App</span>
      </nav>
      <div className='content_container'>
        <div className='map_container'>
          {status}
          <Wrapper apiKey={config.googleMapsAPI.key} render={render}>
            <Map
              center={center}
              zoom={zoom}
              setMarkerCoord={setMarkerCoord}
              setCenter={setCenter}
              setStatus={setStatus}
              style={{ flexGrow: "1", height: "100%" }}
            >
                <Marker key={1} position={markerCoord ? markerCoord : center} draggable={true} onDragEnd={(e) => onDragMarkerEnd(e)}/>
            </Map>
          </Wrapper>
        </div>
        
        <div className='table_container'>
          <div style={{width:'100%'}}>
            {weatherData && <WeatherTable weatherData={weatherData}/> }
          </div>
        </div>
      </div>
    </div>
    </>
  );
};



window.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(<App />, document.getElementById("root"));
});

export {};

