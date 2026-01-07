
import React from 'react';
import SearchBar from './SearchBar';

interface HeroProps {
  setCurrentPage: (page: string) => void;
  title: string;
  subtitle: string;
  buttonText: string;
  heroBackgroundImage: string;
}

/**
 * Composant "Hero" de la page d'accueil.
 * Optimisé pour le LCP : Utilise fetchPriority="high" et synchronise avec le preloader global.
 */
const Hero: React.FC<HeroProps> = ({ setCurrentPage, title, subtitle, buttonText, heroBackgroundImage }) => {
  // On récupère l'URL potentiellement déjà optimisée par le script du head
  const optimizedUrl = (window as any).__LCP_HERO_URL__ || heroBackgroundImage;

  return (
    <section className="relative h-[70vh] sm:h-[60vh] min-h-[500px] sm:min-h-[450px] pt-20 pb-32 sm:pb-24 flex items-center justify-center text-white">
      <img 
        src={optimizedUrl} 
        alt="" 
        role="presentation"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-4 text-shadow-lg">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-shadow mb-8">
          {subtitle}
        </p>
        <button
          onClick={() => setCurrentPage('/properties')}
          className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-accent transform hover:-translate-y-0.5"
        >
          {buttonText}
        </button>
      </div>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform translate-y-1/2 w-11/12 max-w-6xl px-4 sm:px-0 z-20">
        <SearchBar setCurrentPage={setCurrentPage} />
      </div>
    </section>
  );
};

export default Hero;