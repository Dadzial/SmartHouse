import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import Switch from "@mui/material/Switch";

interface LightsSwitchesProps {
    darkMode: boolean;
}

const LightsSwitches: React.FC<LightsSwitchesProps> = ({ darkMode }) => {
    const [switches, setSwitches] = useState<Record<string, boolean>>({
        Living: false,
        Kitchen: true,
        Bedroom: false,
        Bathroom: true,
    });

    const toggleSwitch = (room: string) => {
        setSwitches((prev) => ({ ...prev, [room]: !prev[room] }));
    };

    return (
        <Card
            sx={{
                minWidth: 300,
                width: '100%',
                minHeight: 300,
                height: '100%',
                backgroundColor: darkMode ? "#1e1e1e" : "#fff",
                color: darkMode ? "#fff" : "#000",
                flex: 1,
            }}
        >
            <CardContent>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LightbulbIcon fontSize="medium" />
                        <Typography
                            sx={{
                                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                                color: darkMode ? "#ccc" : "#000",
                                fontFamily: "Inter Medium",
                                textShadow: darkMode
                                    ? "1px 1px 2px #000"
                                    : "1px 1px 2px #888",
                            }}
                        >
                            Lights Switches
                        </Typography>
                    </Box>
                </Box>


                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {Object.keys(switches).map((room) => (
                        <Box
                            key={room}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: darkMode ? "#2a2a2a" : "#f5f5f5",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Inter Medium",
                                    fontSize: "0.95rem",
                                    color: darkMode ? "#ccc" : "#000",
                                }}
                            >
                                {room}
                            </Typography>
                            <Switch
                                checked={switches[room]}
                                onChange={() => toggleSwitch(room)}
                                color="primary"
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: darkMode ? "#1976d2" : "#000",
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: darkMode ? "#1976d2" : "#000",
                                    },
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default LightsSwitches;
