
import React from 'react';
import SearchBar from './SearchBar';

interface HeroProps {
  setCurrentPage: (page: string) => void;
  title: string;
  subtitle: string;
  buttonText: string;
  heroBackgroundImage: string;
}

const Hero: React.FC<HeroProps> = ({ setCurrentPage, title, subtitle, buttonText, heroBackgroundImage }) => {
  // Extraction de l'URL de base propre Sanity
  const rawBaseUrl = (heroBackgroundImage || '').split('?')[0];

  const smallUrl = rawBaseUrl ? `${rawBaseUrl}?w=960&h=640&fit=crop&q=82&auto=format` : '';
  const mediumUrl = rawBaseUrl ? `${rawBaseUrl}?w=1280&h=720&fit=crop&q=82&auto=format` : '';
  const largeUrl = rawBaseUrl ? `${rawBaseUrl}?w=1920&h=1080&fit=crop&q=85&auto=format` : '';

  const fallbackUrl = (window as any).__LCP_IMG_URL__ || largeUrl || heroBackgroundImage;

  return (
    <section className="relative h-[60vh] sm:h-[50vh] min-h-[450px] sm:min-h-[400px] pt-20 pb-32 sm:pb-24 flex items-center justify-center text-white">
      {rawBaseUrl ? (
        <picture className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <source
            media="(max-width: 640px)"
            srcSet={`${rawBaseUrl}?w=960&h=640&fit=crop&q=82&auto=format`}
          />
          <source
            media="(max-width: 1024px)"
            srcSet={`${rawBaseUrl}?w=1280&h=720&fit=crop&q=82&auto=format`}
          />
          <img 
            src={fallbackUrl}
            srcSet={`${smallUrl} 960w, ${mediumUrl} 1280w, ${largeUrl} 1920w`}
            sizes="100vw"
            alt="" 
            role="presentation"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
            onLoad={() => {
                const ph = document.getElementById('lcp-placeholder');
                if (ph) ph.style.display = 'none';
            }}
          />
        </picture>
      ) : (
        <img 
          src={fallbackUrl}
          alt="" 
          role="presentation"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onLoad={() => {
              const ph = document.getElementById('lcp-placeholder');
              if (ph) ph.style.display = 'none';
          }}
        />
      )}
      <div className="absolute inset-0 bg-black opacity-50 z-0 pointer-events-none"></div>
      
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