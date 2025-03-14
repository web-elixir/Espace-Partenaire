import React, { useState, useEffect } from "react";
import { TextField, FormControl, Box, Typography, Button, IconButton, InputAdornment, Grid, Snackbar, Alert } from "@mui/material";
import { Opacity, Visibility, VisibilityOff } from "@mui/icons-material";
import { createPartner } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import pictoPlan from '../../public/Logo plan.png'

const RegisterForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0, userAnswer: "" });


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

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ question: `${num1} + ${num2} = `, answer: num1 + num2, userAnswer: "" });
  };  

  const validateForm = () => {
    let newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = "Le nom doit faire au moins 3 caractères.";
    if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = "Le téléphone doit contenir exactement 10 chiffres.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide.";
    if (formData.password.length < 7) newErrors.password = "Le mot de passe doit contenir au moins 7 caractères.";
    if (formData.pseudo.trim().length < 3) newErrors.pseudo = "Le pseudo doit faire au moins 3 caractères.";
    if (parseInt(captcha.userAnswer, 10) !== captcha.answer) newErrors.captcha = "Réponse incorrecte.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne `true` si aucune erreur
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setError("Veuillez corriger les erreurs du formulaire.");
      return;
    }
  
    try {
      const responseData = await createPartner(formData);
  
      if (!responseData) {
        setError("Erreur lors de la création du partenaire. Veuillez réessayer.");
        return;
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === "L'email ou le pseudo est déjà utilisé.") {
        setError("L'email ou le pseudo est déjà utilisé.");
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
      }
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
    <Box mt={5} mb={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <img src={pictoPlan} alt="Logo plan" style={{ maxWidth: 100, maxHeight: 100, marginBottom: 50 }} />
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
                  error={errors.name}
                  helperText={errors.name}
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
                  error={errors.phone}
                  helperText={errors.phone}
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
                  error={errors.email}
                  helperText={errors.email}
                />
                {/* <TextField
                  name="description"
                  label="Description"
                  variant="outlined"
                  color="secondary"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={10}
                /> */}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* <TextField
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
                /> */}
                {/* <TextField
                  name="website"
                  label="Site web"
                  variant="outlined"
                  color="secondary"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  type="url"
                  error={errors.website}
                  helperText={errors.website}
                /> */}
                <TextField
                  name="pseudo"
                  label="Pseudo"
                  variant="outlined"
                  color="secondary"
                  value={formData.pseudo}
                  onChange={handleChange}
                  fullWidth
                  required 
                  error={errors.pseudo}
                  helperText={errors.pseudo ? `${errors.pseudo}` : "Retenez bien votre pseudo."}
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
                  //afficher un message d'erreur si le mot de passe ne fait opas oplus de 7 caracteres
                  error={errors.password}
                  helperText={errors.password ? `${errors.password}` : "Retenez bien votre mot de passe."}
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
                <TextField
                 sx={{marginTop: 5, opacity: 0.5}}
                  name="captcha"
                  label={captcha.question}
                  variant="outlined"
                  color="secondary"
                  value={captcha.userAnswer}
                  onChange={(e) => setCaptcha({ ...captcha, userAnswer: e.target.value })}
                  fullWidth
                  required
                  error={errors.captcha}
                  helperText={errors.captcha ? `${errors.captcha}` : "Captcha de sécurité."}
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