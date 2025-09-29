import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './views/contexts/AuthContext';
import { LoadingProvider } from './views/contexts/LoadingContext';
import { ToastProvider } from './views/contexts/ToastContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => (
  <AuthProvider>
    <LoadingProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </LoadingProvider>
  </AuthProvider>
);

export default App;