import axios from 'axios';
import './App.css';
import {LoadingButton} from "@mui/lab";
import {Container,Typography,Box,TextField} from "@mui/material";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=es&q=`;
const BACKEND_API = 'http://localhost:5000/api/weather/save';

export default function App(){

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const saveWeatherData = async (weatherData) => {
    try {
      const response = await axios.post(BACKEND_API, weatherData);
      console.log('Weather data saved:', response.data);
    } catch (error) {
      console.error('Error saving weather data:', error);
    }
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    console.log("submit");
    setLoading(true);
    setError({
      error: false,
      message:"",
    })
    try {
      if(!city.trim()) throw {message: "El campo ciudad es obligatorio!"};

      const res = await fetch(`${API_WEATHER}${city}`);
      const data = await res.json();

      if(data.error) throw {message: data.error.message};

      const weatherData = {
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      };
      setWeather(weatherData);
      saveWeatherData(weatherData);
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      })
    } finally {
      setLoading(false);
    }
  }

  

  return(
    <>
        <Container
    maxWidth="xs"
    sx={{mt:2}}
     className="container"
>

    <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
        className="title"
    >
        Clima en el Mundo
      </Typography>
      <Box
        className="form"
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
         id="city"
         label="Ciudad"
         variant="outlined"
         size="small"
         required
         value={city}
         onChange={(e) => setCity(e.target.value)}
         error={error.error}
         helperText={error.message}
         className="textField"
        />

        <LoadingButton
           type="submit"
           variant="contained"
           loading={loading}
           loadingIndicator="Buscando..."
           className="loadingButton"
        >
          Buscar
        </LoadingButton>
      </Box> 

      {weather.city && (
        <Box
        className="weatherCard"
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            className="weatherCity"
          >
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
            className="weatherIcon"
          />
          <Typography
            variant="h5"
            component="h3"
            className="weatherTemp"
          >
            {weather.temperature} °C
          </Typography>
          <Typography
            variant="h6"
            component="h4"
            className="weatherCondition"
          >
            {weather.conditionText}
          </Typography>
        </Box>
      )}
       <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
        className="footer"
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
            className="apiLink"
        >
          WeatherAPI.com
        </a>
      </Typography>
</Container>

    </>
  );
}