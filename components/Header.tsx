import React, { useState } from 'react';
import type { SiteSettings, Page } from '../types';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  favoriteIds: string[];
  settings: SiteSettings;
  dynamicPages: Page[];
}

interface NavLink {
  name: string;
  path: string;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, favoriteIds, settings, dynamicPages }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dynamicLinks = dynamicPages
    .filter(p => p.showInHeader)
    .map(p => ({ name: p.title, path: `/${p.slug.current}` }));
  
  const staticLinks: NavLink[] = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos Biens', path: '/properties' },
  ];
  const navLinks = [...staticLinks, ...dynamicLinks];
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault();
      setCurrentPage(path);
      setIsOpen(false);
  };
  
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setCurrentPage('/contact');
      setIsOpen(false);
  };
  
  const renderLogo = () => {
    if (settings.logo) {
      return <img src={settings.logo} alt={settings.title} className="h-12 max-w-[220px] object-contain" />;
    }
    const titleParts = settings.title.split(' ');
    const firstWord = titleParts[0] || '';
    const restOfTitle = titleParts.slice(1).join(' ');
    return (
      <>
        <span className="text-2xl font-bold font-heading text-accent">{firstWord}</span>
        <span className="text-2xl font-bold font-heading text-primary-text ml-2">{restOfTitle}</span>
      </>
    );
  };

  const MobileMenu: React.FC = () => (
    <div
      className="fixed inset-0 z-40 bg-background transition-opacity duration-300"
      id="mobile-menu"
      aria-modal="true"
      role="dialog"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 border-b border-border-color">
          <a href="#" onClick={(e) => handleNavClick(e, '/')} className="flex items-center" aria-label={`Page d'accueil de ${settings.title}`}>
            {renderLogo()}
          </a>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-primary-text hover:bg-background-alt focus:outline-none focus:ring-2 focus:ring-accent"
            aria-controls="mobile-menu"
            aria-expanded="true"
          >
            <span className="sr-only">Fermer le menu principal</span>
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow px-4 pt-8 pb-4 space-y-4 text-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href="#"
              onClick={(e) => handleNavClick(e, link.path)}
              className="text-primary-text hover:text-accent block py-3 rounded-md text-2xl font-heading font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={handleContactClick}
            className="w-full mt-8 px-5 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-30 border-b border-border-color/75">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => handleNavClick(e, '/')} className="flex items-center" aria-label={`Page d'accueil de ${settings.title}`}>
              {renderLogo()}
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex flex-wrap items-center gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href="#"
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="text-primary-text hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={handleContactClick}
                className="ml-4 px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-text hover:bg-background-alt focus:outline-none focus:ring-2 focus:ring-accent"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && <MobileMenu />}
    </header>
  );
};

export default Header;