import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import appIcon from '../assets/svg/iot-house-icon.svg';

const drawerWidth = 300;

export default function PermanentDrawer() {
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
            </Box>
        </Drawer>
    );
}
