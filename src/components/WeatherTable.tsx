import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface Props {
    weatherData: any;
}

export default function BasicTable({weatherData}:Props) {
    console.log('Weather:')
    console.dir(weatherData)

    // Conversion Functions
    const kelToFah = (temp:number) => {
        return Math.round(((temp - 273.15) * 15 / 9) + 32 )
    }

    const degToCompass = (deg:number) => {
        const val:number = ((deg/22.5)+.5)
        const arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
        return arr[Math.round(val % 16)]
    }

    
    const temp = kelToFah(weatherData.main.temp)
    const high = kelToFah(weatherData.main.temp_max)
    const low = kelToFah(weatherData.main.temp_min)
    const direction = degToCompass(weatherData.wind.deg)
    const sunRiseDate = new Date(weatherData.sys.sunrise * 1000);
    const sunSetDate = new Date(weatherData.sys.sunset * 1000);
    const sunRise = `${sunRiseDate.getHours()} : ${('0' + sunRiseDate.getMinutes()).substr(-2)}`;
    const sunSet = `${sunSetDate.getHours()} : ${('0' + sunSetDate.getMinutes()).substr(-2)}`;

    // Hours part from the timestamp
    // var hours = date.getHours();



  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell variant='head' style={{fontSize:'1.75em'}}>
                {weatherData.name }
            </TableCell>
            <TableCell align="right" style={{fontSize:'1.75em'}}>{temp} <span>&#176;</span>F</TableCell>
            <TableCell align="right" style={{fontSize:'1.75em'}}>
                <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} />
                </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell variant="head" style={{width: '20%'}}>High/Low:</TableCell>
                <TableCell align="right">{`${high} / ${low}`} <span>&#176;</span> F</TableCell>
                <TableCell variant="head">humidity:</TableCell>
                <TableCell align="right">{weatherData.main.humidity} %</TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Condition:</TableCell>
                <TableCell align="right">{weatherData.weather[0].description}</TableCell>
                <TableCell variant="head">Cloudiness:</TableCell>
                <TableCell align="right">{weatherData.clouds.all} %</TableCell>
            </TableRow>
            <TableRow>
                <TableCell variant="head">Wind Speed:</TableCell>
                <TableCell align="right">{weatherData.wind.speed} m/s</TableCell>
                <TableCell variant="head">Wind <span>&#176;</span>:</TableCell>
                <TableCell align="right">{direction} </TableCell>                
            </TableRow>
            <TableRow>
                <TableCell variant="head">Sunrise:</TableCell>
                <TableCell align="right">{sunRise} </TableCell>
                <TableCell variant="head">Sunset:</TableCell>
                <TableCell align="right">{sunSet} </TableCell>                
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}