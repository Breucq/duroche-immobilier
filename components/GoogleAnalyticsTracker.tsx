import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ID de mesure Google Analytics 4
const GA_MEASUREMENT_ID = 'G-V83SQRDZET';

const GoogleAnalyticsTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Vérifie si gtag est disponible
        if (typeof window.gtag !== 'undefined') {
            // Nous utilisons un timeout pour laisser le temps à 'react-helmet-async' 
            // de mettre à jour la balise <title> du navigateur.
            // Sans ce délai, GA4 risquerait d'enregistrer la nouvelle URL avec l'ancien titre de la page précédente.
            const timeoutId = setTimeout(() => {
                window.gtag('config', GA_MEASUREMENT_ID, {
                    page_path: location.pathname + location.search,
                    page_location: window.location.href,
                    page_title: document.title, // Envoie le titre visible dans l'onglet (ex: "Contact | Duroche Immobilier")
                });
            }, 500); // 500ms de délai

            return () => clearTimeout(timeoutId);
        }
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;