import Drawer from "@mui/material/Drawer";
import React from "react";
import appIconLightMode from '../assets/icons/appIconLightMode.png';
import appIconDarkMode from '../assets/icons/appIconDarkMode.png';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {IconButton} from "@mui/material";

interface SideBarLoginProps {
    darkMode: boolean;
    userName: string;
}

const drawerHeight = 50;

const ToolBarDashboard: React.FC<SideBarLoginProps> = ({ darkMode , userName }) => {

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <Drawer
            variant="permanent"
            anchor="top"
            sx={{
                height: drawerHeight,
                width: '100%',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    height: drawerHeight,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    p: { xs: 1, md: 2 },
                    backgroundColor: darkMode ? '#121212' : '#fff',
                    color: darkMode ? '#fff' : '#000',
                    boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
                },
            }}
        >
            <Box display="flex" alignItems="center">
                <img
                    src={darkMode ? appIconDarkMode : appIconLightMode}
                    alt="App Logo"
                    style={{
                        height: '1.4em',
                        marginRight: '8px',
                        filter: 'drop-shadow(0px 0px 3px #00)',
                        verticalAlign: 'middle',
                        marginTop: '-2.5px'

                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                        fontFamily: 'Inter Semi Bold',
                        lineHeight: 1.2,
                        textShadow: darkMode ? '0px 0px 2px #fff' : '0px 0px 2px #000',
                    }}
                >
                    Smart Home
                </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={1}>
                <PersonIcon fontSize="small" sx={{marginTop: '-2px'}} htmlColor={darkMode ? '#fff' : '#000'} />
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '0.9rem', sm: '0.9rem', md: '1.0rem' },
                        fontFamily: 'Inter Medium',
                        lineHeight: 1.2,
                    }}
                >
                    {userName}
                </Typography>
                <IconButton
                    onClick={logout}
                    color={darkMode ? 'inherit' : 'inherit'}
                    size="small"
                    sx={{
                        outline: 'none',
                        marginTop: '-2px',
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        }
                    }}
                >
                    <LogoutIcon fontSize="small" htmlColor={darkMode ? '#fff' : '#000'} />
                </IconButton>
            </Box>
        </Drawer>
    );
}

export default ToolBarDashboard;
