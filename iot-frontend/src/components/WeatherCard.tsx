import React, { useEffect, useState, useRef } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AirIcon from '@mui/icons-material/Air';
import NavigationIcon from '@mui/icons-material/Navigation';
import ThermostatIcon from '@mui/icons-material/Thermostat'
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloudIcon from '@mui/icons-material/Cloud';

interface SideBarLoginProps {
    darkMode: boolean;
    cityName: string;
}

interface WeatherData {
    city: string;
    temperature: number;
    windSpeed: number;
    windDeg: number;
    description: string;
    icon: string;
    timestamp: number;
}

const WeatherCard: React.FC<SideBarLoginProps> = ({ darkMode }) => {
    const [weather, setWeather] = useState<WeatherData[] | null>(null);
    const [cityName, setCityName] = useState("Warsaw");
    const [tempCity, setTempCity] = useState(cityName);
    const [editingCity, setEditingCity] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setError(null);
            try {
                const response = await fetch(`http://localhost:3100/weather/forecast/${cityName}`);
                if (!response.ok) throw new Error("API error");
                const data = await response.json();
                setWeather(data);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 5000);
        return () => clearInterval(interval);
    }, [cityName]);

    const handleCitySubmit = () => {
        if (tempCity.trim() !== "") {
            setCityName(tempCity.trim());
        }
        setEditingCity(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editingCity && cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setEditingCity(false);
                setTempCity(cityName);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingCity, cityName]);

    const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        if (scrollRef.current) {
            e.preventDefault();
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <Card
            ref={cardRef}
            sx={{
                minWidth: 280,
                backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                color: darkMode ? '#fff' : '#000',
            }}
        >
            <CardContent sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        filter: editingCity ? 'blur(2px)' : 'none',
                        transition: 'filter 0.2s'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudIcon fontSize="medium" />
                        <Typography
                            sx={{
                                fontSize: { xs: '0.6rem', sm: '1rem', md: '1.1rem' },
                                color: darkMode ? '#ccc' : '#000',
                                fontFamily: 'Inter Medium',
                                textShadow: darkMode ? '1px 1px 2px #000' : '1px 1px 2px #888',
                            }}
                        >
                            Weather
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => {
                            if (editingCity) handleCitySubmit();
                            else {
                                setEditingCity(true);
                                setTempCity(cityName);
                            }
                        }}
                        size="small"
                        sx={{
                            color: darkMode ? '#1976d2' : '#000',
                            '&:hover': { backgroundColor: darkMode ? '#1565c0' : '#eee' },
                            '&:focus': { outline: 'none', boxShadow: 'none', transform: 'none' }
                        }}
                    >
                        <LocationCityIcon fontSize="small" />
                    </IconButton>
                </Box>

                {editingCity && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 1,
                            zIndex: 10,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '1.1rem',
                                fontFamily: 'Inter Semi Bold',
                                color: darkMode ? '#fff' : '#000',
                                textShadow: darkMode ? '1px 1px 2px #000' : '1px 1px 2px #888',
                            }}
                        >
                            Change city
                        </Typography>
                        <TextField
                            size="small"
                            placeholder="Enter city name"
                            value={tempCity}
                            onChange={(e) => setTempCity(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCitySubmit();
                                if (e.key === 'Escape') setEditingCity(false);
                            }}
                            sx={{
                                width: { xs: '75%', sm: 180 },
                                fontFamily: 'Inter Medium',
                                '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
                                '& .MuiInputBase-input::placeholder': {
                                    color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                                },
                            }}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                )}

                <Box sx={{ filter: editingCity ? 'blur(2px)' : 'none', transition: 'filter 0.2s' }}>
                    {!weather && !error && <Typography variant="body1">Loading...</Typography>}
                    {error && <Typography variant="body1" color="error">{error}</Typography>}

                    {weather && (
                        <Box
                            ref={scrollRef}
                            onWheel={handleWheelScroll}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                overflowX: 'auto',
                                p: 1,
                                '&::-webkit-scrollbar': { height: 6 },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: darkMode ? '#555' : '#ccc', borderRadius: 3 },
                            }}
                        >
                            {weather.map((day, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        flex: '0 0 auto',
                                        minWidth: { xs: '44.4%', sm: '47.5%', md: 170},
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        backgroundColor: darkMode ? '#1976d2' : '#000',
                                        padding: 1,
                                        borderRadius: 2,
                                        height: 200,
                                    }}
                                >
                                    <img
                                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                        alt={day.description}
                                        style={{ width: 64, height: 64, maxWidth: '100%' }}
                                    />
                                    <Typography sx={{ color:'#ccc', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
                                        {day.city}
                                    </Typography>
                                    <Typography sx={{ color:'#ccc', fontSize: { xs: 10, sm: 12 }, textAlign: 'center' }}>
                                        {day.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AirIcon fontSize="small" sx={{ color:'#ccc' }} />
                                            <Typography sx={{ color:'#ccc', fontSize: { xs: 10, sm: 12 } }}>
                                                {day.windSpeed.toFixed(2)} m/s
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <NavigationIcon fontSize="small" sx={{ color:'#ccc', transform: `rotate(${day.windDeg}deg)` }} />
                                            <Typography sx={{ color:'#ccc', fontSize: { xs: 10, sm: 12 } }}>
                                                {Math.round(day.windDeg)}°
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <ThermostatIcon fontSize="small" sx={{ color:'#ccc' }} />
                                            <Typography sx={{ color:'#ccc', fontSize: { xs: 10, sm: 12 } }}>
                                                {day.temperature.toFixed(1)}°C
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default WeatherCard;
