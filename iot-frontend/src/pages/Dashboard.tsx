import dashboardStyles from "./Dashboard.module.css"
import WeatherCard from "../components/WeatherCard";
import HumidityCard from "../components/HumidityCard";
import TemperatureCard from "../components/TemperatureCard";
import ToolBarDashboard from "../components/ToolBarDashboard";
import LightsUsageChart from "../components/LightsUsageChart";
import {useThemeContext} from "../contexts/ThemeContext";
import {Button} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LightsSwitches from "../components/LightsSwitches";

const DashBoard= () => {

    const { darkMode, toggleDarkMode } = useThemeContext();
    const storedUserName = localStorage.getItem('username') || '';

    return (
        <div>
            <div className={dashboardStyles.mainContainer}>
                <div className={dashboardStyles.ToolBarContainer}>
                    <ToolBarDashboard darkMode={darkMode} userName={storedUserName}/>
                </div>
                <div className={dashboardStyles.cardsGrid}>
                    <TemperatureCard darkMode={darkMode}/>
                    <HumidityCard darkMode={darkMode}/>
                    <WeatherCard darkMode={darkMode} cityName="warsaw"/>
                    <div className={dashboardStyles.lightsUsageChartContainer}>
                        <LightsUsageChart darkMode={darkMode}/>
                    </div>
                    <div className={dashboardStyles.lightsSwitchesContainer}>
                        <LightsSwitches/>
                    </div>
                </div>
                <div className={dashboardStyles.footer}>
                    <Button
                        onClick={toggleDarkMode}
                        variant="contained"
                        sx={{
                            boxShadow: '0px 0px 4px #000',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            minWidth: 0,
                            minHeight: 0,
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            backgroundColor: darkMode ? '#000' : '#FFF',
                            color: darkMode ? '#FFF' : '#000',
                            '&:hover': {
                                backgroundColor: darkMode ? '#000' : '#FFF',
                                boxShadow: '0px 0px 4px #000',
                            },
                            '&:focus': { outline: 'none', boxShadow: '0px 0px 4px #000' },
                            '&:active': { outline: 'none', boxShadow: '0px 0px 4px #000' },
                        }}
                    >
                        {darkMode ? <DarkModeIcon fontSize="medium" /> : <LightModeIcon fontSize="medium" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;