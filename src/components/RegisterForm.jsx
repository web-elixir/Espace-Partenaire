import React, { useState } from "react";
import { TextField, FormControl, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPartner } from "../../services/api";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
    openHours: "",
    image: null,
    website: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
      const responseData = await createPartner(formData);
      console.log("Partenaire créé :", responseData);
      navigate("/login");
  } catch (error) {
      console.error("Erreur lors de la création du partenaire", error);
  }
};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography sx={{ fontSize: 24, textAlign: "center", marginBottom: "50px" }} variant="h1">
        Créer un espace partenaire
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FormControl sx={{ m: 1, minWidth: 300 }} fullWidth>
          <TextField
            name="name"
            label="Nom"
            variant="outlined"
            color="secondary"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="phone"
            label="Téléphone"
            variant="outlined"
            color="secondary"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            color="secondary"
            value={formData.email}
            onChange={handleChange}
            fullWidth
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
            rows={4}
          />
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
          <FormControl sx={{ m: 1, minWidth: 300 }} fullWidth>
            <TextField
              name="image"
              label="Image (URL ou chemin du fichier)"
              variant="outlined"
              color="secondary"
              value={formData.image}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 300 }} fullWidth>
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
          </FormControl>
          
          <Button type="submit" variant="contained" sx={{ m: 5 }} color="secondary">
            Créer
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default RegisterForm;
