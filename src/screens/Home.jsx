import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Typography variant="h1" sx={{ fontSize: 24, marginBottom: 5 }}>Partenaire du plan des étudants ?</Typography>
            <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ m: 3 }}
            >
            Connexion
            </Button>
            <Button                 
                component={Link}
                to="/register"
                variant="contained"
                color="secondary"
                sx={{ m: 3 }}
            >
            Créer mon espace partenaire
            </Button>
        </Box>
    </>
  );
}; 

export default Home;