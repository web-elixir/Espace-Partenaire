import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = ({ onScan }) => {
  const [open, setOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

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

  useEffect(() => {
    if (open && hasPermission) {
      const scanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false);
      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }
  }, [open, hasPermission]);

  const onScanSuccess = (decodedText, decodedResult) => {
    setScanResult(decodedText);
    onScan(decodedText); // Passe le résultat du scan au parent
    setOpen(false); // Ferme le scanner après un scan réussi

    // Tenter d'accéder au contenu
    const scannedContent = decodedText;
    console.log("Extracted content: ", scannedContent);

    if (scannedContent.startsWith("plandesetudiantsdebesancon")) {
      window.open(scannedContent, "_blank");
    } else {
      console.warn("Scanned content is not a valid URL");
      alert("QR Code non valide ou contenu manquant !");
    }
  };

  const onScanError = (err) => {
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
          <div id="reader" style={{ width: 300 }}></div>
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
