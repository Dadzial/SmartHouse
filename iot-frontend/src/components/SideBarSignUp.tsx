import React, {type ChangeEvent, type FormEvent} from "react";
import Drawer from "@mui/material/Drawer";
import {Alert, Box, Button, InputAdornment} from "@mui/material";
import appIconDarkMode from "../assets/icons/appIconDarkMode.png";
import appIconLightMode from "../assets/icons/appIconLightMode.png";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

const drawerWidth = {xs: 220, sm: 260, md: 300 };

interface SideBarSignUpProps {
    darkMode: boolean;
}

interface Account {
    username:string;
    email:string;
    password:string;
}

interface Errors {
    username?:string;
    email?:string;
    password?:string;
    submit?:string;
}

const SideBarSignUp: React.FC<SideBarSignUpProps> = ({ darkMode }) => {
    const [account, setAccount] = useState<Account>({username:'',email:'',password:''});
    const [errors, setErrors ] = useState<Errors>({});
    const navigate = useNavigate()

    const handleChangeRoute = () => navigate('/')

    const validate = (): Errors | null => {
        const newErrors: Errors = {};
        if (!account.username.trim()) newErrors.username = 'Username is required';
        if (!account.email.trim()) newErrors.email = 'Email is required';
        if (!account.password.trim()) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors);

            setTimeout(() => {
                setErrors(prev => {
                    const cleaned = { ...prev };
                    Object.keys(newErrors).forEach(key => delete cleaned[key as keyof Errors]);
                    return cleaned;
                });
            }, 2000);
        }
        return Object.keys(newErrors).length === 0 ? null : newErrors;
    }



    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        try {
            const response = await fetch('http://localhost:3100/api/user/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: account.username,
                    email: account.email,
                    password: account.password
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            handleChangeRoute();

        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            setErrors({ submit: errMsg });
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                overflow: 'hidden',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '0 20px 20px 0',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    p: { xs: 1, md: 2 },
                    backgroundColor: darkMode ? '#121212' : '#fff',
                    color: darkMode ? '#fff' : '#000',
                },
            }}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 2, md: 3 } }}>
                    <img
                        src={darkMode ? appIconDarkMode : appIconLightMode}
                        alt="App Logo"
                        style={{ width: '100%', maxWidth: '150px', minWidth: '80px', height: 'auto', filter: 'drop-shadow(0px 0px 3px #00)' }}
                    />
                </Box>
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 1, fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, fontFamily: 'Inter Semi Bold', lineHeight: 1.2, textShadow: darkMode ? '0px 0px 2px #fff' : '0px 0px 2px #000' }}>
                    Smart Home
                </Typography>
                <Typography variant="h5" sx={{ textAlign: 'center', mt: 1, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' }, fontFamily: 'Inter Medium', lineHeight: 1.2, textShadow: darkMode ? '0px 0px 2px #fff' : '0px 0px 2px #000' }}>
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', px: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
                    <TextField
                        name="email"
                        value={errors.email ? errors.email : account.email}
                        onChange={handleChange}
                        placeholder="Email"
                        type="text"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: darkMode ? '#fff' : '#000' }} /></InputAdornment>,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                                '&:hover fieldset': { borderColor: darkMode ? '#ddd' : '#333' },
                                '&.Mui-focused fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                                '& input': {
                                    color: darkMode ? '#fff' : '#000',
                                    padding: '10px',
                                },
                                '& input::placeholder': {
                                    color: darkMode ? '#aaa' : '#666',
                                    opacity: 1,
                                },
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: darkMode
                                        ? '0 0 0px 1000px #121212 inset'
                                        : '0 0 0px 1000px #fff inset',
                                    WebkitTextFillColor: darkMode ? '#fff !important' : '#000 !important',
                                    '& input:-internal-autofill-selected': {
                                        WebkitTextFillColor: darkMode ? '#fff !important' : '#000 !important',
                                    },
                                },
                            },
                        }}
                    />
                    <TextField
                        name="username"
                        value={errors.username ? errors.username : account.username}
                        onChange={handleChange}
                        autoComplete="username"
                        placeholder="Username"
                        type="text"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: darkMode ? '#fff' : '#000' }} /></InputAdornment>,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                                '&:hover fieldset': { borderColor: darkMode ? '#ddd' : '#333' },
                                '&.Mui-focused fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                                '& input': {
                                    color: darkMode ? '#fff' : '#000',
                                    padding: '10px',
                                },
                                '& input::placeholder': {
                                    color: darkMode ? '#aaa' : '#666',
                                    opacity: 1,
                                },
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: darkMode
                                        ? '0 0 0px 1000px #121212 inset'
                                        : '0 0 0px 1000px #fff inset',
                                    WebkitTextFillColor: darkMode ? '#fff !important' : '#000 !important',
                                    '& input:-internal-autofill-selected': {
                                        WebkitTextFillColor: darkMode ? '#fff !important' : '#000 !important',
                                    },
                                },
                            },
                        }}
                    />
                    <TextField
                        name="password"
                        value={errors.password ? errors.password : account.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: darkMode ? '#fff' : '#000' }} /></InputAdornment>,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                                '&:hover fieldset': { borderColor: darkMode ? '#ddd' : '#333' },
                                '&.Mui-focused fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                                '& input': {
                                    color: darkMode ? '#fff' : '#000',
                                    padding: '10px',
                                },
                                '& input::placeholder': {
                                    color: darkMode ? '#aaa' : '#666',
                                    opacity: 1,
                                },
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: darkMode
                                        ? '0 0 0px 1000px #121212 inset'
                                        : '0 0 0px 1000px #fff inset',
                                    WebkitTextFillColor: darkMode ? '#fff' : '#000',
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            boxShadow: '0px 0px 4px #000',
                            backgroundColor: darkMode ? '#fff' : '#111',
                            color: darkMode ? '#111' : '#fff',
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            '&:hover': { backgroundColor: darkMode ? '#fbfbfb' : '#111' },
                            '&:focus': { outline: 'none', boxShadow: 'none' },
                            '&:active': { outline: 'none', boxShadow: 'none' },
                        }}
                    >
                        Create account
                    </Button>
                </Box>
                {errors.submit && <Alert severity="error" sx={{ mt: 2 }}>{errors.submit}</Alert>}
            </Box>
            <Box sx={{ flexShrink: 0, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontFamily: 'Inter Medium', textShadow: darkMode ? '0px 0px 0.3px #fff' : '0px 0px 0.3px #000' }}>
                    Already have an account?
                </Typography>
                <Button
                    onClick={() => window.location.href = '/'}
                    fullWidth
                    variant="outlined"
                    sx={{
                        boxShadow: '0px 0px 4px #000',
                        backgroundColor: darkMode ? '#fff' : '#111',
                        color: darkMode ? '#111' : '#fff',
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1.2rem',
                        '&:hover': { backgroundColor: darkMode ? '#fbfbfb' : '#111' },
                        '&:focus': { outline: 'none', boxShadow: 'none' },
                        '&:active': { outline: 'none', boxShadow: 'none' },
                    }}
                >
                    Login
                </Button>
                <Typography sx={{ fontFamily: 'Inter Medium', textShadow: darkMode ? '0px 0px 0.3px #fff' : '0px 0px 0.3px #000' }}>
                    GitHub <a href="https://github.com/Dadzial/SmartHouse" target="_blank" rel="noopener noreferrer">Dadzial</a>
                </Typography>
            </Box>
        </Drawer>
    )
}
export default SideBarSignUp;