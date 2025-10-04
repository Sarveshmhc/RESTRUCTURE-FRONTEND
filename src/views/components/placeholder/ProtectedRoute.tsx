import React, { useContext } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: ('hr' | 'employee')[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/login'
}) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    // Check if user is authenticated
    if (!authContext?.isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate
            to={redirectTo}
            state={{ from: location }}
            replace
        />;
    }

    // Check if user has required role
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = authContext?.user?.role;

        if (!userRole || !allowedRoles.includes(userRole as 'hr' | 'employee')) {
            // Redirect to unauthorized page or appropriate dashboard
            const defaultRoute = userRole === 'hr' ? '/hr/home' : '/employee/home';
            return <Navigate
                to={defaultRoute}
                replace
            />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;