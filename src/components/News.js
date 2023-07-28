import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const apiKey = "12ae35fbd3604d25a4c4a651f2d05143";
const apiUrl = "https://newsapi.org/v2";
const defaultCountry = "za";

function News() {
    const [newsData, setNewsData] = useState([]);
    const [location_name, setLocationName] = useState('');

    const getTopHeadlines = async (country) => {
        try {
            const response = await axios.get(`${apiUrl}/top-headlines`, {
                params: {
                    country: country,
                    apiKey: apiKey,
                },
            });
            setNewsData(response.data.articles);
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    useEffect(()=>{

        getTopHeadlines(defaultCountry);
    }, [])

    const Search = async (query) => {
        try {
            const response = await axios.get(`${apiUrl}/everything`, {
                params: {
                    q: query,
                    apiKey: apiKey,
                },
            });
            
            setNewsData(response.data.articles);
            console.log("View news:", response.data.articles);
            return response.data;
        } catch (err) {
            console.error(err);
            if (err.response) {
                // Request was made but server responded with non 2xx status code
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
              } else if (err.request) {
                // Request was made but no response was received
                console.log(err.request);
              } else {
                // Unexpected error occurred
                console.log('Error', err.message);
              }
            return null;
        }
    }

   


    return (
        <div className="container-news">
            <div>
                <input
                    type='text'
                    placeholder='Enter location'
                    className='input-search'
                    onChange={(event) => setLocationName(event.target.value)}
                />
                <br></br>
                <br></br>
                <button className="location-button" onClick={() => Search(location_name)} >
                    <i data-feather="map-pin"></i>
                    <span>Search News</span>
                </button>
                <br></br>
                <br></br>
            </div>
            <div>
                {newsData &&
                    newsData.map((article, index) => (
                        <div key={index}>
                            <h2>{article.title}</h2>
                            <img src={article.urlToImage} className='img-news-article' />
                            <p>{article.description}</p>
                            <h1>--------------------------------------------------------------</h1>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default News;