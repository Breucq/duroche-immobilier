import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import type { Property } from '../types';
import { urlFor } from '../services/sanityClient';
import ImageWithSkeleton from './ImageWithSkeleton';

interface PropertyCardProps {
  property: Property;
}

const IconRooms = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);
const IconBed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
const IconArea = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
);

const HeartIconSolid = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-1.06-1.061c-.43-.43-.822-.86-1.168-1.284C5.12 14.85 3 11.626 3 9.075c0-2.81 2.29-5.075 5.125-5.075c1.78 0 3.37.855 4.258 2.148a4.996 4.996 0 014.258-2.148C19.71 4 22 6.265 22 9.075c0 2.55-2.12 5.775-4.064 7.84a15.182 15.182 0 01-1.168 1.284 15.247 15.247 0 01-1.06 1.061 15.247 15.247 0 01-1.344.688l-.022.012-.007.003z" />
    </svg>
);
const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const DPEBadge: React.FC<{ classification: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' }> = ({ classification }) => {
    const dpeConfig = { A: { color: 'bg-green-700' }, B: { color: 'bg-green-500' }, C: { color: 'bg-lime-400' }, D: { color: 'bg-yellow-300' }, E: { color: 'bg-orange-400' }, F: { color: 'bg-red-500' }, G: { color: 'bg-red-700' }, };
    const config = dpeConfig[classification];
    return (
        <div className="absolute bottom-2 right-2 flex items-center bg-gray-800/70 p-1 rounded-sm shadow-lg text-white font-sans" title={`Classe énergie : ${classification}`}>
            <span className="text-xs mr-1.5">DPE</span>
            <span className={`w-5 h-5 flex items-center justify-center font-bold text-sm rounded-sm ${config.color}`}>
                {classification}
            </span>
        </div>
    );
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price);

  // SÉCURITÉ : On utilise la référence SEULEMENT si elle est "propre"
  const hasCleanReference = property.reference && /^[a-zA-Z0-9\-_]+$/.test(property.reference);
  const linkIdentifier = hasCleanReference ? property.reference : property._id;
  const detailPath = `/properties/${linkIdentifier}`;
  
  const isFavorite = favoriteIds.includes(property._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault(); 
      e.stopPropagation();
      toggleFavorite(property._id);
  };

  const statusConfig = { Nouveautés: { text: 'Nouveautés', className: 'bg-yellow-400 text-gray-800' }, 'Sous offre': { text: 'Sous offre', className: 'bg-blue-200 text-blue-800' }, Vendu: { text: 'Vendu', className: 'bg-gray-500 text-white' } };
  const statusInfo = property.status && property.status !== 'Disponible' ? statusConfig[property.status as keyof typeof statusConfig] : null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageUrls = [property.image, ...(property.images || [])]
    .filter(Boolean)
    .map(img => urlFor(img).width(600).height(450).auto('format').quality(80).url());
  
  const hasMultipleImages = imageUrls.length > 1;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNextClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if(currentImageIndex < imageUrls.length - 1) { setCurrentImageIndex(prev => prev + 1); } };
  const handlePrevClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if(currentImageIndex > 0) { setCurrentImageIndex(prev => prev - 1); } };

  // SEO: Alt text dynamique
  const altText = `${property.type} à vendre à ${property.location} - ${formattedPrice} - Vue ${currentImageIndex + 1}`;

  return (
    <Link 
      to={detailPath}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col border border-border-color/50"
      aria-label={`Voir les détails pour ${property.type} à ${property.location}`}
    >
      <div 
        ref={containerRef}
        className="relative overflow-hidden h-56"
      >
        <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {imageUrls.map((imgUrl, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                    <ImageWithSkeleton src={imgUrl} alt={altText} className="w-full h-full" />
                </div>
            ))}
        </div>

        {hasMultipleImages && (
            <>
                {currentImageIndex > 0 && (
                    <button onClick={handlePrevClick} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                )}
                {currentImageIndex < imageUrls.length - 1 && (
                    <button onClick={handleNextClick} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                    {imageUrls.slice(0, 8).map((_, index) => ( <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${ currentImageIndex === index ? 'bg-white scale-125 shadow-md' : 'bg-white/60' }`} /> ))}
                </div>
            </>
        )}

        <div className="absolute bottom-2 left-2 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold z-10">{property.type}</div>
        {statusInfo && <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.className} z-10`}>{statusInfo.text}</div>}
         <button onClick={handleFavoriteClick} className="absolute top-2 right-2 p-2 bg-white/75 rounded-full backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 z-10" aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
              {isFavorite ? <HeartIconSolid className="w-6 h-6 text-red-500" /> : <HeartIconOutline className="w-6 h-6 text-primary-text" />}
          </button>
        {property.dpe?.class && <DPEBadge classification={property.dpe.class} />}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-2xl font-bold font-heading text-primary-text mb-2">{formattedPrice}</p>
        <p className="text-secondary-text font-medium mb-4">{property.location}</p>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-sm text-secondary-text border-t border-border-color/70 pt-4 mt-auto">
            {property.rooms > 0 && <span title="Pièces" className="flex items-center gap-1.5"><IconRooms className="w-4 h-4 text-secondary"/> {property.rooms} p.</span>}
            {property.bedrooms > 0 && <span title="Chambres" className="flex items-center gap-1.5"><IconBed className="w-4 h-4 text-secondary"/> {property.bedrooms} ch.</span>}
            {property.area > 0 && <span title="Surface" className="flex items-center gap-1.5"><IconArea className="w-4 h-4 text-secondary"/> {property.area} m²</span>}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;