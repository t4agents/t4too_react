import { API_BASE_URL as DEFAULT_API_BASE_URL } from '../config/public';

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    DEFAULT_API_BASE_URL;

export const API_ENDPOINTS = {
    WEATHER_CURRENT: 'https://api.open-meteo.com/v1/forecast',
    WEATHER_FORECAST: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
};

export const API_PARAMS = {
    CURRENT_WEATHER: {
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,visibility',
        timezone: 'auto',
    },
    FORECAST: {
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        hourly: 'temperature_2m,weather_code,precipitation_probability',
        timezone: 'auto',
    },
};

export const WEATHER_CODES = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Foggy', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌦️' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    71: { description: 'Slight snow', icon: '🌨️' },
    73: { description: 'Moderate snow', icon: '🌨️' },
    75: { description: 'Heavy snow', icon: '🌨️' },
    77: { description: 'Snow grains', icon: '🌨️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    85: { description: 'Slight snow showers', icon: '🌨️' },
    86: { description: 'Heavy snow showers', icon: '🌨️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
}; 
