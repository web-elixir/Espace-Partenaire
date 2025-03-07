import React, { useEffect, useState } from "react";
import { Typography, Box, Button, colors } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { URL, API_URL } from "../../services/api";
import Scanner from "../components/Scanner"; // Import du Scanner

const Home = () => {
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null); // État pour stocker le code scanné
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      const partnerId = localStorage.getItem("partnerId");

      if (!partnerId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/partners/${partnerId}`);

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

  const renderLoginPage = () => (
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

  const renderLoadingPage = () => (
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

  const renderErrorPage = () => (
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
        Erreur lors du chargement
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

  const handleLogout = () => {
    localStorage.removeItem("partnerId");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleScanResult = (result) => {
    setScanResult(result); // Mettre à jour l'état avec le code scanné
  };

  // Affichage en fonction de l'état de l'application
  if (!localStorage.getItem("partnerId")) {
    return renderLoginPage();
  }

  if (loading) {
    return renderLoadingPage();
  }

  if (error) {
    return renderErrorPage();
  }

  return (
    <Box
      sx={{
        margin: 5,
      }}
    >
      {partnerInfo && partnerInfo.image && (
        <img
          src={`${URL}${partnerInfo.image.url}`}
          alt={partnerInfo.name}
          style={{ maxWidth: 200, maxHeight: 200, marginBottom: 50 }}
        />
      )}

      <Typography variant="h1">
        Bienvenue{" "}
        <Typography variant="h1" component="span" color="secondary">
          {partnerInfo.name}
        </Typography>{" "}
        sur votre espace partenaire
      </Typography>

      {partnerInfo && (
        <Box sx={{ mt: 5 }}>

        {partnerInfo.scanCodes ? (
          <Typography>Codes scannés : {partnerInfo.scanCodes.length}</Typography>
        ) : (
          <Typography>Codes scannés : 0</Typography>
        )}

          {/* Afficher le scanner lorsqu'on clique sur le bouton */}
          <Scanner onScan={handleScanResult} />

          <Typography sx={{ mt: 2 }}>
            <b>Offre :</b>{" "}
            <Typography component="span" color="primary">
              <b>{partnerInfo.offer?.title}</b>
            </Typography>{" "}
          </Typography>

          <Box
            sx={{
              mt: 5,
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              backgroundColor: colors.grey[100],
              padding: 2,
            }}
          >
            <Typography variant="h2" sx={{ fontSize: 20 }}>
              Vos informations :
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <b>Nom :</b> {partnerInfo.name}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Email :</b> {partnerInfo.email}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Téléphone :</b> {partnerInfo.phone}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Adresse :</b> {partnerInfo.address}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Site web :</b> {partnerInfo.website}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Description :</b> {partnerInfo.description}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Heures d'ouverture :</b>
              <br />
              {partnerInfo.openHours?.split("\r\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Affichage du code scanné */}
      {scanResult && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          Code scanné : {scanResult}
        </Typography>
      )}

      <Button variant="contained" sx={{ m: 3 }} color="secondary" onClick={handleLogout}>
        Se déconnecter
      </Button>
    </Box>
  );
};

export default Home;
