import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';

interface Account {
    username: string;
    email: string;
    password: string;
}

interface Errors {
    username?: string;
    email?: string;
    password?: string;
}

const SignUpForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Errors>({});

    const navigate = useNavigate();

    const handleChangeRoute = () => {
        navigate('.Components/Login');
    };

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};

        if (account.username.trim() === '') {
            validationErrors.username = 'Username is required!';
        }
        if (account.email.trim() === '') {
            validationErrors.email = 'Email is required!';
        }
        if (account.password.trim() === '') {
            validationErrors.password = 'Password is required!';
        }

        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        axios
            .post('http://localhost:3100/api/user/create', {
                name: account.username,
                email: account.email,
                password: account.password
            })
            .then(() => {
                handleChangeRoute();
            })
            .catch((error) => {
                const errorMessages: Errors = {};
                errorMessages.password =
                    "Given username doesn't exist or the password is wrong!";
                setErrors(errorMessages || {});
                console.log(error);
            });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={account.username}
                        name="username"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Email"
                        value={account.email}
                        name="email"
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        value={account.password}
                        name="password"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                </Button>
                {Object.values(errors).some((error) => error) && (
                    <Box mt={2}>
                        {Object.values(errors).map((error, index) => (
                            error && (
                                <Alert severity="error" key={index}>
                                    {error}
                                </Alert>
                            )
                        ))}
                    </Box>
                )}
            </form>
        </Container>
    );
};

export default SignUpForm;

