import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e94296",
    },
    secondary: {
      main: "#4CBDC7", 
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f4f4",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Spoof, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "150px",
          borderRadius: "50px",
          textTransform: "none",
          padding: "10px 20px",
          textTransform: "uppercase",
        },
      },
    },
  },
});

export default theme;
