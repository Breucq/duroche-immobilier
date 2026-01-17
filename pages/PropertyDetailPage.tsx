
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { propertyService } from '../services/propertyService';
import DPEChart from '../components/DPEChart';
import CharacteristicIcon from '../components/CharacteristicIcon';
import PropertyCard from '../components/PropertyCard';
import ShareButtons from '../components/ShareButtons';
import type { Property } from '../types';
import { urlFor } from '../services/sanityClient';
import { useFavorites } from '../context/FavoritesContext';
import MortgageSimulator from '../components/MortgageSimulator';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

// Icons
const IconRooms = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg> );
const IconBed = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> );
const IconArea = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg> );
const IconLand = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> );
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> );
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg> );
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg> );
const HeartIconSolid = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-1.06-1.061c-.43-.43-.822-.86-1.168-1.284C5.12 14.85 3 11.626 3 9.075c0-2.81 2.29-5.075 5.125-5.075c1.78 0 3.37.855 4.258 2.148a4.996 4.996 0 014.258-2.148C19.71 4 22 6.265 22 9.075c0 2.55-2.12 5.775-4.064 7.84a15.182 15.182 0 01-1.168 1.284 15.247 15.247 0 01-1.06 1.061 15.247 15.247 0 01-1.344.688l-.022.012-.007.003z" />
</svg> );
const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
</svg> );
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg> );
const PrinterIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg> );

interface PropertySliderProps { title: string; properties: Property[]; seeAllLink: string; seeAllText: string; setCurrentPage: (page: string) => void; className?: string; }
const PropertySlider: React.FC<PropertySliderProps> = ({ title, properties, seeAllLink, seeAllText, setCurrentPage, className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  if (properties.length === 0) return null;
  const scroll = (direction: 'left' | 'right') => { if (scrollContainerRef.current) { const { clientWidth } = scrollContainerRef.current; scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -clientWidth : clientWidth, behavior: 'smooth' }); } };
  const scrollbarHideStyle = `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`;
  return (
    <section className={`py-16 ${className} print-hidden`}>
      <style>{scrollbarHideStyle}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">{title}</h2>
            <div className="hidden sm:flex items-center gap-4">
                <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white shadow-md hover:bg-background-alt transition-colors" aria-label="Précédent"><ChevronLeftIcon className="w-6 h-6 text-primary-text" /></button>
                 <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white shadow-md hover:bg-background-alt transition-colors" aria-label="Suivant"><ChevronRightIcon className="w-6 h-6 text-primary-text" /></button>
            </div>
        </div>
        <div ref={scrollContainerRef} className="flex space-x-8 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
            {properties.map((p) => ( <div key={p._id} className="snap-center w-[90%] sm:w-[45%] md:w-[40%] lg:w-[31%] flex-shrink-0"> <PropertyCard property={p} /> </div> ))}
        </div>
        <div className="text-center mt-12"> <button onClick={() => setCurrentPage(seeAllLink)} className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">{seeAllText}</button> </div>
      </div>
    </section>
  );
};


const Section: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => ( <div className={`${className} print:break-inside-avoid print:mb-2`}> <h2 className="text-2xl font-heading font-semibold text-primary-text mb-4 border-b-2 border-border-color pb-2 print:text-base print:mb-1 print:border-b">{title}</h2> <div className="prose prose-lg max-w-none text-secondary-text leading-relaxed print:text-xs print:text-black print:leading-tight">{children}</div> </div> );
const KeyFeature: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => ( <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-border-color/80 print:border-gray-200 print:p-1 print:shadow-none"> <div className="text-accent mb-2 print:text-black print:mb-0 print:scale-50">{icon}</div> <p className="text-xl sm:text-2xl font-bold font-heading text-primary-text print:text-sm">{value}</p> <p className="text-sm text-secondary-text print:text-[10px]">{label}</p> </div> );
const CharacteristicSection: React.FC<{title: string, items?: string[]}> = ({title, items}) => { if (!items || items.length === 0) return null; return ( <div> <h4 className="text-md font-semibold text-primary-text mb-3 print:mb-1 print:text-xs print:font-bold">{title}</h4> <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-secondary-text print:grid-cols-3 print:gap-y-0.5 print:text-[10px]"> {items.map((char, index) => ( <li key={index} className="flex items-center"> <CharacteristicIcon characteristic={char} className="w-5 h-5 text-accent mr-3 flex-shrink-0 print:text-black print:w-2.5 print:h-2.5 print:mr-1" /> <span>{char}</span> </li> ))} </ul> </div> ); };


const PropertyDetailPage: React.FC = () => {
    const { reference } = useParams<{ reference: string }>();
    const navigate = useNavigate();
    const { pathname: path } = useLocation();
    const { favoriteIds, toggleFavorite } = useFavorites();
    const setCurrentPage = (page: string) => navigate(page);

    const [property, setProperty] = useState<Property | null>(null);
    const [similarProperties, setSimilarProperties] = useState<{ sameLocation: Property[], sameType: Property[] }>({ sameLocation: [], sameType: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!reference) { setIsLoading(false); return; }
            setIsLoading(true);
            try {
                const decodedRef = decodeURIComponent(reference);
                const prop = await propertyService.getByReference(decodedRef);
                setProperty(prop);
                
                if (prop) {
                    const similar = await propertyService.getSimilar(prop);
                    setSimilarProperties(similar);
                }
            } catch (error) {
                console.error("Failed to fetch property details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperty();
    }, [reference]);

    useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if (!isLightboxOpen || !property || !property.images || property.images.length === 0) return; if (e.key === 'Escape') { closeLightbox(); } else if (e.key === 'ArrowRight') { showNextImage(); } else if (e.key === 'ArrowLeft') { showPrevImage(); } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isLightboxOpen, currentImageIndex, property]);

    if (isLoading) {
        return <div className="py-48 text-center">Chargement du bien...</div>;
    }

    if (!property) {
        return ( <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-screen flex flex-col justify-center items-center"> <h1 className="text-3xl font-bold font-heading text-primary-text">Bien non trouvé</h1> <p className="mt-4 text-secondary-text">Le bien que vous cherchez n'existe pas ou a été retiré.</p> <button onClick={() => setCurrentPage('/properties')} className="mt-8 inline-block px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark"> Retour à la liste des biens </button> </div> );
    }
    
    // SEO Data Calculation
    const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price);
    const city = property.location.split(',')[0].trim();
    
    const getPlainDescription = (desc: string | any[]) => {
        if (Array.isArray(desc)) {
            return desc.map(block => block.children?.map((child: any) => child.text).join('') || '').join(' ');
        }
        return desc ? desc.replace(/\s+/g, ' ').trim() : '';
    };

    const keyAmenities: string[] = [];
    const allCharacteristics = [
        ...(property.characteristics?.exterior || []),
        ...(property.characteristics?.general || []),
        ...(property.characteristics?.land || [])
    ];
    if (allCharacteristics.some(c => c.toLowerCase().includes('piscine'))) keyAmenities.push('Piscine');
    if (allCharacteristics.some(c => c.toLowerCase().includes('jardin'))) keyAmenities.push('Jardin');
    if (allCharacteristics.some(c => c.toLowerCase().includes('garage'))) keyAmenities.push('Garage');
    const amenitiesString = keyAmenities.length > 0 ? ` - ${keyAmenities.join(' - ')}` : '';
    const seoTitle = `${property.type} à ${city}${property.area ? ` - ${property.area}m²` : ''}${property.bedrooms ? ` - ${property.bedrooms} chambres` : ''}${amenitiesString}`;
    
    const plainDesc = getPlainDescription(property.description);
    const seoDescription = plainDesc.length > 160 ? plainDesc.substring(0, 157) + '...' : plainDesc || `Découvrez ce bien d'exception à ${property.location} au prix de ${formattedPrice}.`;
    
    const shareImageUrl = property.image ? urlFor(property.image).width(1200).height(630).fit('crop').format('jpg').url() : '';
    const hasCleanRef = property.reference && /^[a-zA-Z0-9\-_]+$/.test(property.reference);
    
    // --- CALCUL DE L'URL CANONIQUE OFFICIELLE ---
    const officialSlug = hasCleanRef ? property.reference : property._id;
    const canonicalUrl = `https://www.duroche.fr/properties/${officialSlug}`;

    const shareRef = hasCleanRef ? property.reference : property._id;
    const smartShareUrl = `https://www.duroche.fr/api/share?ref=${shareRef}`;

    const isFavorite = favoriteIds.includes(property._id);
    const pluralType = property.type === 'Autre' ? 'Autres biens' : property.type.endsWith('s') ? property.type : `${property.type}s`;
    
    const allImages = [property.image, ...(property.images || [])].filter(Boolean);
    
    // --- GESTION DU CACHE LCP (SPA NAVIGATION) ---
    const preloadedUrl = (window as any).__LCP_IMG_URL__;
    const preloadedTarget = (window as any).__LCP_TARGET__;
    
    const decodedRef = decodeURIComponent(reference || '');
    const isTargetMatch = preloadedTarget === decodedRef || preloadedTarget === property._id;
    
    const firstImageUrl = (isTargetMatch && preloadedUrl) ? preloadedUrl : urlFor(allImages[0]).width(1280).quality(60).url();
    
    if (window && (window as any).__LCP_IMG_URL__) {
        (window as any).__LCP_IMG_URL__ = null;
        (window as any).__LCP_TARGET__ = null;
    }
    
    // OPTIMISATION : Les images secondaires (vignettes) doivent avoir un width(400) sinon on charge l'original
    const imageUrls = [
        firstImageUrl,
        ...allImages.slice(1).map(img => urlFor(img).width(1280).auto('format').quality(70).url())
    ];
    
    // Vignettes secondaires limitées à 400px de large
    const thumbUrls = allImages.map(img => urlFor(img).width(400).height(300).fit('crop').quality(60).url());

    const openLightbox = (index: number) => { setCurrentImageIndex(index); setIsLightboxOpen(true); };
    const closeLightbox = () => setIsLightboxOpen(false);
    const showNextImage = () => setCurrentImageIndex(prev => (prev + 1) % imageUrls.length);
    const showPrevImage = () => setCurrentImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
    
    const pricePerSqM = property.area > 0 ? property.price / property.area : 0;
    const formattedPricePerSqM = pricePerSqM > 0 ? `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(pricePerSqM)}/m²` : '';
    const statusConfig = { Nouveautés: { text: 'Nouveautés', className: 'bg-yellow-200 text-yellow-800 font-semibold' }, 'Sous offre': { text: 'Sous offre', className: 'bg-blue-100 text-blue-800 font-semibold' }, Vendu: { text: 'Vendu', className: 'bg-red-100 text-red-800 font-semibold' }, };
    const statusInfo = property.status && property.status !== 'Disponible' ? statusConfig[property.status as keyof typeof statusConfig] : null;
    
    const contactIdentifier = hasCleanRef ? property.reference : property._id;
    const contactPath = `/contact/${contactIdentifier}`;
    
    const scrollbarHideStyle = `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`;

    const renderHeating = (heating: string | string[]) => {
        if (Array.isArray(heating)) {
            return heating.join(', ');
        }
        return heating;
    };

    const portableTextComponents: PortableTextComponents = {
        block: {
            normal: ({ children }) => <p className="mb-4 text-justify whitespace-pre-line">{children}</p>,
        },
        marks: {
            strong: ({ children }) => <strong className="font-bold text-primary-text">{children}</strong>,
        }
    };

    const getImageAlt = (index: number) => `${property.type} à vendre à ${property.location} - Vue ${index + 1} - ${formattedPrice}`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": ["Product", "RealEstateListing"],
      "name": seoTitle,
      "description": seoDescription,
      "image": allImages.slice(0, 5).map(img => urlFor(img).width(1200).url()),
      "sku": property.reference || property._id,
      "brand": {
        "@type": "Organization",
        "name": "Duroche Immobilier"
      },
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "EUR",
        "price": property.price,
        "availability": property.status === 'Vendu' ? 'https://schema.org/Sold' : 'https://schema.org/InStock',
        "itemCondition": "https://schema.org/UsedCondition"
      },
      "category": "Real Estate > " + property.type
    };

    return (
        <div className="bg-background relative" key={property._id}>
            <Helmet>
                <title>{seoTitle} | Duroche Immobilier</title>
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={shareImageUrl} />
                <meta property="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <style>{scrollbarHideStyle}</style>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 pb-28 lg:pb-16 print:py-0 print:pt-2">

                 <nav className="flex flex-wrap mb-6 text-sm text-secondary-text print:hidden" aria-label="Fil d'ariane">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <Link to="/" className="hover:text-accent transition-colors flex items-center">
                                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                </svg>
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                <Link to="/properties" className="hover:text-accent transition-colors ml-1">Nos Biens</Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                <Link to={`/properties?location=${encodeURIComponent(city)}`} className="hover:text-accent transition-colors ml-1">{city}</Link>
                            </div>
                        </li>
                         <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                <span className="ml-1 font-medium text-primary-text">{property.type}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                 <div className="mb-8 print:hidden">
                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-4">
                         <div>
                             <div className="flex flex-wrap items-center gap-2 mb-2">
                                 <span className="inline-block bg-accent/10 text-accent text-sm font-semibold px-3 py-1.5 rounded-full print:hidden">{property.type}</span>
                                 {statusInfo && <span className={`inline-block text-sm px-3 py-1.5 rounded-full ${statusInfo.className} print:hidden`}>{statusInfo.text}</span>}
                             </div>
                             <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary-text print:hidden">{property.type} à {property.location}</h1>
                             {property.reference && <p className="text-sm text-secondary-text mt-1 print:hidden">Référence : {property.reference}</p>}
                         </div>
                         <div className="text-left sm:text-right flex-shrink-0 print:hidden">
                             <p className="text-3xl md:text-4xl font-bold font-heading text-accent">{formattedPrice}</p>
                             {formattedPricePerSqM && <p className="text-lg text-secondary-text mt-1">{formattedPricePerSqM}</p>}
                         </div>
                     </div>
                 </div>

                 {imageUrls && imageUrls.length > 0 && ( 
                    <> 
                        <div className="md:hidden mt-6 print:hidden"> 
                            <div className="relative flex overflow-x-auto snap-x snap-mandatory rounded-xl shadow-lg scrollbar-hide aspect-video"> 
                                {thumbUrls.map((thumbUrl, index) => ( 
                                    <div key={index} className="snap-center w-full flex-shrink-0 aspect-video relative group"> 
                                        <ImageWithSkeleton 
                                            src={thumbUrl} 
                                            alt={getImageAlt(index)} 
                                            className="w-full h-full" 
                                            onClick={() => openLightbox(index)} 
                                            fetchPriority={index === 0 ? "high" : "auto"}
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => openLightbox(index)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg> 
                                        </div> 
                                    </div> 
                                ))} 
                            </div> 
                        </div> 

                        <div className="hidden mt-6 md:grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2 md:h-[550px] rounded-xl overflow-hidden shadow-lg print:hidden"> 
                            <div className="md:col-span-2 md:row-span-2"> 
                                <button onClick={() => openLightbox(0)} className="w-full h-full block group relative"> 
                                    <ImageWithSkeleton 
                                        src={imageUrls[0]} 
                                        alt={getImageAlt(0)} 
                                        className="w-full h-full transition-transform duration-300 group-hover:scale-105" 
                                        fetchPriority="high"
                                        onLoad={() => {
                                            const ph = document.getElementById('lcp-detail-placeholder');
                                            if (ph) ph.style.display = 'none';
                                        }}
                                    />
                                </button> 
                            </div> 
                            {thumbUrls.slice(1, 5).map((thumbUrl, index) => ( 
                                <div key={index} className="hidden md:block"> 
                                    <button onClick={() => openLightbox(index + 1)} className="w-full h-full block group relative"> 
                                        <ImageWithSkeleton src={thumbUrl} alt={getImageAlt(index + 1)} className="w-full h-full transition-transform duration-300 group-hover:scale-105" />
                                        {index === 3 && imageUrls.length > 5 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold cursor-pointer">+{imageUrls.length - 5}</div>} 
                                    </button> 
                                </div> 
                            ))} 
                        </div> 
                    </> 
                )}

                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mt-12 print:block print:mt-4"> 
                    
                    <div className="lg:col-span-3 space-y-12 print:space-y-4"> 
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2 print:mb-4"> 
                            {property.rooms > 0 && <KeyFeature icon={<IconRooms className="w-8 h-8"/>} label="Pièces" value={property.rooms} />} 
                            {property.bedrooms > 0 && <KeyFeature icon={<IconBed className="w-8 h-8"/>} label="Chambres" value={property.bedrooms} />} 
                            {property.area > 0 && <KeyFeature icon={<IconArea className="w-8 h-8"/>} label="Habitable" value={`${property.area} m²`} />} 
                            {property.landArea > 0 && <KeyFeature icon={<IconLand className="w-8 h-8"/>} label="Terrain" value={`${property.landArea} m²`} />}
                        </div> 
                        
                        {property.virtualTourUrl && <div className="text-center print:hidden"> <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors w-full sm:w-auto"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Visite Virtuelle </a> </div>} 
                        
                        <div className="print:grid print:grid-cols-2 print:gap-6 space-y-12 print:space-y-0">
                            <div className="print:col-span-1">
                                <Section title="Description">
                                    {Array.isArray(property.description) ? (
                                        <PortableText value={property.description} components={portableTextComponents} />
                                    ) : (
                                        <p className="whitespace-pre-line text-justify">{property.description}</p>
                                    )}
                                </Section> 
                            </div>
                            <div className="print:col-span-1 space-y-12 print:space-y-4">
                                <Section title="Détails techniques">
                                    <ul className="list-none p-0 space-y-2 text-sm text-secondary-text print:text-xs">
                                        {property.details?.heating && (
                                            <li className="flex items-start">
                                                <strong className="min-w-[120px] font-semibold text-primary-text print:min-w-[90px]">Chauffage :</strong> 
                                                <span>{renderHeating(property.details.heating)}</span>
                                            </li>
                                        )}
                                        {property.details?.condition && (
                                            <li className="flex items-start">
                                                <strong className="min-w-[120px] font-semibold text-primary-text print:min-w-[90px]">État :</strong> 
                                                <span>{property.details.condition}</span>
                                            </li>
                                        )}
                                    </ul>
                                </Section>
                                {property.characteristics && <Section title="Caractéristiques"> <div className="space-y-6 print:space-y-2"> <CharacteristicSection title="Extérieur" items={property.characteristics.exterior} /> <CharacteristicSection title="Équipements" items={property.characteristics.equipment} /> </div> </Section>} 
                                {(property.dpe || property.ges) && <Section title="Performances"> <div className="space-y-4 print:space-y-2"> {property.dpe && <DPEChart type="DPE" classification={property.dpe.class} value={property.dpe.value} />} {property.ges && <DPEChart type="GES" classification={property.ges.class} value={property.ges.value} />} </div> </Section>} 
                            </div>
                        </div>
                        <div className="print:hidden">
                            <MortgageSimulator price={property.price} /> 
                        </div>
                    </div> 
                    
                    <div className="lg:col-span-2"> 
                        <div className="relative lg:sticky lg:top-28 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-border-color/80 print:hidden"> 
                            <button onClick={() => toggleFavorite(property._id)} className="absolute top-4 right-4 p-2 bg-white/75 rounded-full backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 print:hidden" aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>{isFavorite ? <HeartIconSolid className="w-7 h-7 text-red-500" /> : <HeartIconOutline className="w-7 h-7 text-primary-text" />}</button> 
                            <div className="pb-6 border-b border-border-color print:hidden"> 
                                <h2 className="text-2xl font-heading font-bold text-primary-text leading-tight pr-8">{property.type} à {property.location}</h2> 
                                <p className="text-3xl font-bold font-heading text-accent mt-2">{formattedPrice}</p> 
                            </div> 
                            <div className="print:hidden">
                                {property.status === 'Vendu' ? ( <div className="text-center mt-6"> <h3 className="text-xl font-heading font-semibold text-primary-text">Ce bien a été vendu</h3> <p className="text-secondary-text mt-2">Ce bien a trouvé preneur grâce à notre agence.</p> </div> ) : ( <> <div className="text-center mt-6"> <h3 className="text-xl font-heading font-semibold text-primary-text">Intéressé par ce bien ?</h3> </div> <div className="space-y-4 text-center mt-6"> <a href="tel:0756874788" className="block text-2xl font-bold text-accent-dark hover:underline">07 56 87 47 88</a> <button onClick={() => setCurrentPage(contactPath)} className="w-full text-center px-6 py-4 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"> Nous contacter </button> </div> </> )} 
                                <div className="my-6"> 
                                    <ShareButtons shareUrl={smartShareUrl} title={`${property.type} à vendre à ${property.location} - ${formattedPrice}`} heading="Partager ce bien" className="flex flex-col items-center" /> 
                                    <button onClick={() => window.print()} className="flex items-center justify-center gap-2 mt-4 text-sm text-secondary-text hover:text-accent transition-colors w-full mx-auto"><PrinterIcon className="w-5 h-5" /><span className="underline">Imprimer la fiche</span></button>
                                </div> 
                            </div>
                        </div> 
                    </div> 
                </div>

                <div className="hidden print:flex mt-4 pt-4 border-t-2 border-accent items-center justify-between bg-gray-50 p-4 rounded-lg break-inside-avoid">
                    <div className="flex items-center gap-4">
                        <div>
                            <h3 className="font-heading font-bold text-primary-text text-xl">Duroche Immobilier</h3>
                            <p className="text-xs text-secondary-text uppercase tracking-wide">Expert de l'immobilier - Vaucluse Nord</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-accent font-heading text-lg">Thomas DUBREUCQ & Sylvie ROCHE</p>
                        <p className="text-sm font-medium">07 56 87 47 88</p>
                        <p className="text-sm">contact@duroche.fr</p>
                        <p className="text-xs text-gray-400 mt-1">www.duroche.fr</p>
                    </div>
                </div>

            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-color p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 lg:hidden flex items-center justify-between gap-3 safe-area-bottom print:hidden">
                 <div className="flex items-col">
                    <span className="text-xs text-secondary-text">Prix</span>
                    <span className="text-lg font-bold font-heading text-accent">{formattedPrice}</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <a href="tel:0756874788" className="p-3 bg-background-alt text-primary-text rounded-lg border border-border-color hover:bg-border-color transition-colors" aria-label="Appeler">
                        <PhoneIcon className="w-5 h-5" />
                     </a>
                     <button onClick={() => setCurrentPage(contactPath)} className="px-4 py-3 bg-accent text-white font-bold rounded-lg text-sm shadow-md active:scale-95 transition-transform">
                        Nous contacter
                     </button>
                 </div>
            </div>

            <PropertySlider title={`Nos biens à ${city}`} properties={similarProperties.sameLocation} seeAllLink={`/properties?location=${encodeURIComponent(city)}`} seeAllText={`Découvrir tous nos biens à ${city}`} setCurrentPage={setCurrentPage} className="bg-background print:hidden" />
            <PropertySlider title={`Nos ${pluralType} à vendre`} properties={similarProperties.sameType} seeAllLink={`/properties?type=${encodeURIComponent(property.type)}`} seeAllText={`Découvrir tous nos ${pluralType}`} setCurrentPage={setCurrentPage} className="bg-background-alt print:hidden" />

            {isLightboxOpen && ( <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 print:hidden" onClick={closeLightbox}> <div className="relative w-full h-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}> <img src={imageUrls[currentImageIndex]} alt={getImageAlt(currentImageIndex)} className="w-full h-full object-contain" /> <button onClick={closeLightbox} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 focus:outline-none"><CloseIcon className="w-8 h-8"/></button> {imageUrls.length > 1 && ( <> <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 focus:outline-none"><ChevronLeftIcon className="w-8 h-8"/></button> <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 focus:outline-none"><ChevronRightIcon className="w-8 h-8"/></button> </> )} <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 rounded-full px-4 py-1 text-sm">{currentImageIndex + 1} / {imageUrls.length}</div> </div> </div> )}
        </div>
    );
};

export default PropertyDetailPage;