import React, { useEffect, useState } from "react";
import { Typography, Box, Button, colors, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { URL, API_URL } from "../../services/api";
import Scanner from "../components/Scanner"; // Import du Scanner
import logoPlan from "../../public/logoplan2023.png";
import pictoPlan from "../../public/Logo plan.png";

const Home = () => {
  const [partnerInfo, setPartnerInfo] = useState({ scanCodes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null); // État pour stocker le code scanné
  const [snackbarOpen, setSnackbarOpen] = useState(false); // État pour gérer la Snackbar
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
        // console.log("Fetched partner data:", data); // Log the data
        setPartnerInfo({ ...data, scanCodes: data.scanCodes || [] });
      } catch (error) {
        // console.error("Erreur:", error);
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
      {/* Afficher le logo du plan qui est dans mon dossier public a la racine */}
      <img src={logoPlan} alt="Logo plan" style={{ maxWidth: 200, maxHeight: 200, marginBottom: 50 }} />
      <Typography variant="h1" sx={{ fontSize: 24, marginBottom: 5, fontFamily: "Spoof-Bold" }}>
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleScanResult = (result, isSuccess) => {
    setScanResult(result); // Mettre à jour l'état avec le code scanné

    // Vérifier si le scanne est validé code 200
    if (isSuccess) {
      setSnackbarOpen(true);
    }

    // Increment the scanCodes length
    setPartnerInfo((prevPartnerInfo) => {
      const updatedScanCodes = [
        ...(prevPartnerInfo.scanCodes || []),
        { id: Date.now(), scannedContent: result }
      ];
      return { ...prevPartnerInfo, scanCodes: updatedScanCodes };
    });
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
        margin: { xs: 2, md: 5 },
      }}
    >
      {partnerInfo && partnerInfo.image && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: { xs: "20px", md: "50px" },
          }}
        >
          {/* Image du partenaire */}
          <Box
            sx={{
              width: { xs: "100px", md: "150px" },
              height: { xs: "100px", md: "150px" }
            }}
          >
            <img
              src={`${URL}${partnerInfo.image.url}`}
              alt={partnerInfo.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </Box>

          {/* Symbole "&" */}
          <Typography
            sx={{
              fontSize: { xs: 18, md: 25 },
              marginLeft: { xs: "20px", md: "50px" },
              fontFamily: "Spoof-Bold",
            }}
          >
            &
          </Typography>

          {/* Logo Plan */}
          <Box
            sx={{
              marginLeft: { xs: "20px", md: "50px" },
              width: { xs: "100px", md: "150px" },
              height: { xs: "100px", md: "150px" }
            }}
          >
            <img
              src={logoPlan}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </Box>
        </Box>
      )}

      <Typography sx={{ textAlign:"left" }} variant="h1">
        Bienvenue{" "}
        <Typography variant="h1" sx={{ fontFamily: "Spoof-Bold" }} component="span" color="secondary">
          {partnerInfo.name}
        </Typography>{" "}
        sur votre espace partenaire
      </Typography>

      {partnerInfo && (
        <Box sx={{ mt: 5 }}>
          <Typography>Codes scannés : <b style={{ fontSize: 20 }}>{partnerInfo.scanCodes.length}</b></Typography>

          {/* Afficher le scanner lorsqu'on clique sur le bouton */}
          <Scanner onScan={handleScanResult} partnerInfo={partnerInfo} />

          <Typography color="primary" sx={{ mt: 5, fontFamily: "Spoof-Bold" }}>
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
              backgroundColor: colors.grey[50],
              padding: 2,
              borderRadius: 5
            }}
          >
            <Typography variant="h2" sx={{ fontSize: 20, fontFamily: "Spoof-Bold" }}>
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

      {/* Affichage du code scanné
      {scanResult && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          Code scanné : {scanResult}
        </Typography>
      )} */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          mt: 5,
        }}
      >
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </Box>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Le code a été enregistré avec succès !
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Home;
