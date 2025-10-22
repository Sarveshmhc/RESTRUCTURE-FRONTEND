import React, { useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type User = { role?: 'hr' | 'employee' };

interface AuthContextType {
    isAuthReady: boolean;
    isAuthenticated: boolean;
    user: User;
}

export const AuthContext = React.createContext<AuthContextType>({
    isAuthReady: false,
    isAuthenticated: false,
    user: {},
});

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
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ role?: 'hr' | 'employee' }>({});

    // Wait for auth hydration to complete to avoid false redirects on reload
    useEffect(() => {
        // Simulate async auth check
        setTimeout(() => {
            // Example: set user as authenticated HR
            setUser({ role: 'hr' });
            setIsAuthenticated(true);
            setIsAuthReady(true);
        }, 500);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthReady, isAuthenticated, user }}>
            {authContext && authContext.isAuthReady === false ? null : (
                // Check if user is authenticated
                !authContext?.isAuthenticated ? (
                    // Redirect to login page with return url
                    <Navigate
                        to={redirectTo}
                        state={{ from: location }}
                        replace
                    />
                ) : (
                    // Check if user has required role
                    allowedRoles && allowedRoles.length > 0 ? (
                        (() => {
                            const userRole = authContext?.user?.role;

                            if (!userRole || !allowedRoles.includes(userRole as 'hr' | 'employee')) {
                                // Redirect to unauthorized page or appropriate dashboard
                                const defaultRoute = userRole === 'hr' ? '/hr/home' : '/employee/home';
                                return <Navigate
                                    to={defaultRoute}
                                    replace
                                />;
                            }
                        })()
                    ) : (
                        <>{children}</>
                    )
                )
            )}
        </AuthContext.Provider>
    );
};

export default ProtectedRoute;