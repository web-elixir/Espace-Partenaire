import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Box, Button } from "@mui/material";

const Login = () => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fonction de gestion de la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:1337/api/auth/partner-login', {
        pseudo,
        password,
      });
  
      setMessage('Connexion réussie');
      setError('');
  
      // Stocker uniquement l'ID du partenaire dans le localStorage
      localStorage.setItem('partnerId', response.data.partnerId);
  
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (err) {
      setError('Pseudo ou mot de passe incorrect');
      setMessage('');
      console.error('Login failed:', err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 24, marginBottom: 5 }}>
        Connexion Partenaire
      </Typography>
      <form onSubmit={handleLogin}>
        <div>
          <label>Pseudo</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" variant="contained" color="primary">
          Se connecter
        </Button>
      </form>
    </Box>
  );
};

export default Login;
