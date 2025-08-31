import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

interface LightsUsageChartProps {
    darkMode: boolean;
}

const data = [
    { Rooms: "Living", Usage: 120 },
    { Rooms: "Kitchen", Usage: 90 },
    { Rooms: "Bedroom", Usage: 60 },
    { Rooms: "Bathroom", Usage: 45 },
];

const LightsUsageChartCard: React.FC<LightsUsageChartProps> = ({ darkMode }) => {
    return (
        <Card
            sx={{
                minWidth: 250,
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
                            Lights Usage
                        </Typography>
                    </Box>
                </Box>


                <Box sx={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={darkMode ? "#666" : "#888"}
                            />
                            <XAxis
                                dataKey="Rooms"
                                stroke={darkMode ? "#fff" : "#000"}
                            />
                            <YAxis
                                stroke={darkMode ? "#fff" : "#000"}
                                label={{
                                    value: "Minutes",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: darkMode ? "#fff" : "#000",
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? "#333" : "#fff",
                                    color: darkMode ? "#fff" : "#000",
                                    border: "none",
                                    borderRadius: 4,
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="Usage"
                                fill={darkMode ? "#1976d2" : "#000"}
                                radius={[5, 5, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LightsUsageChartCard;
