import React from "react";
import { TextField, FormControl, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <>
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Typography sx={{ fontSize: 24, textAlign: "center", marginBottom: "50px" }} variant="h1">Créer un espace partenaire</Typography>
        
        {/* Formulaire de création */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Pseudo" variant="outlined" color="secondary"/>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Nom" variant="outlined" color="secondary"/>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Prénom" variant="outlined" color="secondary"/>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Téléphone" variant="outlined" color="secondary"/>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Email" variant="outlined" color="secondary"/>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Mot de passe" variant="outlined" color="secondary"/>
            </FormControl>
            <Button 
                variant="contained" 
                sx={{ m: 5 }} 
                component={Link} to="/login"
                color="secondary"
            >
            Créer
            </Button>
        </Box>
    </Box>
    </>
  );
}; 

export default RegisterForm;