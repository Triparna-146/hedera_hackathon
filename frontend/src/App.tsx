import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import CertificateList from './pages/CertificateList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/issue" element={<IssueCertificate />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/certificates" element={<CertificateList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;