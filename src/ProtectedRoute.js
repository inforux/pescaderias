import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute(Component) {
    return function WrappedComponent(props) {
        const token = sessionStorage.getItem('token');

        if (!token) {
            return <Navigate to="/auth/login" replace />;
        }

        return <Component {...props} />;
    };
}

export default ProtectedRoute;