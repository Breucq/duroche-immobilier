import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import type { Property } from '../types';

// --- ICONS ---
const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const PropertyTypeIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const PriceIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> );
const BedroomsIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> );
const AreaIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg> );
const CheckmarkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> );

interface CustomCheckboxProps { id: string; name: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, name, label, checked, onChange }) => { return ( <label htmlFor={id} className="flex items-center cursor-pointer group text-sm text-primary-text"> <input id={id} name={name} type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" /> <span className="w-5 h-5 rounded-lg border-2 border-border-color bg-white group-hover:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent peer-checked:bg-accent peer-checked:border-accent transition-colors flex items-center justify-center flex-shrink-0"> <CheckmarkIcon className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" /> </span> <span className="ml-2.5">{label}</span> </label> ); };

const AlertModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (email: string) => Promise<boolean>; criteriaSummary: string; }> = ({ isOpen, onClose, onSave, criteriaSummary }) => { 
    const [email, setEmail] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    if (!isOpen) return null; 
    
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        setIsSubmitting(true);
        const success = await onSave(email);
        setIsSubmitting(false);
        if(success) {
            setEmail('');
            onClose();
        }
    }; 
    
    return ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}> 
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}> 
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-4">Créer une Alerte</h2> 
                <p className="text-secondary-text mb-2">Laissez-nous vos critères. Nous vous contacterons dès qu'un bien correspondant est disponible.</p> 
                <div className="bg-background-alt p-3 rounded-lg text-sm text-secondary-text mb-6"> <strong>Vos critères :</strong> {criteriaSummary || "Tous les biens"} </div> 
                <form onSubmit={handleSubmit}> 
                    <label htmlFor="alert-email" className="block text-sm font-medium text-primary-text">Votre adresse e-mail</label> 
                    <input id="alert-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="exemple@email.com" className="mt-1 py-2 px-3 block w-full bg-white shadow-sm border-border-color rounded-lg focus:ring-1 focus:ring-accent focus:border-accent" /> 
                    <div className="mt-6 flex justify-end space-x-3"> 
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300">Annuler</button> 
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-accent hover:bg-accent-dark disabled:opacity-50">
                            {isSubmitting ? 'Envoi...' : 'M\'alerter'}
                        </button> 
                    </div> 
                </form> 
            </div> 
        </div> 
    ); 
};

const PropertiesListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: properties = [], isLoading } = useQuery({
        queryKey: ['activeProperties'],
        queryFn: propertyService.getActive
    });
    
    const { data: availableLocations } = useQuery({
        queryKey: ['availableLocations'],
        queryFn: propertyService.getUniqueLocations
    });

    // Local state for filters
    const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('price') || '');
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [bedrooms, setBedrooms] = useState('all');
    const [minArea, setMinArea] = useState('');
    const [amenities, setAmenities] = useState({ pool: false, garden: false, garage: false, terrace: false, cellar: false });
    const [sortBy, setSortBy] = useState('date_desc');
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;
    
    // State for location dropdown
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filtrer les suggestions en fonction de la saisie
    const filteredLocations = useMemo(() => availableLocations?.filter(city => 
        city.toLowerCase().includes(locationFilter.toLowerCase())
    ) || [], [availableLocations, locationFilter]);

    // Fermer les suggestions si on clique en dehors
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [locationFilter, propertyType, maxPrice, bedrooms, minArea, amenities, sortBy]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);
    
    const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, checked } = e.target; setAmenities(prev => ({ ...prev, [name]: checked })); };
    
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const value = e.target.value; 
        setLocationFilter(value);
        setShowSuggestions(true);
        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if(value) newParams.set('location', value); else newParams.delete('location');
        setSearchParams(newParams);
    };

    const selectLocation = (city: string) => {
        setLocationFilter(city);
        setShowSuggestions(false);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('location', city);
        setSearchParams(newParams);
    };

    const filteredProperties = useMemo(() => {
        let results = properties.filter(p => {
            // Correspondance floue pour la recherche via la barre de recherche globale, ou exacte si sélection liste
            const matchesSearch = locationFilter === '' || p.location.toLowerCase().includes(locationFilter.toLowerCase());
            const matchesType = propertyType === 'all' || p.type === propertyType;
            const matchesPrice = maxPrice === '' || p.price <= Number(maxPrice);
            const matchesBedrooms = (() => { if (bedrooms === 'all') return true; const minBeds = parseInt(bedrooms); if (bedrooms.endsWith('+')) { return p.bedrooms >= minBeds; } return p.bedrooms === minBeds; })();
            const matchesArea = minArea === '' || p.area >= Number(minArea);
            const propertyCharacteristics = [ ...(p.characteristics?.exterior || []), ...(p.characteristics?.interior || []), ...(p.characteristics?.equipment || []), ...(p.characteristics?.land || []), ...(p.characteristics?.general || []), ].join(' ').toLowerCase();
            const matchesPool = !amenities.pool || propertyCharacteristics.includes('piscine');
            const matchesGarden = !amenities.garden || propertyCharacteristics.includes('jardin');
            const matchesGarage = !amenities.garage || propertyCharacteristics.includes('garage') || propertyCharacteristics.includes('parking');
            const matchesTerrace = !amenities.terrace || propertyCharacteristics.includes('terrasse') || propertyCharacteristics.includes('balcon');
            const matchesCellar = !amenities.cellar || propertyCharacteristics.includes('cave');
            return matchesSearch && matchesType && matchesPrice && matchesBedrooms && matchesArea && matchesPool && matchesGarden && matchesGarage && matchesTerrace && matchesCellar;
        });
        switch (sortBy) {
            case 'price_asc': return results.sort((a, b) => a.price - b.price);
            case 'price_desc': return results.sort((a, b) => b.price - a.price);
            case 'date_desc': default: return results.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        }
    }, [properties, locationFilter, propertyType, maxPrice, bedrooms, minArea, amenities, sortBy]);

    // Pagination calculations
    const totalItems = filteredProperties.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const displayedProperties = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProperties, currentPage]);
    
    const getCriteriaSummary = () => { 
        const parts = []; 
        if (propertyType !== 'all') parts.push(propertyType); 
        if (locationFilter) parts.push(`à ${locationFilter}`); 
        if (maxPrice) parts.push(`Budget max: ${maxPrice}€`); 
        if (minArea) parts.push(`Surface min: ${minArea}m²`); 
        if (bedrooms !== 'all') parts.push(`${bedrooms.replace('+', ' et plus')} ch.`); 
        Object.entries(amenities).filter(([, val]) => val).forEach(([key]) => parts.push(key)); 
        return parts.join(', '); 
    };

    const handleSaveAlert = async (email: string) => { 
        const summary = getCriteriaSummary();
        const alertData = {
            email: email,
            message: `Nouvelle alerte recherche créée par un utilisateur.\n\nCritères :\n${summary || "Aucun critère spécifique (tout le catalogue)"}\n\nEmail du prospect : ${email}`,
            _subject: `Nouvelle Alerte Recherche : ${propertyType === 'all' ? 'Bien immobilier' : propertyType} ${locationFilter ? `à ${locationFilter}` : ''}`
        };

        try {
            const response = await fetch('https://formspree.io/f/xqagvbqp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(alertData)
            });

            if (response.ok) {
                alert(`Demande d'alerte bien reçue ! Nous vous recontacterons si un bien correspondant rentre en catalogue.`); 
                setIsAlertModalOpen(false);
                return true;
            } else {
                alert("Une erreur est survenue lors de l'envoi de votre alerte.");
                return false;
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion. Veuillez réessayer.");
            return false;
        }
    };

    const inputGroupClass = "relative flex items-center w-full";
    const iconClass = "absolute left-3 w-5 h-5 text-secondary pointer-events-none z-10";
    const inputClass = "w-full pl-10 pr-3 py-3 text-primary-text bg-background-alt border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-colors appearance-none";

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        let pageNumbers: (number | string)[] = [];
        
        if (totalPages <= 7) {
             pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
             if (currentPage <= 4) {
                 pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
             } else if (currentPage >= totalPages - 3) {
                 pageNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
             } else {
                 pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
             }
        }

        return (
            <div className="mt-16 flex justify-center items-center space-x-2 print:hidden">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-border-color rounded-lg text-primary-text hover:bg-background-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page précédente"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                
                {pageNumbers.map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-accent border-accent text-white shadow-md'
                                    : 'border-border-color text-primary-text hover:bg-background-alt hover:border-accent'
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2 text-secondary-text font-medium">...</span>
                    )
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-border-color rounded-lg text-primary-text hover:bg-background-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page suivante"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <div className="bg-background min-h-screen">
            <AlertModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} onSave={handleSaveAlert} criteriaSummary={getCriteriaSummary()} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                
                {/* Fil d'Ariane dynamique */}
                 <nav className="flex flex-wrap mb-8 text-sm text-secondary-text" aria-label="Fil d'ariane">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <Link to="/" className="hover:text-accent transition-colors flex items-center">
                                <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                </svg>
                                Accueil
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                            <Link to="/properties" className={`hover:text-accent transition-colors ml-1 ${!locationFilter && propertyType === 'all' ? 'font-medium text-primary-text' : ''}`}>Nos Biens</Link>
                        </li>
                        {locationFilter && (
                             <li className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                <span className={`ml-1 ${propertyType === 'all' ? 'font-medium text-primary-text' : ''}`}>{locationFilter}</span>
                            </li>
                        )}
                        {propertyType !== 'all' && (
                             <li className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                <span className="ml-1 font-medium text-primary-text">{propertyType}</span>
                            </li>
                        )}
                    </ol>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">Nos Biens Immobiliers à Vendre</h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">Trouvez la propriété qui correspond parfaitement à vos attentes dans le Vaucluse Nord.</p>
                     <Link to="/nos-biens-vendus" className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-dark transition-colors"> Voir nos biens récemment vendus &rarr; </Link>
                </div>
                
                {/* Modification ici : ajout de z-30 et relative pour gérer le z-index du dropdown */}
                <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl mb-12 border border-border-color/50 relative z-30">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="relative" ref={wrapperRef}>
                            <label htmlFor="search" className="block text-sm font-medium text-primary-text mb-1">Ville / Localisation</label>
                            <div className={inputGroupClass}>
                                <LocationIcon className={iconClass} />
                                <input 
                                    type="text"
                                    id="search" 
                                    name="search" 
                                    className={inputClass} 
                                    value={locationFilter} 
                                    onChange={handleLocationChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Ville (ex: Orange)"
                                    autoComplete="off"
                                />
                            </div>
                            {/* Liste de suggestions personnalisée */}
                            {showSuggestions && filteredLocations.length > 0 && (
                                <ul className="absolute z-[100] left-0 right-0 mt-1 bg-white border border-border-color rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {filteredLocations.map((city) => (
                                        <li 
                                            key={city}
                                            onClick={() => selectLocation(city)}
                                            className="px-4 py-2 hover:bg-background-alt cursor-pointer text-sm text-primary-text transition-colors flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div> <label htmlFor="property-type" className="block text-sm font-medium text-primary-text mb-1">Type de bien</label> <div className={inputGroupClass}> <PropertyTypeIcon className={iconClass} /> <select id="property-type" name="property-type" value={propertyType} onChange={e => setPropertyType(e.target.value)} className={inputClass}><option value="all">Tous</option><option value="Maison">Maison</option><option value="Appartement">Appartement</option><option value="Terrain">Terrain</option><option value="Autre">Autre</option></select> </div> </div>
                         <div> <label htmlFor="price" className="block text-sm font-medium text-primary-text mb-1">Budget Max.</label> <div className={inputGroupClass}> <PriceIcon className={iconClass} /> <input type="number" name="price" id="price" placeholder="ex: 500000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={inputClass} /> </div> </div>
                        <div> <button onClick={() => setShowMoreFilters(!showMoreFilters)} className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-primary-text bg-background-alt hover:bg-border-color focus:outline-none focus:ring-2 focus:ring-accent transition-colors"> {showMoreFilters ? 'Moins de filtres' : 'Plus de filtres'} <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 transform transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> </button> </div>
                    </div>
                    {showMoreFilters && (
                         <div className="mt-6 pt-6 border-t border-border-color">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                <div> <label htmlFor="bedrooms" className="block text-sm font-medium text-primary-text mb-1">Chambres</label> <div className={inputGroupClass}> <BedroomsIcon className={iconClass}/> <select id="bedrooms" name="bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className={inputClass}><option value="all">Toutes</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4+">4 et plus</option></select> </div> </div>
                                <div> <label htmlFor="minArea" className="block text-sm font-medium text-primary-text mb-1">Surface min. (m²)</label> <div className={inputGroupClass}> <AreaIcon className={iconClass}/> <input type="number" name="minArea" id="minArea" placeholder="ex: 100" value={minArea} onChange={e => setMinArea(e.target.value)} className={inputClass} /> </div> </div>
                                <div className="lg:col-span-2 md:pt-7"> <label className="block text-sm font-medium text-primary-text mb-2">Équipements</label> <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2"> <CustomCheckbox id="pool" name="pool" label="Piscine" checked={amenities.pool} onChange={handleAmenityChange} /> <CustomCheckbox id="garden" name="garden" label="Jardin" checked={amenities.garden} onChange={handleAmenityChange} /> <CustomCheckbox id="garage" name="garage" label="Garage / Parking" checked={amenities.garage} onChange={handleAmenityChange} /> <CustomCheckbox id="terrace" name="terrace" label="Terrasse / Balcon" checked={amenities.terrace} onChange={handleAmenityChange} /> <CustomCheckbox id="cellar" name="cellar" label="Cave" checked={amenities.cellar} onChange={handleAmenityChange} /> </div> </div>
                             </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <p className="text-secondary-text font-medium">
                        {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button onClick={() => setIsAlertModalOpen(true)} className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center px-4 py-2 border border-accent text-sm font-medium rounded-lg text-accent bg-white hover:bg-accent/10 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> Créer une alerte </button>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium rounded-lg text-primary-text bg-white border border-border-color focus:ring-1 focus:ring-accent focus:border-accent"> <option value="date_desc">Trier par : Plus récent</option> <option value="price_asc">Trier par : Prix croissant</option> <option value="price_desc">Trier par : Prix décroissant</option> </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-16">Chargement des biens...</div>
                ) : filteredProperties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedProperties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                        {renderPagination()}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-primary-text">Aucun bien ne correspond à vos critères</h2>
                        <p className="mt-2 text-secondary-text">Essayez d'élargir votre recherche ou créez une alerte pour être notifié des nouveautés.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertiesListPage;