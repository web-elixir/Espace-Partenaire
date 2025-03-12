import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import { API_URL } from "../../services/api";

const Scanner = ({ onScan, partnerInfo }) => {
  const [open, setOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        setPermissionDenied(false);
      } catch (err) {
        console.error("Permission de caméra refusée", err);
        setHasPermission(false);
        setPermissionDenied(true);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    if (open && hasPermission) {
      const scanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: { width: 250, height: 250 } },
        false);
      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }
  }, [open, hasPermission]);


  // Compter le nombre de scannes de la même url sur les denrière 24h
  const getScansCount = async (url) => {
    try {
      // Récupérer la date actuelle et la date il y a 24 heures
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  
      // Récupérer les scans des dernières 24 heures pour cette URL et ce partenaire
      const response = await axios.get(`${API_URL}/partners/${partnerInfo.id}`, {
        params: {
          populate: "scanCodes",
        },
      });

      // Extraire les scanCodes du partenaire
      const scanCodes = response.data.scanCodes

      // Filtrer les scans des dernières 24 heures pour l'URL spécifiée
      const recentScans = scanCodes.filter((scan) => {
        const scanDate = new Date(scan.scanDate);
        return (
          scan.url === url &&
          scanDate >= new Date(twentyFourHoursAgo)
        );
      });

      // console.log("Scans récupérés :", recentScans); // Debug
      
      // Retourner le nombre de scans
      return recentScans.length;

    } catch (error) {
      console.error("Erreur lors de la récupération des scans", error);
      return 0; // En cas d'erreur, considérer qu'il n'y a aucun scan
    }
  };
  

  const onScanSuccess = async (decodedText, decodedResult) => {
    setScanResult(decodedText);
    setOpen(false);
  
    const scannedContent = decodedText;
    // console.log("Extracted content: ", scannedContent);

    const isValidUrl = scannedContent.startsWith("plandesetudiantsdebesancon");
  
    if (isValidUrl) {
      // Vérifier le nombre de scans pour cette URL dans les dernières 24 heures
      const scansCount = await getScansCount(scannedContent);
  
      if (scansCount >= 3) {
        setScanResult("Ce QRcode a déjà été scanné 3 fois aujourd'hui.");
        alert("Ce QRcode a déjà été scanné 3 fois aujourd'hui.");
        return;
      }
      
      try {
        // Envoyer les données à Strapi
        const response = await axios.post(`${API_URL}/scan-codes`, {
          data: {
            partner: partnerInfo.id, // Utiliser l'ID du partenaire
            scanDate: new Date().toISOString(),
            url: scannedContent
          },
        });
  
        // Vérifier si la requête a réussi (code 200)
        if (response.status === 200) {
          console.log("Scan enregistré avec succès");
          alert("Scan enregistré avec succès");
  
          // Notifier le composant parent (Home) du succès
          onScan(scannedContent, true); // true indique que la requête a réussi
        }
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du scan", error);
        onScan(scannedContent, false); // false indique que la requête a échoué
      }
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

  const requestPermission = () => {
    setPermissionDenied(false);
    setHasPermission(false);
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

  // const simulateScan = () => {
  //   const fakeQrCodeContent = "plandesetudiantsdebesancon://profil/loyalty/378";
  //   onScanSuccess(fakeQrCodeContent);
  // };

  return (
    <Box>
      {!open && hasPermission && (
        <Box
          sx={{ 
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            mt: 3,
          }}
        >
        <Button sx={{ marginTop: 3 }} variant="outlined" onClick={handleOpen}>
          Ouvrir le Scanner
        </Button>
      </Box>
      )}
      {!hasPermission && permissionDenied && (
        <Box>
          <Typography mt={5} color="error">
            L'accès à l'appareil photo est nécessaire pour scanner les QR codes.
          </Typography>
          <Box
          sx={{ 
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            mt: 3,
          }}
          >
            <Button
              variant="outlined"
              onClick={requestPermission}
              sx={{ marginTop: 2 }}
            >
              Redemander l'accès
            </Button>
          </Box>
        </Box>
      )}

      {open && hasPermission && (
        <Box>
          <div id="reader" style={{ width: 300 }}></div>
          <Box
            sx={{ 
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mt: 3,
            }}
          >
            <Button variant="contained" onClick={handleClose}>
              Fermer Scanner
            </Button>
          </Box>
        </Box>
      )}

      {/* <Button variant="contained" color="secondary" onClick={simulateScan} sx={{ marginTop: 2 }}>
        Simuler un Scan
      </Button> */}

      {/* {scanResult && <Typography>{scanResult}</Typography>} */}
    </Box>
  );
};

export default Scanner;