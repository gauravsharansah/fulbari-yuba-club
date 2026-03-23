import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import { AwardsPage } from './pages/AwardsPage';
import BlogPage from './pages/BlogPage';
import GalleryPage, { GalleryPage as Gallery, TeamPage, ContactPage } from './pages/OtherPages';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.9rem' } }} />
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/programs" element={<Layout><ProgramsPage /></Layout>} />
          <Route path="/awards" element={<Layout><AwardsPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/team" element={<Layout><TeamPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Layout><div style={{ padding: '200px 0', textAlign: 'center' }}><h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#C8102E' }}>404</h1><p>Page not found</p></div></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
