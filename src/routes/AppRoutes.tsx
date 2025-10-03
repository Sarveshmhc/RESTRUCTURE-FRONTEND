import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routeConfig } from './routes';
import ProtectedRoute from '../views/components/placeholder/ProtectedRoute';
import BaseLayout from '../views/partials/baselayout/BaseLayout';

// Import existing auth pages
import Login from '../views/auth/login/Login';

// Create a simple error component for now
const ErrorPage: React.FC<{ error: string }> = ({ error }) => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">{error}</h1>
            <p className="text-gray-600 mt-2">Please try again or contact support.</p>
        </div>
    </div>
);

// Loading fallback component
const LoadingFallback: React.FC = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
);

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ErrorPage error="Page Under Development" />} />
                <Route path="/reset-password" element={<ErrorPage error="Page Under Development" />} />
                <Route path="/enter-otp" element={<ErrorPage error="Page Under Development" />} />
                <Route path="/error/401" element={<ErrorPage error="401 - Unauthorized" />} />
                <Route path="/error/404" element={<ErrorPage error="404 - Page Not Found" />} />
                <Route path="/error/500" element={<ErrorPage error="500 - Internal Server Error" />} />

                {/* Root redirect - improved logic */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Protected routes from config */}
                {routeConfig.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <ProtectedRoute allowedRoles={route.roles}>
                                <BaseLayout>
                                    <route.component />
                                </BaseLayout>
                            </ProtectedRoute>
                        }
                    />
                ))}

                {/* Catch all route for 404 */}
                <Route path="*" element={<ErrorPage error="404 - Page Not Found" />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;