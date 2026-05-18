import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { initializeTheme } from './hooks/use-appearance';
import { AuthProvider } from './contexts/auth-context';
import { AppRouter } from './router';

const rootElement = document.getElementById('app');
if (rootElement) {
    createRoot(rootElement).render(
        <HelmetProvider>
            <BrowserRouter>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </BrowserRouter>
        </HelmetProvider>,
    );
}

// This will set light / dark mode on load...
initializeTheme();
