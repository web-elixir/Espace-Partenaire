import React from 'react'
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './assets/theme';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/partenaire">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
