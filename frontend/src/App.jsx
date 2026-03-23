import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './index.css';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import { AwardsPage } from './pages/AwardsPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import { GalleryPage as Gallery, TeamPage, ContactPage } from './pages/OtherPages.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

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
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }
          }}
        />
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
          <Route path="*" element={
            <Layout>
              <div style={{ padding: '200px 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#C8102E' }}>404</h1>
                <p style={{ color: '#6B7280', marginTop: '1rem' }}>Page not found</p>
              </div>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;