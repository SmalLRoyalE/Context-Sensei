import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import { NotFound } from './components/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  return (
      <Router>
      <ErrorBoundary>
        <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
      </ErrorBoundary>
      </Router>
  );
};
