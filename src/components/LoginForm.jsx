import React from "react";
import { TextField, FormControl, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";


const LoginForm = () => {
  return (
    <>
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Typography sx={{ fontSize: 24, textAlign: "center", marginBottom: "50px" }} variant="h1">Connexion à mon espace partenaire</Typography>
        
        {/* Formulaire de connexion */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Pseudo / Email" variant="outlined" />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField id="outlined-basic" label="Mot de passe" variant="outlined" />
            </FormControl>
            <Button 
                variant="contained" 
                sx={{ m: 5 }} 
                component={Link} to="/"
            >
            Connexion
            </Button>
        </Box>
    </Box>
    </>
  );
}; 

export default LoginForm;