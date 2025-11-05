import React, { useState, useEffect } from 'react';
import { footerSettingsService } from '../services/footerSettingsService';
import type { FooterSettings, SiteSettings, Page } from '../types';
import { propertyService } from '../services/propertyService';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode, "aria-label": string }> = ({ href, children, "aria-label": ariaLabel }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={ariaLabel}>
        {children}
    </a>
);

interface FooterProps {
    setCurrentPage: (page: string) => void;
    settings: SiteSettings;
    dynamicPages: Page[];
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage, settings, dynamicPages }) => {
    const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
    const [popularSearches, setPopularSearches] = useState<{ type: string; city: string; label: string }[]>([]);
    
    const footerPages = dynamicPages.filter(p => p.showInFooter);

    useEffect(() => {
        const fetchFooterData = async () => {
            const [fetchedSettings, allProperties] = await Promise.all([
                footerSettingsService.getSettings(),
                propertyService.getAll(),
            ]);
            
            setFooterSettings(fetchedSettings);

            const uniqueSearches = new Set<string>();
            const activeProperties = allProperties.filter(p => !p.isHidden && p.status !== 'Vendu');
            activeProperties.forEach(prop => {
                const city = prop.location.split(',')[0].trim();
                if (city) {
                    uniqueSearches.add(`${prop.type} à ${city}`);
                }
            });
            const generatedSearches = Array.from(uniqueSearches)
                .sort()
                .slice(0, 15)
                .map(line => {
                    const parts = line.split(' à ');
                    const type = parts[0] || 'Maison';
                    const city = parts[1] || 'Unknown';
                    return { type, city, label: line };
                });
            setPopularSearches(generatedSearches);
        };

        fetchFooterData();
    }, []);

    const handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement>, type: string, city: string) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('type', type);
        params.append('location', city);
        setCurrentPage(`/properties?${params.toString()}`);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        setCurrentPage(path);
    };
    
    const renderLogo = () => {
        if (settings.footerLogo) {
          return <img src={settings.footerLogo} alt={settings.title} className="h-12 max-w-[220px] object-contain mx-auto md:mx-0" />;
        }
        const titleParts = settings.title.split(' ');
        const firstWord = titleParts[0] || '';
        const restOfTitle = titleParts.slice(1).join(' ');
        return (
          <>
            <span className="text-xl font-bold font-heading text-accent">{firstWord}</span>
            <span className="text-xl font-bold font-heading text-gray-300 ml-1">{restOfTitle}</span>
          </>
        );
    };

  if (!footerSettings) {
      return <footer className="bg-primary-text h-24"></footer>; // Placeholder or loading state
  }

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
                    <li><a href="#" onClick={(e) => handleNavClick(e, '/')} className="hover:text-white">Accueil</a></li>
                    <li><a href="#" onClick={(e) => handleNavClick(e, '/properties')} className="hover:text-white">Nos Biens</a></li>
                    <li><a href="#" onClick={(e) => handleNavClick(e, '/nos-biens-vendus')} className="hover:text-white">Nos Biens Vendus</a></li>
                    <li><a href="#" onClick={(e) => handleNavClick(e, '/blog')} className="hover:text-white">Blog</a></li>
                    {footerPages.filter(p => p.slug.current !== 'legal-notice').map(page => (
                         <li key={page._id}><a href="#" onClick={(e) => handleNavClick(e, `/${page.slug.current}`)} className="hover:text-white">{page.title}</a></li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-heading font-semibold text-white">Contact</h3>
                <ul className="mt-2 space-y-1 text-sm">
                    <li><a href={`mailto:${footerSettings.email}`} className="hover:text-white">{footerSettings.email}</a></li>
                    <li><a href={`tel:${footerSettings.phone.replace(/\s/g, '')}`} className="hover:text-white">{footerSettings.phone}</a></li>
                    <li>{footerSettings.address}</li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-heading font-semibold text-white">Suivez-nous</h3>
                 <div className="flex justify-center md:justify-start space-x-6 mt-2">
                    {footerSettings.facebookUrl && (<SocialIcon href={footerSettings.facebookUrl} aria-label="Facebook"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></SocialIcon>)}
                    {footerSettings.linkedinUrl && (<SocialIcon href={footerSettings.linkedinUrl} aria-label="LinkedIn"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></SocialIcon>)}
                    {footerSettings.instagramUrl && (<SocialIcon href={footerSettings.instagramUrl} aria-label="Instagram"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg></SocialIcon>)}
                    {footerSettings.twitterUrl && (<SocialIcon href={footerSettings.twitterUrl} aria-label="Twitter"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></SocialIcon>)}
                    {footerSettings.youtubeUrl && (<SocialIcon href={footerSettings.youtubeUrl} aria-label="YouTube"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></SocialIcon>)}
                 </div>
            </div>
        </div>
        {popularSearches.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-heading font-semibold text-white text-center md:text-left">Immobilier dans le Vaucluse Nord</h3>
                <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-2 text-sm">
                    {popularSearches.map(search => (
                        <li key={search.label}>
                            <a href="#" onClick={(e) => handleSearchClick(e, search.type, search.city)} className="hover:text-white transition-colors">
                                {search.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>
                &copy; {new Date().getFullYear()} {footerSettings.copyright}
            </p>
            <div className="mt-2 space-x-4">
                {footerPages.filter(p => p.slug.current === 'legal-notice').map(page => (
                    <a key={page._id} href="#" onClick={(e) => handleNavClick(e, `/${page.slug.current}`)} className="hover:text-white underline transition-colors">{page.title}</a>
                ))}
            </div>
             <a
                href="https://www.groupementimmo.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Voir la carte professionnelle sur groupementimmo.fr"
            >
                {footerSettings.professionalCardLogo ? (
                    <img src={footerSettings.professionalCardLogo} alt="Logo Carte Professionnelle" className="h-6 w-auto mr-2" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 3 9-3a12.02 12.02 0 00-2.382-9.971z" />
                    </svg>
                )}
                <span>{footerSettings.professionalCardNumber}</span>
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;