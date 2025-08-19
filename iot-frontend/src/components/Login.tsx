import { useState, type ChangeEvent, type FormEvent } from "react";
import { TextField, Button, Typography, Alert, InputAdornment } from '@mui/material';
import Box from "@mui/material/Box";
import Drawer from '@mui/material/Drawer';
import appIcon from '../assets/svg/iot-house-icon.svg';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 300;

interface Account {
    username: string;
    password: string;
}

interface Errors {
    username?: string;
    password?: string;
    submit?: string;
}

const LoginForm = () => {
    const [account, setAccount] = useState<Account>({ username: "", password: "" });
    const [errors, setErrors] = useState<Errors>({});

    const validate = (): Errors | null => {
        const newErrors: Errors = {};
        if (!account.username.trim()) newErrors.username = 'Username is required!';
        if (!account.password.trim()) newErrors.password = 'Password is required!';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => setErrors({}), 1000);
        }

        return Object.keys(newErrors).length === 0 ? null : newErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        try {
            const response = await fetch('http://localhost:3100/api/user/auth', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ login: account.username, password: account.password }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = './lights';
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors(prev => ({ ...prev, submit: error.message || 'Login failed. Please try again.' }));
                setTimeout(() => setErrors(prev => ({ ...prev, submit: undefined })), 2000);
            }
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
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
                        <img
                            src={appIcon}
                            alt="App Logo"
                            style={{ width: '140px', height: 'auto', filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))' }}
                        />
                    </Box>

                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#070707',
                            fontSize: 25,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            mb: 3
                        }}
                    >
                        Smart Home
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            placeholder="Username"
                            name="username"
                            value={errors.username || account.username}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
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
                            placeholder="Password"
                            name="password"
                            type={errors.password ? 'text' : 'password'}
                            value={errors.password || account.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
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

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: '#070707',
                                borderRadius: 25,
                                textTransform: 'none',
                                color: 'white',
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Inter , sans-serif',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                width: '40%',
                                height: '50px',
                            }}
                        >
                            Login
                        </Button>

                        {errors.submit && <Alert severity="error" sx={{ mt: 2 }}>{errors.submit}</Alert>}

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#070707',
                                mt: 2,
                                fontSize: 13,
                                fontWeight: 'bold',
                                textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                textAlign: 'center'
                            }}
                        >
                            Don't have an account?
                        </Typography>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: '#070707',
                                borderRadius: 25,
                                textTransform: 'none',
                                color: 'white',
                                fontSize: 17,
                                fontWeight: 'bold',
                                fontFamily: 'Inter , sans-serif',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                width: '40%',
                                height: '50px',
                            }}
                            onClick={() => window.location.href = '/register'}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Drawer>
            <Box sx={{ flex: 1, backgroundColor: '#004d66' }} />
        </Box>
    );
};

export default LoginForm;
