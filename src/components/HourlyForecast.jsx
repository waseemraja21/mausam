import React from "react";

const HourlyForecast = ({ hourly }) => {
    return (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Hourly Precipitation 🌧️</h3>
            <div className="flex overflow-x-auto space-x-4 p-2">
                {hourly.slice(0, 6).map((hour, index) => (
                    <div key={index} className="flex flex-col items-center p-2 bg-white rounded-md shadow">
                        <p className="text-sm font-medium">{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                            alt="Weather Icon"
                            className="w-10 h-10"
                        />
                        <p className="text-blue-600 font-semibold">{Math.round(hour.pop * 100)}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourlyForecast;
