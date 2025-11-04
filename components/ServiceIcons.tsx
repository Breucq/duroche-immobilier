import React from 'react';
import type { ServiceIcon } from '../types';

// Définitions des composants SVG pour chaque icône de service.
const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
    </svg>
);

const BuildingStorefrontIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const iconMap: Record<ServiceIcon, React.FC> = {
    KeyIcon,
    BuildingStorefrontIcon,
    ChartBarIcon,
};

/**
 * Composant qui rend une icône de service spécifique en fonction de son nom.
 * @param {{ iconName: ServiceIcon }} props - Le nom de l'icône à afficher.
 */
export const ServiceIconComponent: React.FC<{ iconName: ServiceIcon }> = ({ iconName }) => {
    const Icon = iconMap[iconName] || KeyIcon; // Fallback sur KeyIcon si l'icône n'est pas trouvée
    return <Icon />;
};

/**
 * Liste des options d'icônes disponibles pour la sélection dans le panneau d'administration.
 */
export const serviceIconOptions: { value: ServiceIcon, label: string }[] = [
    { value: 'KeyIcon', label: 'Clé (Achat)' },
    { value: 'BuildingStorefrontIcon', label: 'Boutique (Vente)' },
    { value: 'ChartBarIcon', label: 'Graphique (Invest.)' },
];