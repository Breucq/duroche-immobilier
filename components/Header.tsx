import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import type { SiteSettings, Page } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  dynamicPages: Page[];
}

const Header: React.FC<HeaderProps> = ({ settings, dynamicPages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteIds } = useFavorites();

  const dynamicLinks = dynamicPages
    .filter(p => p.showInHeader)
    .map(p => ({ name: p.title, path: `/${p.slug.current}` }));
  
  const staticLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Acheter', path: '/properties' },
    { name: 'Vendre', path: '/vendre' },
  ];
  const navLinks = [...staticLinks, ...dynamicLinks];
  
  const renderLogo = () => {
    if (settings.logo) {
      // FIX CLS: Dimensions explicites
      return <img src={settings.logo} alt={settings.title} width="220" height="48" className="h-12 w-auto max-w-[220px] object-contain" />;
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

  const MobileMenu: React.FC = () => {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-white" id="mobile-menu">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 border-b border-border-color">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
              {renderLogo()}
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-text"
            >
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow px-4 pt-8 pb-4 space-y-4 text-center overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-primary-text block py-3 text-2xl font-heading font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full mt-8 inline-block px-5 py-3 text-lg font-medium rounded-lg text-white bg-accent"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <header className="main-header bg-background/80 backdrop-blur-md sticky top-0 z-30 border-b border-border-color/75">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" aria-label={`Page d'accueil de ${settings.title}`}>
              {renderLogo()}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex flex-wrap items-center gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-primary-text hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
               <Link
                to="/favorites"
                className="relative text-primary-text hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoriteIds.length > 0 && (
                  <span className="absolute top-1 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>
              <Link 
                to="/contact"
                className="ml-4 px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-text"
            >
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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