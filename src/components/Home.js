import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {

    const [weatherData, setWeatherData] = useState([]);
    const [forecast, setForecast] = useState([]);
    const [data, setData] = useState({
        celcius: 10,
        country: 'RSA',
        name: 'Pretoria',
        sunset: 100,
        humidity: 10,
        speed: 2
    });
    let lat = null;
    let lon = null;

    const API_KEY = 'c0b808910ab149f3016064387ee6a1b9';

    useEffect(() => {

        getWeatherData();
    }, [])

    useEffect(() => {
        fetchForecast();
    }, [])

    const getWeatherData = async () => {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log("View latitude: ", lat);
        })

        const url_weather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        try {
            const response = await axios.get(url_weather);
            const data = response.data;
            setWeatherData(data);
            console.log("Weather fetched data:", data);

            axios.get(url_weather)
                .then(res => {
                    setData({
                        ...data,
                        celcius: res.data.main.temp,
                        country: res.data.sys.country,
                        name: res.data.name,
                        sunset: res.data.sys.sunset,
                        humidity: res.data.main.humidity,
                        speed: res.data.wind.speed
                    })
                })

        } catch (error) {

            if (error.response) {
                // Request was made but server responded with non 2xx status code
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // Request was made but no response was received
                console.log(error.request);
            } else {
                // Unexpected error occurred
                console.log("Failed to fetch data: ", error.message);
            }
        }
    }

    const fetchForecast = async () => {
        try {
          let lat, lon;
          const getPosition = () => {
            return new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
          };
          const position = await getPosition();
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          console.log('View latitude:', lat);
      
          const url_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
          const response = await axios.get(url_forecast);
          const data = response.data;
          setForecast(data.list.slice(0, 4));
          console.log('View forecast data:', data);
        } catch (error) {
          console.log(error);
        }
      };
      

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: "short", month: "short", day: "numeric" };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

    const date = new Date();
    const currentDate = date.toLocaleDateString();
    const options = { weekday: 'long' };
    const dayName = date.toLocaleString('en-US', options);

    return (
        <div className="container">
            <div className="weather-side">
                <div className="weather-gradient"></div>
                <div className="date-container">
                    <h2 className="date-dayname">{dayName}</h2>
                    <span className="date-day">{currentDate}</span>
                    <i className="location-icon" data-feather="map-pin"></i>
                    <span className="location">{data.name}, {data.country}</span>
                </div>
                <div className="weather-container">
                    <i className="weather-icon" data-feather="sun"></i>
                    <h1 className="weather-temp">{((data.celcius) - 273.15).toFixed(2)}°C</h1>
                    <h3 className="weather-desc">Sunny</h3>
                </div>
            </div>
            <div className="info-side">
                <div className="today-info-container">
                    <div className="today-info">
                        <div className="precipitation">
                            <span className="title">SUNSET</span>
                            <span className="value">{data.sunset}</span>
                            <div className="clear"></div>
                        </div>
                        <div className="humidity">
                            <span className="title">HUMIDITY</span>
                            <span className="value">{data.humidity}%</span>
                            <div className="clear"></div>
                        </div>
                        <div className="wind">
                            <span className="title">WIND</span>
                            <span className="value">{data.speed} km/h</span>
                            <div className="clear">
                            </div>
                        </div>
                    </div>
                </div>

                <div className="week-container">
                    {forecast.length > 0 ? (
                        forecast.map((item) => (
                            <ul className="week-list" key={item.dt}>
                                <li className="active">
                                    <i className="day-icon" data-feather="sun"></i>
                                    <span className="day-name">{formatDate(item.dt_txt)}</span>
                                    <span className="day-temp">{item.weather[0].description}</span>
                                </li>
                            </ul>
                        ))
                    ) : (
                        <p>Loading forecast...</p>
                    )}
                    <div className="clear"></div>
                </div>

                <div className="location-container">
                    <button className="location-button" onClick={getWeatherData} >
                        <i data-feather="map-pin"></i>
                        <span>Check Weather</span>
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Home;