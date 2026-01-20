import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ID de mesure Google Analytics 4
const GA_MEASUREMENT_ID = 'G-V83SQRDZET';

const GoogleAnalyticsTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Vérifie si gtag est disponible. Avec le chargement retardé dans index.html,
        // cette fonction s'exécutera une fois que le script sera injecté.
        const sendPageView = () => {
            if (typeof window.gtag === 'function') {
                window.gtag('config', GA_MEASUREMENT_ID, {
                    page_path: location.pathname + location.search,
                    page_location: window.location.href,
                    page_title: document.title,
                });
            }
        };

        const timeoutId = setTimeout(sendPageView, 500);
        return () => clearTimeout(timeoutId);
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;