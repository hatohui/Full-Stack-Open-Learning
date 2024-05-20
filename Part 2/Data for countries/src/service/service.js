import axios from "axios";

const KEY = "719233888f8ad7d08cf23a8e00c97782"
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather";

const getData = () =>  
    axios.get(`${baseUrl}/all`)
    .then(response => response.data)

const getWithName = name =>
    axios.get(`${baseUrl}/name/${name}`)
        .then(response => response.data)

const getWeather = object => 
    axios.get(`${weatherAPI}?lat=${object.latlng[0]}&lon=${object.latlng[1]}&appid=${KEY}`)
        .then(response => response.data)

export default {getData, getWithName, getWeather};