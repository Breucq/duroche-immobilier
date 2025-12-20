import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';

interface SearchBarProps {
  setCurrentPage: (page: string) => void;
}

/**
 * Barre de recherche de biens immobiliers.
 * Permet de filtrer par type de bien et par localisation (champ libre avec autocomplétion stylisée).
 */
const SearchBar: React.FC<SearchBarProps> = ({ setCurrentPage }) => {
  const [type, setType] = useState('all');
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Récupération dynamique des villes disponibles pour l'autocomplétion
  const { data: availableLocations } = useQuery({
      queryKey: ['availableLocations'],
      queryFn: propertyService.getUniqueLocations
  });

  // Filtrer les suggestions en fonction de la saisie
  const filteredLocations = availableLocations?.filter(city => 
    city.toLowerCase().includes(location.toLowerCase())
  ) || [];

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setShowSuggestions(true);
  };

  const selectLocation = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (location) params.append('location', location);

    const queryString = params.toString();
    setCurrentPage(`/properties${queryString ? `?${queryString}` : ''}`);
    setShowSuggestions(false);
  };
  
  const inputGroupClass = "relative flex items-center w-full";
  const iconClass = "absolute left-3 w-5 h-5 text-secondary pointer-events-none z-10";
  const inputClass = "w-full pl-10 pr-3 py-2 text-primary-text bg-background-alt/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-colors appearance-none";

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        
        <div>
          <label htmlFor="property-type" className="sr-only">Type de bien</label>
          <div className={inputGroupClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <select id="property-type" name="property-type" className={inputClass} value={type} onChange={e => setType(e.target.value)}>
              <option value="all">Tous les types</option>
              <option value="Maison">Maison</option>
              <option value="Appartement">Appartement</option>
              <option value="Terrain">Terrain</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
        
        <div className="relative" ref={wrapperRef}>
          <label htmlFor="location" className="sr-only">Localisation</label>
          <div className={inputGroupClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input 
                type="text"
                id="location" 
                name="location" 
                className={inputClass} 
                value={location} 
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="sm:col-span-2 lg:col-span-1">
            <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors">
                Rechercher
            </button>
        </div>
        
      </form>
    </div>
  );
};

export default SearchBar;