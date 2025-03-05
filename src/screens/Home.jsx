import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      const partnerId = localStorage.getItem("partnerId");

      // Rediriger vers la page de connexion si l'ID du partenaire est manquant
      if (!partnerId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:1337/api/partners/${partnerId}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des informations du partenaire");
        }

        const data = await response.json();
        setPartnerInfo(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerInfo();
  }, [navigate]);

  if (!localStorage.getItem("partnerId")) {
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
          Partenaire du plan des étudiants ?
        </Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ m: 3 }}>
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
    );
  }

  if (loading) {
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
          Chargement...
        </Typography>
      </Box>
    );
  }

  if (error) {
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
          Partenaire du plan des étudiants ?
        </Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ m: 3 }}>
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
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("partnerId");
    localStorage.removeItem("token");
    navigate("/");
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
        Bienvenue sur le partenaire du plan des étudiants
      </Typography>
      {partnerInfo && (
        <Box>
          <Typography>Nom: {partnerInfo.name}</Typography>
          <Typography>Email: {partnerInfo.email}</Typography>
          <Typography>Téléphone: {partnerInfo.phone}</Typography>
          {/* Ajoutez d'autres informations selon vos besoins */}
        </Box>
      )}

      {/* Ajouter un bouton pour se deconneter et cleur le token  */}
      <Button variant="contained" sx={{ m: 3 }} color="secondary" onClick={handleLogout}>
        Se déconnecter
      </Button>
    </Box>
  );
};

export default Home;