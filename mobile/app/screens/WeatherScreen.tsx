import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WeatherCard } from '../components/WeatherCard';
import { darkTheme, lightTheme } from '../constants/theme';
import { getWeatherScreenStyles } from '../constants/styles';
import { useBackground } from '../contexts/BackgroundContext';
import { HourlyForecast, WeatherData, WeatherForecast } from '../types';

const FALLBACK_BG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';

export const WeatherScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const { currentBackgroundUrl } = useBackground();

    const placeholderWeather: WeatherData = useMemo(() => ({
        temperature: 22,
        feelsLike: 21,
        humidity: 58,
        windSpeed: 9,
        windDirection: 220,
        pressure: 1014,
        visibility: 10,
        precipitation: 0,
        weatherDescription: 'Partly cloudy',
        weatherIcon: '⛅',
        timestamp: new Date().toISOString(),
    }), []);

    const placeholderHourly: HourlyForecast[] = useMemo(() => {
        const now = Date.now();
        return [
            { time: new Date(now + 1 * 60 * 60 * 1000).toISOString(), temperature: 22, weatherDescription: 'Cloudy', weatherIcon: '☁️', precipitationProbability: 10 },
            { time: new Date(now + 3 * 60 * 60 * 1000).toISOString(), temperature: 21, weatherDescription: 'Cloudy', weatherIcon: '☁️', precipitationProbability: 15 },
            { time: new Date(now + 6 * 60 * 60 * 1000).toISOString(), temperature: 19, weatherDescription: 'Light rain', weatherIcon: '🌧️', precipitationProbability: 35 },
            { time: new Date(now + 9 * 60 * 60 * 1000).toISOString(), temperature: 18, weatherDescription: 'Light rain', weatherIcon: '🌧️', precipitationProbability: 40 },
            { time: new Date(now + 12 * 60 * 60 * 1000).toISOString(), temperature: 17, weatherDescription: 'Clear', weatherIcon: '☀️', precipitationProbability: 5 },
            { time: new Date(now + 15 * 60 * 60 * 1000).toISOString(), temperature: 16, weatherDescription: 'Clear', weatherIcon: '☀️', precipitationProbability: 0 },
        ];
    }, []);

    const placeholderForecast: WeatherForecast[] = useMemo(() => {
        const makeDate = (offsetDays: number) => {
            const d = new Date();
            d.setDate(d.getDate() + offsetDays);
            return d.toISOString().split('T')[0];
        };

        return [
            { date: makeDate(0), temperature: { min: 16, max: 23 }, weatherDescription: 'Partly cloudy', weatherIcon: '⛅', precipitation: 10, windSpeed: 8 },
            { date: makeDate(1), temperature: { min: 15, max: 21 }, weatherDescription: 'Light rain', weatherIcon: '🌧️', precipitation: 40, windSpeed: 12 },
            { date: makeDate(2), temperature: { min: 14, max: 20 }, weatherDescription: 'Overcast', weatherIcon: '☁️', precipitation: 20, windSpeed: 9 },
            { date: makeDate(3), temperature: { min: 13, max: 19 }, weatherDescription: 'Clear', weatherIcon: '☀️', precipitation: 0, windSpeed: 6 },
            { date: makeDate(4), temperature: { min: 12, max: 18 }, weatherDescription: 'Clear', weatherIcon: '☀️', precipitation: 0, windSpeed: 5 },
        ];
    }, []);

    const styles = getWeatherScreenStyles(currentTheme);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const filteredForecast = placeholderForecast.filter(day => {
        const [year, month, dayNum] = day.date.split('-').map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, dayNum));
        return dateObj >= today;
    });

    return (
        <ImageBackground
            source={{ uri: currentBackgroundUrl || FALLBACK_BG }}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Weather</Text>
                </View>

                <ScrollView style={styles.content}>
                    <WeatherCard
                        weather={placeholderWeather}
                        hourlyForecast={placeholderHourly}
                        theme={theme}
                    />

                    {filteredForecast.length > 0 && (
                        <View style={styles.forecastContainer}>
                            <Text style={styles.forecastTitle}>7-Day Forecast</Text>
                            {filteredForecast.map((day, index) => {
                                const [year, month, dayNum] = day.date.split('-').map(Number);
                                const dateObj = new Date(Date.UTC(year, month - 1, dayNum));

                                const now = new Date();
                                now.setUTCHours(0, 0, 0, 0);
                                const tomorrow = new Date(now);
                                tomorrow.setUTCDate(now.getUTCDate() + 1);
                                let dateLabel = dateObj.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    timeZone: 'UTC',
                                });
                                if (dateObj.getTime() === now.getTime()) {
                                    dateLabel = 'Today';
                                } else if (dateObj.getTime() === tomorrow.getTime()) {
                                    dateLabel = 'Tomorrow';
                                }

                                return (
                                    <View key={index} style={styles.forecastItem}>
                                        <Text style={styles.forecastDate}>
                                            {dateLabel}
                                        </Text>
                                        <View style={styles.forecastWeather}>
                                            <Text style={styles.forecastIcon}>{day.weatherIcon}</Text>
                                            <Text style={styles.forecastDescription}>
                                                {day.weatherDescription}
                                            </Text>
                                        </View>
                                        <Text style={styles.forecastTemp}>
                                            {day.temperature.min.toFixed(0)}° / {day.temperature.max.toFixed(0)}°
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};
