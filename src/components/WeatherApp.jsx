import axios from "axios";
import { useEffect, useState } from "react";

const WeatherApp = () => {
    const [city, setCity] = useState("");
    const [state, setState] = useState(""); // Store state name
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    // Function to format time
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Function to fetch weather data
    const fetchWeather = async (cityName) => {
        if (!cityName) return;
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
            );
            setWeather(response.data);
            setError("");
        } catch (error) {
            console.error("Error fetching weather:", error);
            setError("City not found. Please try again.");
            setWeather(null);
        }
    };

    // Function to fetch user's city and state using Geolocation API
    const fetchUserCity = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
            );
            if (response.data.length > 0) {
                const detectedCity = response.data[0].name;
                const detectedState = response.data[0].state; // Get state name
                setCity(detectedCity);
                setState(detectedState);
                fetchWeather(detectedCity); // Fetch weather for detected city
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            setError("Unable to detect location. Please enter a city manually.");
        }
    };

    // Get user's location on first load
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchUserCity(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setError("Location permission denied. Please enter a city manually.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Mosum</h1>

                {/* Search Input */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                    <button
                        onClick={() => fetchWeather(city)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Search
                    </button>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-2">{error}</p>}

                {/* Weather Data */}
                {weather && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold">{weather.name}, {state}</h2>
                        <p className="text-gray-700 capitalize">{weather.weather[0].description}</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt="Weather Icon"
                            className="mx-auto"
                        />
                        <p className="text-4xl font-bold">{weather.main.temp}°C</p>
                        <p className="text-gray-700">Feels like: {weather.main.feels_like}°C</p>

                        {/* Additional Weather Details */}
                        <div className="mt-4 flex justify-around text-gray-600">
                            <div>
                                <p className="font-semibold">Sunrise🌅</p>
                                <p className="text-gray-700">{formatTime(weather.sys.sunrise)}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Sunset🌇</p>
                                <p className="text-gray-700">{formatTime(weather.sys.sunset)}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-around text-gray-600">
                            <div>
                                <p className="font-semibold">Humidity</p>
                                <p>{weather.main.humidity}%</p>
                            </div>
                            <div>
                                <p className="font-semibold">Wind</p>
                                <p className="text-gray-700">
                                    {weather.wind.speed} m/s ({windDirections[Math.round(weather.wind.deg / 45) % 8]})
                                </p>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="mt-4">
                            <p className="text-gray-700">Location: {weather.name}, {state}, {weather.sys.country}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
