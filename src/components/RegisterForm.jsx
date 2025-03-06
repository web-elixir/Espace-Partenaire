import React, { useState } from "react";
import { TextField, FormControl, Box, Typography, Button, IconButton, InputAdornment, Grid, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createPartner } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
    openHours: `Lundi : \nMardi : \nMercredi : \nJeudi : \nVendredi : \nSamedi : \nDimanche : `,
    image: null,
    website: "",
    pseudo: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responseData = await createPartner(formData);
      console.log("Données envoyées :", formData);
      console.log("Partenaire créé :", responseData);
      if (!responseData) {
        setError("Erreur lors de la création du partenaire. Veuillez réessayer.");
        return;
      }
      else { 
        navigate("/login");
      }
    } catch (error) {
      console.error("Erreur lors de la création du partenaire", error);
      setError("Erreur lors de la création du partenaire. Veuillez réessayer.");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box mt={10} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography sx={{ fontSize: 24, textAlign: "center", marginBottom: "50px" }} variant="h1">
        Créer un espace partenaire
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "70%" }}>
        <FormControl fullWidth>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  name="name"
                  label="Nom"
                  variant="outlined"
                  color="secondary"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  name="phone"
                  label="Téléphone"
                  variant="outlined"
                  color="secondary"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  color="secondary"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  name="description"
                  label="Description"
                  variant="outlined"
                  color="secondary"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={10}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  name="openHours"
                  label="Horaires d'ouverture"
                  variant="outlined"
                  color="secondary"
                  value={formData.openHours}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={7}
                />
                <TextField
                  name="image"
                  type="file"
                  variant="outlined"
                  color="secondary"
                  onChange={handleImageChange}
                  fullWidth
                />
                <TextField
                  name="website"
                  label="Site web"
                  variant="outlined"
                  color="secondary"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  type="url"
                />
                <TextField
                  name="pseudo"
                  label="Pseudo"
                  variant="outlined"
                  color="secondary"
                  value={formData.pseudo}
                  onChange={handleChange}
                  fullWidth
                  required 
                />
                <TextField
                  name="password"
                  label="Mot de passe"
                  variant="outlined"
                  color="secondary"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
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
              </Box>
            </Grid>
          </Grid>
        </FormControl>
        <Button sx={{ marginTop: 10, minWidth: "200px" }} type="submit" variant="contained" color="secondary">
          Créer
        </Button>
        <Button sx={{ textAlign: "center", marginBottom: 5, marginTop: 5, minWidth: "200px"}} component={Link} to="/login" color="primary">
          Me connecter
        </Button>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterForm;