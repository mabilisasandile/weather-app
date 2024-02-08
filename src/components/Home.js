import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import weatherImage from '../images/partly_cloudly.jpeg';
import clouds from '../images/clouds.jpeg';
import clear from '../images/clear.jpeg';
import rain from '../images/rain.jpeg';
import drizzle from '../images/drizzle.jpeg';
import mist from '../images/mist_day.jpeg';

function Home() {

    const [forecast, setForecast] = useState([]);
    const [data, setData] = useState({
        celcius: 10,
        country: 'ZA',
        name: 'Pretoria',
        weather_desc: '',
        sunset: 100,
        humidity: 10,
        speed: 2
    });
    
    const API_KEY = 'c0b808910ab149f3016064387ee6a1b9';
    const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayInAWeek = new Date().getDay();
    const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, dayInAWeek));

    console.log("Forecast days: ", forecastDays);

    let lat = null;
    let lon = null;
    let imageChoice = '';


    useEffect(() => {
        getWeatherData();
        fetchForecast();
    }, [])

    const getWeatherData = async () => {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log("lat:", lat);
            console.log("lon:", lon);
        })

        const url_weather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        try {
            const response = await axios.get(url_weather);
            const data = response.data;
            console.log("Weather fetched data:", data);

            axios.get(url_weather)
                .then(res => {

                    //Determine the weather image
                    if (res.data.weather[0].main === "Clouds") {
                        imageChoice = 'Clouds';
                    } else if (res.data.weather[0].main === "Clear") {
                        imageChoice = 'Clear';
                    } else if (res.data.weather[0].main === "Rain") {
                        imageChoice = 'Rain';
                    } else if (res.data.weather[0].main === "Drizzle") {
                        imageChoice = 'Drizzle';
                    } else if (res.data.weather[0].main === "Mist") {
                        imageChoice = 'Mist';
                    } else {
                        imageChoice = 'weatherImage';
                    }

                    console.log("Weather image choice: ", imageChoice);

                    setData({
                        ...data,
                        celcius: res.data.main.temp,
                        country: res.data.sys.country,
                        name: res.data.name,
                        weather_desc: imageChoice,
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
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            let cnt = 4;
            console.log('View latitude:', lat);

            const url_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
            // const url_forecast = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${API_KEY}`;

            const response = await axios.get(url_forecast);
            const data = response.data;

            console.log('View forecast data:', data);

            const organizedData = organizeForecastData(data.list);
            setForecast(organizedData);
            console.log("View organized forecast data:", organizedData);

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
                console.log("Failed to fetch forecast data: ", error.message);
            }
        }
    };


    // Organize Forecast data
    const organizeForecastData = (forecastList) => {
        const organizedData = {};

        forecastList.forEach((item) => {
            const date = formatDate(item.dt_txt);
            console.log("Forecast date:", date);

            if (!organizedData[date]) {
                organizedData[date] = {
                    dt: item.dt,
                    date: date,
                    temperature: ((item.main.temp) - 273.15).toFixed(2),
                    description: item.weather[0].description,
                };
            }
        });

        return Object.values(organizedData);
    };

    const date = new Date();
    const currentDate = date.toLocaleDateString();
    const options = { weekday: 'long' };
    const dayName = date.toLocaleString('en-US', options);

    const formatDate = (dateStr) => {
        try {
            // The date string from OpenWeatherMap API is in the format 'yyyy-mm-dd hh:mm:ss'
            // Example: '2023-12-01 12:00:00'
            const [datePart, timePart] = dateStr.split(' ');
            const [year, month, day] = datePart.split('-');
            const [hour, minute, second] = timePart.split(':');

            const date = new Date(year, month - 1, day, hour, minute, second);

            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(date);
        } catch (error) {
            console.error('Error formatting date:', dateStr, error);
            return 'Invalid Date';
        }
    };


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
                <div>
                    {imageChoice === "Clouds" ?
                        <img src={clouds} className='img-weather' alt='weather image' />
                        : imageChoice === "Clear" ?
                            <img src={clear} className='img-weather' alt='weather image' />
                            : imageChoice === "Rain" ?
                                <img src={rain} className='img-weather' alt='weather image' />
                                : imageChoice === "Drizzle" ?
                                    <img src={drizzle} className='img-weather' alt='weather image' />
                                    : imageChoice === "Mist" ?
                                        <img src={mist} className='img-weather' alt='weather image' />
                                        :
                                        <img src={weatherImage} className='img-weather' alt='weather image' />
                    }

                </div>
                <div className="weather-container">
                    <i className="weather-icon" data-feather="sun"></i>
                    <h1 className="weather-temp">{((data.celcius) - 273.15).toFixed(2)}°C</h1>
                    {/* <h1 className="weather-temp">{data.celcius.toFixed(2)}°C</h1> */}
                    <h3 className="weather-desc">{data.weather_desc}</h3>
                    <div className="location-container">
                    <button className="location-button" onClick={getWeatherData} >
                        <i data-feather="map-pin"></i>
                        <span>Check Weather</span>
                    </button>
                </div>
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
                            <div className="clear"></div>
                        </div>
                    </div>
                </div>

                <div className="week-container">
                    {forecast.length > 0 ? (
                        forecast.map((item) => (
                            <ul className="week-list" key={item.dt}>
                                <li className="active">
                                    <i className="day-icon" data-feather="sun"></i>
                                    <span className="day-name">{item.date} | </span>
                                    <span className="day-temp"> {item.temperature}°C | {item.description}</span>
                                </li>
                            </ul>
                        ))
                    ) : (
                        <p>Loading forecast...</p>
                    )}
                    <div className="clear"></div>
                </div>

                
            </div>
        </div >
    );
}

export default Home;