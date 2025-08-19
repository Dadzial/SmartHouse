import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Alert, Box, InputAdornment, Drawer } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import appIcon from '../assets/svg/iot-house-icon.svg';

const drawerWidth = 300;

interface Account {
    username: string;
    email: string;
    password: string;
}

interface Errors {
    username?: string;
    email?: string;
    password?: string;
    submit?: string;
}

const SignUpForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();

    const handleChangeRoute = () => navigate('/');

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};
        if (!account.username.trim()) validationErrors.username = 'Required';
        if (!account.email.trim()) validationErrors.email = 'Required';
        if (!account.password.trim()) validationErrors.password = 'Required';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setTimeout(() => setErrors({}), 1000);
            return validationErrors;
        }
        return null;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        try {
            await axios.post('http://localhost:3100/api/user/create', {
                name: account.username,
                email: account.email,
                password: account.password
            });
            handleChangeRoute();
        } catch (error: any) {
            setErrors({ submit: error.response?.data?.message || 'Registration failed' });
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        p: 2,
                    },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}>
                        <img src={appIcon} alt="App Logo" style={{ width: '140px', height: 'auto' }} />
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                        Smart Home
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            placeholder="Username"
                            name="username"
                            value={errors.username ? errors.username : account.username}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={Boolean(errors.username)}
                            sx={{
                                backgroundColor: '#070707',
                                borderRadius: 4,
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4,
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                },
                                '& .MuiInputBase-input': {
                                    color: errors.username ? 'red' : 'white',
                                    textAlign: errors.username ? 'center' : 'left',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            placeholder="Email"
                            name="email"
                            value={errors.email ? errors.email : account.email}
                            onChange={handleChange}
                            type="email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={Boolean(errors.email)}
                            sx={{
                                backgroundColor: '#070707',
                                borderRadius: 4,
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4,
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                },
                                '& .MuiInputBase-input': {
                                    color: errors.email ? 'red' : 'white',
                                    textAlign: errors.email ? 'center' : 'left',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            placeholder="Password"
                            name="password"
                            type={errors.password ? 'text' : 'password'} // jeśli błąd, pokazujemy tekst jawnie
                            value={errors.password ? errors.password : account.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={Boolean(errors.password)}
                            sx={{
                                backgroundColor: '#070707',
                                borderRadius: 4,
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4,
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                },
                                '& .MuiInputBase-input': {
                                    color: errors.password ? 'red' : 'white',
                                    textAlign: errors.password ? 'center' : 'left',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit"
                                variant="contained"
                                fullWidth
                                sx={{mt: 2,
                                    backgroundColor: '#070707',
                                    borderRadius: 25,
                                    textTransform: 'none',
                                    color: 'white',
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    FontFamily: 'Inter , sans-serif',
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    width: '40%',
                                    height: '50px',
                                }}
                        >
                            Register
                        </Button>
                        {errors.submit && <Alert severity="error" sx={{ mt: 2 }}>{errors.submit}</Alert>}
                        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                            Already have an account?
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{mt: 2,
                                backgroundColor: '#070707',
                                borderRadius: 25,
                                textTransform: 'none',
                                color: 'white',
                                fontSize: 17,
                                fontWeight: 'bold',
                                FontFamily: 'Inter , sans-serif',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                width: '40%',
                                height: '50px',
                            }}
                            onClick={() => navigate('/')}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Drawer>
            <Box sx={{ flex: 1, backgroundColor: '#004d66' }} />
        </Box>
    );
};

export default SignUpForm;
