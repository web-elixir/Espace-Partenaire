import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Box, Button, FormControl, TextField, InputAdornment, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { API_URL } from '../../services/api';

const LoginForm = () => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fonction de gestion de la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${API_URL}/auth/partner-login`, {
        pseudo,
        password,
      });
  
      setMessage('Connexion réussie');
      setError('');
      localStorage.setItem('partnerId', response.data.partnerId);
      window.location.href = '/';
    } catch (err) {
      if (!err.response) {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } else if (err.response.status === 400) {
        setError("Le pseudo ou le mot de passe est incorrect.");
      } else if (err.response.status === 401) {
        setError("Mot de passe incorrect.");
      } else if (err.response.status === 404) {
        setError("Pseudo introuvable.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }
  
      setMessage('');
      console.error('Login failed:', err);
    }
  };


    // Afficher ou cacher le mot de passe
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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
      <Typography variant="h1" sx={{ fontSize: 24, marginBottom: 5, textAlign: "center" }}>
        Connexion Partenaire
      </Typography>
      <FormControl sx={{ m: 1, maxWidth: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography>
            Pseudo :
          </Typography>
          <TextField
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Pseudo"
            sx={{ marginBottom: 5 }}
          />
          <Typography>
            Mot de passe :
          </Typography>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            sx={{ marginBottom: 5 }}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" sx={{ m: 5 }} color="primary" onClick={handleLogin}>
            Connexion
          </Button>
          {message && <Typography sx={{ textAlign: "center" }}>{message}</Typography>}
          {error && <Typography sx={{ textAlign: "center" }} color="error">{error}</Typography>}

          <Button sx={{ textAlign: "center" }} component={Link} to="/register" color="secondary">
            Créer mon espace partenaire
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};

export default LoginForm;
