import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { QrReader } from "react-qr-reader";

const Scanner = ({ onScan }) => {
  const [open, setOpen] = useState(false); // Gère l'ouverture du scanner
  const [scanResult, setScanResult] = useState(null);
  const [hasPermission, setHasPermission] = useState(false); // Gère la permission d'utiliser l'appareil photo
  const [permissionDenied, setPermissionDenied] = useState(false); // Gère le cas où la permission est refusée

  useEffect(() => {
    // Demande la permission pour l'appareil photo
    const checkPermission = async () => {
      try {
        // Teste l'accès à la caméra
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        setPermissionDenied(false); // Réinitialise si l'accès est donné
      } catch (err) {
        console.error("Permission de caméra refusée", err);
        setHasPermission(false);
        setPermissionDenied(true); // Active l'état pour permission refusée
      }
    };

    checkPermission(); // Vérifie la permission dès que le composant est monté
  }, []);

  const handleScan = (data) => {
    if (data !== null) {
      setScanResult(data);
      onScan(data); // Passe le résultat du scan au parent
      setOpen(false); // Ferme le scanner après un scan réussi
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Fonction pour redemander l'accès à la caméra
  const requestPermission = () => {
    setPermissionDenied(false);
    setHasPermission(false);
    // Redemande la permission pour accéder à la caméra
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true);
        setPermissionDenied(false);
      })
      .catch(() => {
        setHasPermission(false);
        setPermissionDenied(true);
      });
  };

  return (
    <Box>
      {!open && hasPermission && (
        <Button sx={{ marginTop: 3 }} variant="outlined" onClick={handleOpen}>
          Ouvrir le Scanner
        </Button>
      )}
      {!hasPermission && permissionDenied && (
        <Box sx={{ marginTop: 3 }}>
          <Typography color="error">
            L'accès à l'appareil photo est nécessaire pour scanner les QR codes.
          </Typography>
          <Button
            variant="outlined"
            onClick={requestPermission}
            sx={{ marginTop: 2 }}
          >
            Redemander l'accès
          </Button>
        </Box>
      )}

      {open && hasPermission && (
        <Box>
          <QrReader
            delay={300}
            style={{ width: 300 }}
            onError={handleError}
            onScan={handleScan}
          />
          <Button variant="contained" onClick={handleClose}>
            Fermer Scanner
          </Button>
        </Box>
      )}

      {scanResult && <Typography>{scanResult}</Typography>}
    </Box>
  );
};

export default Scanner;
