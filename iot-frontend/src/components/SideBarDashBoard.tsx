import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SettingsIcon from '@mui/icons-material/Settings';
import GarageIcon from '@mui/icons-material/Garage';
import LogoutIcon from '@mui/icons-material/Logout';
import appIcon from '../assets/svg/iot-house-icon.svg';
import { Link } from "react-router-dom";
const drawerWidth = 300;

const PermanentDrawer = () => {

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}>
                    <img
                        src={appIcon}
                        alt="App Logo"
                        style={{
                            width: '50%',
                            height: 'auto',
                            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
                        }}
                    />
                </Box>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        color: '#070707',
                        fontSize: 25,
                        fontWeight: 'bold',
                        textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        textAlign: 'center'
                    }}
                >
                    Smart Home
                </Typography>
                <List sx={{
                    color: '#000000',
                    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    fontWeight: 'bold',
                    fontSize: '20px'
                }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon><HomeIcon sx={{ color: '#000000', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }} /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/lights">
                            <ListItemIcon><LightbulbIcon sx={{ color: '#000000', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }} /></ListItemIcon>
                            <ListItemText primary="Lights" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/weather">
                            <ListItemIcon><ThermostatIcon sx={{ color: '#000000', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }} /></ListItemIcon>
                            <ListItemText primary="Temperature" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon><GarageIcon sx={{ color: '#000000', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }} /></ListItemIcon>
                            <ListItemText primary="Garage" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon><SettingsIcon sx={{ color: '#000000', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }} /></ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Divider />
                <List sx={{ color: '#000000', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', fontWeight: 'bold', fontSize: '20px' }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout}>
                            <ListItemIcon><LogoutIcon sx={{ color: '#000000', filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }} /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}

export default PermanentDrawer;
