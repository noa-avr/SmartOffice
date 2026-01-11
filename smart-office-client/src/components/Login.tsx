import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { authStore } from '../stores/authStore';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // Call to Auth Service we created earlier on port 5201
            const response = await axios.post('http://localhost:5201/AuthController/login', {
                name,
                passwordHash: password
            });
            
            const token = response.data.token;
            // Here we need to decode the Role from the token or get it from the API
            // For simplicity, let's assume we set Admin in Register
            authStore.setAuth(token, "Admin"); 
            alert("Logged in successfully!");
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Smart-Office Login</Typography>
                <TextField margin="normal" fullWidth label="User Name" onChange={(e) => setName(e.target.value)} />
                <TextField margin="normal" fullWidth label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
                    Sign In
                </Button>
            </Box>
        </Container>
    );
};

export default Login;