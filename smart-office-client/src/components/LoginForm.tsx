import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { authStore } from '../stores/authStore';

const LoginForm = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            // Sending request to the Auth Service on port 5201
            const response = await axios.post('http://localhost:5201/Auth/login', {
                Name: name,
                PasswordHash: password // Make sure it matches the field name in the Backend
            });

            // Extracting the data from the response
            const { token, role } = response.data;
            
            // Updating the MobX store that affects the entire application
            authStore.setAuth(token, role);
            
        } catch (err) {
            setError('Login failed. Check your username and password.');
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Smart-Office Login
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField 
                    fullWidth 
                    label="User Name" 
                    variant="outlined" 
                    margin="normal" 
                    onChange={(e) => setName(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    margin="normal" 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    sx={{ mt: 3 }} 
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    );
};

export default LoginForm;