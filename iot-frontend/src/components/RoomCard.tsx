import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Switch } from "@mui/material";

const BasicCard = ({ title, iconPath, state, onToggle }: any) => {

    const iconFilter = state
        ? 'invert(88%) sepia(97%) saturate(7486%) hue-rotate(1deg) brightness(105%) contrast(105%)'
        : 'invert(1)';

    return (
        <Card sx={{ minWidth: 250, backgroundColor: '#ffffff', borderRadius: '25px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: '#070707', fontSize: 25, fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '90%',
                        backgroundColor: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '16px auto',
                    }}
                >
                    <img src={iconPath} alt={title} style={{ width: 40, height: 40, filter: iconFilter }} />
                </Box>
                <Typography variant="h5" component="div">
                    {state ? 'ON' : 'OFF'}
                </Typography>
                <Switch checked={state} onChange={onToggle} />
            </CardContent>
        </Card>
    );
}

export default BasicCard;
