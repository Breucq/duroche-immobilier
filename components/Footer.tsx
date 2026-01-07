
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { footerSettingsService } from '../services/footerSettingsService';
import { propertyService } from '../services/propertyService';
import type { SiteSettings, Page } from '../types';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode, "aria-label": string }> = ({ href, children, "aria-label": ariaLabel }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={ariaLabel}>
        {children}
    </a>
);

interface FooterProps {
    settings: SiteSettings;
    dynamicPages: Page[];
}

const Footer: React.FC<FooterProps> = ({ settings, dynamicPages }) => {
    const { data: footerSettings } = useQuery({ queryKey: ['footerSettings'], queryFn: footerSettingsService.getSettings });
    const { data: allProperties } = useQuery({ queryKey: ['allPropertiesForFooter'], queryFn: propertyService.getAll });
    
    const footerPages = dynamicPages.filter(p => p.showInFooter);

    const popularSearches = useMemo(() => {
        if (!allProperties) return [];
        const uniqueSearches = new Set<string>();
        const activeProperties = allProperties.filter(p => !p.isHidden && p.status !== 'Vendu');
        activeProperties.forEach(prop => {
            const city = prop.location.split(',')[0].trim();
            if (city) uniqueSearches.add(`${prop.type} à ${city}`);
        });
        return Array.from(uniqueSearches).sort().slice(0, 15).map(line => {
            const parts = line.split(' à ');
            return { type: parts[0], city: parts[1], label: line };
        });
    }, [allProperties]);
    
    const renderLogo = () => {
        if (settings.footerLogo) {
          return <img src={settings.footerLogo} alt={settings.title} width="220" height="48" className="h-12 w-auto max-w-[220px] object-contain mx-auto md:mx-0" />;
        }
        return <span className="text-xl font-bold font-heading text-accent">{settings.title}</span>;
    };

  if (!footerSettings) return <footer className="bg-primary-text h-24"></footer>;

  return (
    <footer className="bg-primary-text text-gray-300">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
                <div className="mb-2 mx-auto md:mx-0">
                   {renderLogo()}
                </div>
                <p className="text-sm text-gray-400">{footerSettings.description}</p>
            </div>
             <div>
                <h3 className="text-lg font-heading font-semibold text-white">Liens Rapides</h3>
                <ul className="mt-2 space-y-1 text-sm">
                    <li><Link to="/" className="hover:text-white">Accueil</Link></li>
                    <li><Link to="/properties" className="hover:text-white">Acheter</Link></li>
                    <li><Link to="/vendre" className="hover:text-white">Vendre</Link></li>
                    <li><Link to="/estimation" className="hover:text-white">Estimation</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-heading font-semibold text-white">Contact</h3>
                <ul className="mt-2 space-y-1 text-sm">
                    <li><a href={`mailto:${footerSettings.email}`} className="hover:text-white">{footerSettings.email}</a></li>
                    <li><a href={`tel:${footerSettings.phone}`} className="hover:text-white">{footerSettings.phone}</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-heading font-semibold text-white">Suivez-nous</h3>
                 <div className="flex justify-center md:justify-start space-x-6 mt-2">
                    {footerSettings.facebookUrl && (<SocialIcon href={footerSettings.facebookUrl} aria-label="Facebook"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg></SocialIcon>)}
                 </div>
            </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} {footerSettings.copyright}</p>
             <a
                href="https://www.groupementimmo.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center text-gray-400"
            >
                {footerSettings.professionalCardLogo && (
                    <img src={footerSettings.professionalCardLogo} alt="Logo Carte Pro" width="120" height="24" className="h-6 w-auto mr-2" />
                )}
                <span>{footerSettings.professionalCardNumber}</span>
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
