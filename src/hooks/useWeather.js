import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherForecast } from "../services/weatherApi";

import React, { useEffect, useState } from 'react'

export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [unit, setUnits] = useState("C")

    const fetchWeatherByCity = async (city) => {
        setLoading(true)
        setError(null)
        try{
            const[weatherData, foreCast] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city),
            ])
            setCurrentWeather(weatherData)
            setForecast(foreCast)
        }catch(err){
            setError(err instanceof Error ? err.message : "Failed to fetch weather data")
        }finally{
            setLoading(false)
        }
    }
    const fetchWeatherByLocation = async () => {
        if(!navigator.geolocation){
            setError("Geolocation is not supported by this browser")
        }
        setLoading(true)
        setError(null)
        navigator.geolocation.getCurrentPosition(async(position)=>{
            try{
                const {latitude, longitude} = position.coords;
                const weatherData = await getCurrentWeatherByCoords(latitude, longitude)
                setCurrentWeather(weatherData)
                // ask fetch forecast for the current location

                const forecastData = await getWeatherForecast(weatherData.name);
                setForecast(forecastData)

            }catch(err){
                setError(err instanceof Error ? err.message : "Failed to fetch weather data")

            }finally{
                setLoading(false)
            }
        },(error)=>{
            setError("Unable to receive your location")
            setLoading(false)
        }
        )
    }
    const toggleUnit = () =>{
        setUnits(unit === "C" ? "F" : "C")
    }

    return {currentWeather, forecast,loading,error,unit,fetchWeatherByCity,fetchWeatherByLocation,toggleUnit}

}