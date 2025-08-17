import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Divider} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export default function LightSchedulerCard() {
    const rooms = ["Kitchen", "Garage", "Bath", "Room"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [selectedRooms, setSelectedRooms] = React.useState<string[]>([]);
    const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
    const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs().hour(23).minute(0));
    const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs().hour(5).minute(0).add(1, 'day'));



    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ minWidth: 475, backgroundColor: '#ffffff', borderRadius: '25px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                <CardContent>
                    <Typography gutterBottom sx={{ color: '#070707', fontSize: 25, fontWeight: 'bold', textAlign: 'left' }}>
                        Light Scheduler
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        {rooms.map(room => (
                            <Button
                                key={room}
                                variant={selectedRooms.includes(room) ? "outlined" : "contained"}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    minWidth: 90,
                                    height: 36,
                                    boxSizing: 'border-box',
                                    color: selectedRooms.includes(room) ? '#ffffff' : '#ffffff',
                                    backgroundColor: selectedRooms.includes(room) ? '#4caf50' : '#070707',
                                    border: selectedRooms.includes(room) ? '2px solid #388e3c' : 'none',
                                    '&:hover': {
                                        backgroundColor: selectedRooms.includes(room) ? '#43a047' : '#333333',
                                    }
                                }}
                                onClick={() => {
                                    setSelectedRooms(prev =>
                                        prev.includes(room)
                                            ? prev.filter(r => r !== room)
                                            : [...prev, room]
                                    );
                                }}
                            >
                                {room}
                            </Button>
                        ))}
                    </Box>
                    <Typography gutterBottom sx={{ color: '#070707', fontSize: 25, fontWeight: 'bold', textAlign: 'left', mt: 2 }}>
                        Hours
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <TimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={setStartTime}
                        />
                        <TimePicker
                            label="End Time"
                            value={endTime}
                            onChange={setEndTime}
                        />
                    </Box>
                    <Typography gutterBottom sx={{ color: '#070707', fontSize: 25, fontWeight: 'bold', textAlign: 'left', mt: 2 }}>
                        Repetition
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        {days.map(day => (
                            <Button
                                key={day}
                                variant={selectedDays.includes(day) ? "outlined" : "contained"}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    minWidth: 30,
                                    height: 36,
                                    boxSizing: 'border-box',
                                    color: selectedDays.includes(day) ? '#ffffff' : '#ffffff',
                                    backgroundColor: selectedDays.includes(day) ? '#4caf50' : '#070707',
                                    border: selectedDays.includes(day) ? '2px solid #388e3c' : 'none',
                                    '&:hover': {
                                        backgroundColor: selectedDays.includes(day) ? '#43a047' : '#333333',
                                    }
                                }}
                                onClick={() => {
                                    setSelectedDays(prev =>
                                        prev.includes(day)
                                            ? prev.filter(d => d !== day)
                                            : [...prev, day]
                                    );
                                }}
                            >
                                {day}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    </Box>
                    <Box sx={{ display: 'flex',fulexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Button
                            variant="contained"
                            sx={{ 
                                borderRadius: 3, 
                                textTransform: 'none', 
                                minWidth: 90, 
                                color: '#ffffff', 
                                backgroundColor: '#070707', 
                                mt: 1.4,
                                mr: 32
                            }}
                            onClick={()=>{
                                setSelectedRooms([]);
                                setSelectedDays([]);
                                setStartTime(dayjs().hour(23).minute(0));
                                setEndTime(dayjs().hour(5).minute(0).add(1, 'day'));
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ 
                                borderRadius: 3, 
                                textTransform: 'none', 
                                minWidth: 90, 
                                color: '#ffffff', 
                                backgroundColor: '#070707',
                                mt: 1.4

                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
}
