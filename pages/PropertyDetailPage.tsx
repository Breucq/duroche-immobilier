import React, { useState, useEffect, useRef } from 'react';
import { propertyService } from '../services/propertyService';
import DPEChart from '../components/DPEChart';
import CharacteristicIcon from '../components/CharacteristicIcon';
import PropertyCard from '../components/PropertyCard';
import ShareButtons from '../components/ShareButtons';
import type { Property } from '../types';
import { urlFor } from '../services/sanityClient';

const getPropertyIdFromPath = (path: string): string | undefined => path.split('/')[2];

// Icons
const IconRooms = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg> );
const IconBed = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> );
const IconArea = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg> );
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> );
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg> );
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg> );
const HeartIconSolid = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-1.06-1.061c-.43-.43-.822-.86-1.168-1.284C5.12 14.85 3 11.626 3 9.075c0-2.81 2.29-5.075 5.125-5.075c1.78 0 3.37.855 4.258 2.148a4.996 4.996 0 014.258-2.148C19.71 4 22 6.265 22 9.075c0 2.55-2.12 5.775-4.064 7.84a15.182 15.182 0 01-1.168 1.284 15.247 15.247 0 01-1.06 1.061 15.247 15.247 0 01-1.344.688l-.022.012-.007.003z" /></svg> );
const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> );

interface PropertySliderProps { title: string; properties: Property[]; seeAllLink: string; seeAllText: string; setCurrentPage: (page: string) => void; className?: string; favoriteIds: string[]; toggleFavorite: (id: string) => void; }
const PropertySlider: React.FC<PropertySliderProps> = ({ title, properties, seeAllLink, seeAllText, setCurrentPage, className, favoriteIds, toggleFavorite }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  if (properties.length === 0) return null;
  const scroll = (direction: 'left' | 'right') => { if (scrollContainerRef.current) { const { clientWidth } = scrollContainerRef.current; scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -clientWidth : clientWidth, behavior: 'smooth' }); } };
  const scrollbarHideStyle = `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`;
  return (
    <section className={`py-16 ${className}`}>
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
            {properties.map((p) => ( <div key={p._id} className="snap-center w-[90%] sm:w-[45%] md:w-[40%] lg:w-[31%] flex-shrink-0"> <PropertyCard property={p} setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} /> </div> ))}
        </div>
        <div className="text-center mt-12"> <button onClick={() => setCurrentPage(seeAllLink)} className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">{seeAllText}</button> </div>
      </div>
    </section>
  );
};


interface PropertyDetailPageProps { setCurrentPage: (page: string) => void; path: string; favoriteIds: string[]; toggleFavorite: (id: string) => void; }
const Section: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => ( <div className={className}> <h2 className="text-2xl font-heading font-semibold text-primary-text mb-4 border-b-2 border-border-color pb-2">{title}</h2> <div className="prose prose-lg max-w-none text-secondary-text leading-relaxed">{children}</div> </div> );
const KeyFeature: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => ( <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-border-color/80"> <div className="text-accent mb-2">{icon}</div> <p className="text-xl sm:text-2xl font-bold font-heading text-primary-text">{value}</p> <p className="text-sm text-secondary-text">{label}</p> </div> );
const CharacteristicSection: React.FC<{title: string, items?: string[]}> = ({title, items}) => { if (!items || items.length === 0) return null; return ( <div> <h4 className="text-md font-semibold text-primary-text mb-3">{title}</h4> <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-secondary-text"> {items.map((char, index) => ( <li key={index} className="flex items-center"> <CharacteristicIcon characteristic={char} className="w-5 h-5 text-accent mr-3 flex-shrink-0" /> <span>{char}</span> </li> ))} </ul> </div> ); };


const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ setCurrentPage, path, favoriteIds, toggleFavorite }) => {
    const id = getPropertyIdFromPath(path);
    const [property, setProperty] = useState<Property | null>(null);
    const [similarProperties, setSimilarProperties] = useState<{ sameLocation: Property[], sameType: Property[] }>({ sameLocation: [], sameType: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) { setIsLoading(false); return; }
            setIsLoading(true);
            try {
                const prop = await propertyService.getById(id);
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
    }, [id]);

    useEffect(() => {
        const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
            let element = document.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, key);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content || '');
        };
        
        if (property) {
            const title = `${property.type} à ${property.location} | Duroche Immobilier`;
            const description = property.description.substring(0, 160) + (property.description.length > 160 ? '...' : '');
            const imageUrl = urlFor(property.image).width(1200).height(630).fit('crop').url();
            const pageUrl = window.location.href;

            document.title = title;
            setMetaTag('name', 'description', description);

            // Open Graph (Facebook, etc.)
            setMetaTag('property', 'og:title', title);
            setMetaTag('property', 'og:description', description);
            setMetaTag('property', 'og:image', imageUrl);
            setMetaTag('property', 'og:url', pageUrl);
            setMetaTag('property', 'og:type', 'website');

            // Twitter Card
            setMetaTag('name', 'twitter:card', 'summary_large_image');
            setMetaTag('name', 'twitter:title', title);
            setMetaTag('name', 'twitter:description', description);
            setMetaTag('name', 'twitter:image', imageUrl);
        }
    }, [property]);

    useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if (!isLightboxOpen || !property || !property.images || property.images.length === 0) return; if (e.key === 'Escape') { closeLightbox(); } else if (e.key === 'ArrowRight') { showNextImage(); } else if (e.key === 'ArrowLeft') { showPrevImage(); } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isLightboxOpen, currentImageIndex, property]);

    if (isLoading) {
        return <div className="py-48 text-center">Chargement du bien...</div>;
    }

    if (!property) {
        return ( <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-screen flex flex-col justify-center items-center"> <h1 className="text-3xl font-bold font-heading text-primary-text">Bien non trouvé</h1> <p className="mt-4 text-secondary-text">Le bien que vous cherchez n'existe pas ou a été retiré.</p> <button onClick={() => setCurrentPage('/properties')} className="mt-8 inline-block px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark"> Retour à la liste des biens </button> </div> );
    }
    
    const isFavorite = favoriteIds.includes(property._id);
    const city = property.location.split(',')[0].trim();
    const pluralType = property.type === 'Autre' ? 'Autres biens' : property.type.endsWith('s') ? property.type : `${property.type}s`;
    
    const allImages = [property.image, ...(property.images || [])].filter(Boolean);
    const imageUrls = allImages.map(img => urlFor(img).auto('format').quality(80).url());
    const otherImages = imageUrls.slice(1, 5);

    const openLightbox = (index: number) => { setCurrentImageIndex(index); setIsLightboxOpen(true); };
    const closeLightbox = () => setIsLightboxOpen(false);
    const showNextImage = () => setCurrentImageIndex(prev => (prev + 1) % imageUrls.length);
    const showPrevImage = () => setCurrentImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
    const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price);
    const pricePerSqM = property.area > 0 ? property.price / property.area : 0;
    const formattedPricePerSqM = pricePerSqM > 0 ? `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(pricePerSqM)}/m²` : '';
    const statusConfig = { Nouveautés: { text: 'Nouveautés', className: 'bg-yellow-200 text-yellow-800 font-semibold' }, 'Sous offre': { text: 'Sous offre', className: 'bg-blue-100 text-blue-800 font-semibold' }, Vendu: { text: 'Vendu', className: 'bg-red-100 text-red-800 font-semibold' }, };
    const statusInfo = property.status && property.status !== 'Disponible' ? statusConfig[property.status as keyof typeof statusConfig] : null;
    const contactPath = property.reference ? `/contact/${property.reference}` : '/contact';
    const scrollbarHideStyle = `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`;

    return (
        <div className="bg-background">
            <style>{scrollbarHideStyle}</style>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
                {/* Header, Gallery, Content... */}
                 <div className="mb-8"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-4"><div><div className="flex flex-wrap items-center gap-2 mb-2"><span className="inline-block bg-accent/10 text-accent text-sm font-semibold px-3 py-1.5 rounded-full">{property.type}</span>{statusInfo && <span className={`inline-block text-sm px-3 py-1.5 rounded-full ${statusInfo.className}`}>{statusInfo.text}</span>}</div><h1 className="text-4xl md:text-5xl font-bold font-heading text-primary-text">{property.type} à {property.location}</h1>{property.reference && <p className="text-sm text-secondary-text mt-1">Référence : {property.reference}</p>}</div><div className="text-left sm:text-right flex-shrink-0"><p className="text-3xl md:text-4xl font-bold font-heading text-accent">{formattedPrice}</p>{formattedPricePerSqM && <p className="text-lg text-secondary-text mt-1">{formattedPricePerSqM}</p>}</div></div></div>
                 {imageUrls && imageUrls.length > 0 && ( <> <div className="md:hidden mt-6"> <div className="relative flex overflow-x-auto snap-x snap-mandatory rounded-xl shadow-lg scrollbar-hide"> {imageUrls.map((imgUrl, index) => ( <div key={index} className="snap-center w-full flex-shrink-0 aspect-video relative group"> <img src={imgUrl} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" onClick={() => openLightbox(index)} /> <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => openLightbox(index)}> <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg> </div> </div> ))} </div> {imageUrls.length > 1 && <div className="text-center mt-2 text-sm text-secondary-text">Faites glisser pour voir plus de photos</div>} </div> <div className="hidden mt-6 md:grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2 md:h-[550px] rounded-xl overflow-hidden shadow-lg"> <div className="md:col-span-2 md:row-span-2"> <button onClick={() => openLightbox(0)} className="w-full h-full block group relative"> <img src={imageUrls[0]} alt="Vue principale" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /> </button> </div> {otherImages.map((imgUrl, index) => ( <div key={index} className="hidden md:block"> <button onClick={() => openLightbox(index + 1)} className="w-full h-full block group relative"> <img src={imgUrl} alt={`Vue ${index + 2}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /> {index === 3 && imageUrls.length > 5 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold cursor-pointer">+{imageUrls.length - 5}</div>} </button> </div> ))} </div> </> )}
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mt-12"> <div className="lg:col-span-3 space-y-12"> <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {property.rooms > 0 && <KeyFeature icon={<IconRooms className="w-8 h-8"/>} label="Pièces" value={property.rooms} />} {property.bedrooms > 0 && <KeyFeature icon={<IconBed className="w-8 h-8"/>} label="Chambres" value={property.bedrooms} />} {property.area > 0 && <KeyFeature icon={<IconArea className="w-8 h-8"/>} label="Surface" value={`${property.area} m²`} />} {property.details?.yearBuilt && property.details.yearBuilt > 0 && <KeyFeature icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>} label="Année" value={property.details.yearBuilt} />} </div> {property.virtualTourUrl && <div className="text-center"> <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors w-full sm:w-auto"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Visite Virtuelle </a> </div>} <Section title="Description"><p className="whitespace-pre-line">{property.description}</p></Section> {property.characteristics && <Section title="Caractéristiques"> <div className="space-y-6"> <CharacteristicSection title="Général" items={property.characteristics.general} /> <CharacteristicSection title="Intérieur" items={property.characteristics.interior} /> <CharacteristicSection title="Extérieur" items={property.characteristics.exterior} /> <CharacteristicSection title="Équipements" items={property.characteristics.equipment} /> <CharacteristicSection title="Terrain" items={property.characteristics.land} /> <CharacteristicSection title="Local Commercial" items={property.characteristics.commercial} /> </div> </Section>} {property.financials && <Section title="Informations financières"> <ul className="list-none p-0 space-y-2"> <li><strong>Prix :</strong> {formattedPrice}</li> <li><strong>Honoraires :</strong> {property.financials.agencyFees}</li> {property.financials.propertyTax && <li><strong>Taxe Foncière :</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.financials.propertyTax)} / an</li>} {property.financials.condoFees && <li><strong>Charges de copropriété :</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.financials.condoFees)} / mois</li>} </ul> </Section>} {property.coOwnership?.isCoOwnership && <Section title="Informations sur la copropriété"> <ul className="list-none p-0 space-y-2"> <li><strong>Bien en copropriété :</strong> Oui</li> {property.coOwnership.numberOfLots && <li><strong>Nombre de lots :</strong> {property.coOwnership.numberOfLots}</li>} {property.coOwnership.proceedings && <li><strong>Procédure en cours :</strong> {property.coOwnership.proceedings}</li>} </ul> </Section>} {(property.dpe || property.ges) && <Section title="Performances énergétiques"> <div className="space-y-4"> {property.dpe && <DPEChart type="DPE" classification={property.dpe.class} value={property.dpe.value} />} {property.ges && <DPEChart type="GES" classification={property.ges.class} value={property.ges.value} />} </div> </Section>} {property.risks && <Section title="Les risques sur ce bien"><p>{property.risks}</p></Section>} </div> <div className="lg:col-span-2"> <div className="relative sticky top-28 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-border-color/80"> <button onClick={() => toggleFavorite(property._id)} className="absolute top-4 right-4 p-2 bg-white/75 rounded-full backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>{isFavorite ? <HeartIconSolid className="w-7 h-7 text-red-500" /> : <HeartIconOutline className="w-7 h-7 text-primary-text" />}</button> <div className="pb-6 border-b border-border-color"> <h2 className="text-2xl font-heading font-bold text-primary-text leading-tight pr-8">{property.type} à {property.location}</h2> <p className="text-3xl font-bold font-heading text-accent mt-2">{formattedPrice}</p> </div> {property.status === 'Vendu' ? ( <div className="text-center mt-6"> <h3 className="text-xl font-heading font-semibold text-primary-text">Ce bien a été vendu</h3> <p className="text-secondary-text mt-2">Ce bien a trouvé preneur grâce à notre agence. Contactez-nous pour que nous vous aidions à trouver une propriété similaire.</p> <button onClick={() => setCurrentPage('/properties')} className="mt-6 w-full text-center px-6 py-4 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"> Voir les biens disponibles </button> </div> ) : ( <> <div className="text-center mt-6"> <h3 className="text-xl font-heading font-semibold text-primary-text">Intéressé par ce bien ?</h3> <p className="text-secondary-text mt-2">Contactez votre conseiller pour organiser une visite.</p> </div> <div className="space-y-4 text-center mt-6"> <a href="tel:0600000000" className="block text-2xl font-bold text-accent-dark hover:underline">06 00 00 00 00</a> <button onClick={() => setCurrentPage(contactPath)} className="w-full text-center px-6 py-4 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"> Nous contacter </button> </div> </> )} <div className="my-6"> <ShareButtons shareUrl={`https://duroche.fr${path}`} title={`${property.type} à vendre à ${property.location} - ${formattedPrice}`} heading="Partager ce bien" className="flex flex-col items-center" /> </div> </div> </div> </div>
            </div>

            <PropertySlider title={`Nos biens à ${city}`} properties={similarProperties.sameLocation} seeAllLink={`/properties?location=${encodeURIComponent(city)}`} seeAllText={`Découvrir tous nos biens à ${city}`} setCurrentPage={setCurrentPage} className="bg-background" favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />
            <PropertySlider title={`Nos ${pluralType} à vendre`} properties={similarProperties.sameType} seeAllLink={`/properties?type=${encodeURIComponent(property.type)}`} seeAllText={`Découvrir tous nos ${pluralType}`} setCurrentPage={setCurrentPage} className="bg-background-alt" favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />

            {isLightboxOpen && ( <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={closeLightbox}> <div className="relative w-full h-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}> <img src={imageUrls[currentImageIndex]} alt={`Vue ${currentImageIndex + 1} du bien à ${property.location}`} className="w-full h-full object-contain" /> <button onClick={closeLightbox} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 focus:outline-none"><CloseIcon className="w-8 h-8"/></button> {imageUrls.length > 1 && ( <> <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 focus:outline-none"><ChevronLeftIcon className="w-8 h-8"/></button> <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 focus:outline-none"><ChevronRightIcon className="w-8 h-8"/></button> </> )} <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 rounded-full px-4 py-1 text-sm">{currentImageIndex + 1} / {imageUrls.length}</div> </div> </div> )}
        </div>
    );
};

export default PropertyDetailPage;