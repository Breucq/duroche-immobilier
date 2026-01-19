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

    // LOGIQUE DE MAILLAGE SEO : Génère des liens dynamiques basés sur le stock réel
    const popularSearches = useMemo(() => {
        if (!allProperties) return [];
        const uniqueKeys = new Set<string>();
        const results: { label: string, path: string }[] = [];
        
        const activeProperties = allProperties.filter(p => !p.isHidden && p.status !== 'Vendu');
        
        activeProperties.forEach(prop => {
            const city = prop.location.split(',')[0].trim();
            const type = prop.type;
            const key = `${type}-${city}`;
            
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                results.push({
                    label: `${type} à ${city}`,
                    path: `/properties?location=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`
                });
            }
        });
        
        // On limite à 12 liens pour ne pas surcharger le footer
        return results.sort((a, b) => a.label.localeCompare(b.label)).slice(0, 12);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 text-center md:text-left">
            
            {/* Colonne 1 : Logo & Mission */}
            <div className="lg:col-span-1">
                <div className="mb-4 mx-auto md:mx-0">
                   {renderLogo()}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{footerSettings.description}</p>
                <div className="flex justify-center md:justify-start space-x-4 mt-6">
                    {footerSettings.facebookUrl && (
                        <SocialIcon href={footerSettings.facebookUrl} aria-label="Facebook">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        </SocialIcon>
                    )}
                </div>
            </div>

            {/* Colonne 2 : Liens Rapides */}
            <div>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6">Navigation</h3>
                <ul className="space-y-3 text-sm">
                    <li><Link to="/" className="hover:text-accent transition-colors">Accueil</Link></li>
                    <li><Link to="/properties" className="hover:text-accent transition-colors">Acheter</Link></li>
                    <li><Link to="/vendre" className="hover:text-accent transition-colors">Vendre</Link></li>
                    <li><Link to="/estimation" className="hover:text-accent transition-colors">Estimation Offerte</Link></li>
                    <li><Link to="/blog" className="hover:text-accent transition-colors">Actualités</Link></li>
                </ul>
            </div>

            {/* Colonne 3 : Informations (Pages Sanity) */}
            <div>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6">Informations</h3>
                <ul className="space-y-3 text-sm">
                    {footerPages.map(page => (
                        <li key={page._id}>
                            <Link to={`/${page.slug.current}`} className="hover:text-accent transition-colors">
                                {page.title}
                            </Link>
                        </li>
                    ))}
                    <li><Link to="/contact" className="hover:text-accent transition-colors">Nous contacter</Link></li>
                </ul>
            </div>

            {/* Colonne 4 : Recherches Populaires (Maillage dynamique) */}
            <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6">Recherches</h3>
                <ul className="grid grid-cols-1 gap-y-3 text-sm">
                    {popularSearches.length > 0 ? popularSearches.map((search, idx) => (
                        <li key={idx}>
                            <Link to={search.path} className="hover:text-accent transition-colors">
                                {search.label}
                            </Link>
                        </li>
                    )) : (
                        <li className="text-gray-500 italic">Maison à Orange, Appartement à Piolenc...</li>
                    )}
                </ul>
            </div>

            {/* Colonne 5 : Contact */}
            <div>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6">Contact</h3>
                <ul className="space-y-4 text-sm">
                    <li className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase mb-1">E-mail</span>
                        <a href={`mailto:${footerSettings.email}`} className="hover:text-accent text-white transition-colors">{footerSettings.email}</a>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase mb-1">Téléphone</span>
                        <a href={`tel:${footerSettings.phone}`} className="hover:text-accent text-white transition-colors">{footerSettings.phone}</a>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase mb-1">Adresse</span>
                        <address className="not-italic text-gray-400 leading-relaxed">
                            {footerSettings.address}
                        </address>
                    </li>
                </ul>
            </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} {footerSettings.copyright}</p>
            
            <a
                href="https://www.groupementimmo.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
                {footerSettings.professionalCardLogo && (
                    <img src={footerSettings.professionalCardLogo} alt="Logo Carte Pro" width="100" height="20" className="h-5 w-auto mr-3 grayscale opacity-50" />
                )}
                <span>{footerSettings.professionalCardNumber}</span>
            </a>
            
            <p className="md:order-last">Site conçu avec soin pour Duroche Immobilier</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;