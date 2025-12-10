import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ID de mesure Google Analytics 4
const GA_MEASUREMENT_ID = 'G-V83SQRDZET';

const GoogleAnalyticsTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Vérifie si gtag est disponible (chargé depuis index.html)
        if (typeof window.gtag !== 'undefined') {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;