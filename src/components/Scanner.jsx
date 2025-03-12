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

  const onScanSuccess = async (decodedText, decodedResult) => {
    setScanResult(decodedText);
    onScan(decodedText); // Notify the parent component (Home) of the scan result
    setOpen(false);

    const scannedContent = decodedText;
    console.log("Extracted content: ", scannedContent);

    if (scannedContent.startsWith("plandesetudiantsdebesancon")) {
      try {
        // Send data to Strapi
        await axios.post(`${API_URL}/scan-codes`, {
          data: {
            partner: partnerInfo.id, // Use the partner ID from partnerInfo
            scanDate: new Date().toISOString(),
          }
        });

        // Update scan codes locally
        partnerInfo.scanCodes = [...(partnerInfo.scanCodes || []), { id: Date.now(), scannedContent }];
        console.log("Scan enregistré avec succès");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du scan", error);
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

  const simulateScan = () => {
    const fakeQrCodeContent = "plandesetudiantsdebesancon://profil/loyalty/35";
    onScanSuccess(fakeQrCodeContent); // Simulate a scan with fake content
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

      <Button variant="contained" color="secondary" onClick={simulateScan} sx={{ marginTop: 2 }}>
        Simuler un Scan
      </Button>

      {/* {scanResult && <Typography>{scanResult}</Typography>} */}
    </Box>
  );
};

export default Scanner;