import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import React, { useEffect, useState, useRef } from "react";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface SideBarLoginProps {
    darkMode: boolean;
}

const MIN_TEMP = -40;
const MAX_TEMP = 40;

const TemperatureCard: React.FC<SideBarLoginProps> = ({ darkMode }) => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [cityName, setCityName] = useState("Warsaw");
    const [tempCity, setTempCity] = useState(cityName);
    const [editingCity, setEditingCity] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchTemperature = async () => {
            setError(null);
            try {
                const response = await fetch(`http://localhost:3100/weather/temperature/${cityName}`);
                if (!response.ok) throw new Error("API error");
                const data = await response.json();
                setTemperature(data.temperature);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            }
        };

        fetchTemperature();
        const interval = setInterval(fetchTemperature, 3000);
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

    const progressValue = temperature !== null
        ? ((temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100
        : 0;

    return (
        <Card
            ref={cardRef}
            sx={{
                minWidth: 250,
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
                        <ThermostatIcon fontSize="medium" />
                        <Typography
                            sx={{
                                fontSize: { xs: '0.6rem', sm: '1rem', md: '1.1rem' },
                                color: darkMode ? '#ccc' : '#000',
                                fontFamily: 'Inter Medium',
                                textShadow: darkMode ? '1px 1px 2px #000' : '1px 1px 2px #888',
                            }}
                        >
                            Temperature
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => {
                            if (editingCity) {
                                handleCitySubmit();
                            } else {
                                setEditingCity(true);
                                setTempCity(cityName);
                            }
                        }}
                        size="small"
                        sx={{
                            color: darkMode ? '#1976d2' : '#000',
                            '&:hover': { backgroundColor: darkMode ? '#1565c0' : '#eee' },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: 'none',
                                transform: 'none'
                            }
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
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#fff' : '#000',
                                },
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

                <Box
                    sx={{
                        filter: editingCity ? 'blur(2px)' : 'none',
                        transition: 'filter 0.2s'
                    }}
                >
                    {temperature === null && !error && (
                        <Typography variant="body1">Loading...</Typography>
                    )}
                    {error && <Typography variant="body1" color="error">{error}</Typography>}

                    {temperature !== null && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography
                                sx={{
                                    color: darkMode ? '#ccc' : '#000',
                                    fontSize: { xs: 18, sm: 20, md: 22 },
                                    fontFamily: 'Inter Medium',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <LocationOnIcon /> {cityName}
                            </Typography>
                            <Typography
                                sx={{
                                    color: darkMode ? '#ccc' : '#000',
                                    fontSize: { xs: 20, sm: 22, md: 24 },
                                    fontFamily: 'Inter Medium',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <ThermostatIcon /> {temperature}°C
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Typography sx={{ fontSize: 12 }}>{MIN_TEMP}°</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progressValue}
                                    sx={{
                                        flex: 1,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: darkMode ? '#555' : '#eee',
                                        '& .MuiLinearProgress-bar': { backgroundColor: darkMode ? '#1976d2' : '#000' }
                                    }}
                                />
                                <Typography sx={{ fontSize: 12 }}>{MAX_TEMP}°</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default TemperatureCard;
