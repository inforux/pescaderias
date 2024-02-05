import React, { useEffect } from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductRoutes from './routes/ProductRoutes';
import LoginRoutes from './routes/LoginRoutes';
import ProtectedRoute from './ProtectedRoute'; 
import Layout from './components/Layout'; 
import Logout from './modules/Login/Logout';
import VentaRoutes from './routes/VentaRoutes';
import Footer from './components/Footer';

function App() {
    const ProtectedProductRoutes = ProtectedRoute(ProductRoutes);
    const ProtectedVentaRoutes = ProtectedRoute(VentaRoutes);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/auth/*" element={<LoginRoutes />} />
                <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
                <Route path="/auth/logout" element={<Logout />} />
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path="/products/*" element={
                    <Layout>
                        <ProtectedProductRoutes />
                    </Layout>
                } />
                <Route path="/ventas/*" element={
                    <Layout>
                        <ProtectedVentaRoutes />
                    </Layout>
                } />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;