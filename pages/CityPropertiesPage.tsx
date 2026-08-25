import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { propertyService } from '../services/propertyService';
import { cityGuideService } from '../services/cityGuideService';
import PropertyCard from '../components/PropertyCard';
import CityGuideSection from '../components/CityGuideSection';
import { slugifyCity, getCityDisplayName, propertyMatchesCity, KNOWN_CITIES } from '../utils/cityHelper';
import type { Property, CityGuide } from '../types';

// --- ICONS ---
const PropertyTypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const PriceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const BedroomsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const AlertModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (email: string) => Promise<boolean>; criteriaSummary: string; cityName: string; }> = ({
  isOpen,
  onClose,
  onSave,
  criteriaSummary,
  cityName
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSave(email);
    setIsSubmitting(false);
    if (success) {
      setEmail('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-primary-text">Créer une alerte à {cityName}</h2>
            <p className="text-xs text-secondary-text">Soyez averti dès qu'un bien correspondant arrive sur le marché.</p>
          </div>
        </div>

        <div className="bg-background-alt p-3.5 rounded-xl text-xs text-secondary-text mb-5 border border-border-color/60">
          <strong className="text-primary-text">Critères :</strong> {criteriaSummary || `Tous les biens à ${cityName}`}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="alert-city-email" className="block text-xs font-semibold text-primary-text uppercase tracking-wider mb-1.5">
              Votre adresse e-mail
            </label>
            <input
              id="alert-city-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="exemple@email.com"
              className="py-2.5 px-3.5 block w-full bg-white text-sm shadow-xs border border-border-color rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-accent hover:bg-accent-dark transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : "M'avertir en priorité"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CityPropertiesPageProps {
  citySlug?: string;
}

const CityPropertiesPage: React.FC<CityPropertiesPageProps> = ({ citySlug: propCitySlug }) => {
  const { citySlug: paramCitySlug = '' } = useParams<{ citySlug: string }>();
  const rawCitySlug = propCitySlug || paramCitySlug;
  const normalizedSlug = slugifyCity(rawCitySlug);

  // 1. Récupération des guides ville Sanity
  const { data: cityGuide } = useQuery<CityGuide | null>({
    queryKey: ['cityGuide', normalizedSlug],
    queryFn: () => cityGuideService.getByCityName(normalizedSlug),
  });

  // Nom d'affichage propre
  const cityName = useMemo(() => {
    return getCityDisplayName(normalizedSlug, cityGuide);
  }, [normalizedSlug, cityGuide]);

  // Code postal
  const postalCode = useMemo(() => {
    if (cityGuide?.postalCode) return cityGuide.postalCode;
    const known = KNOWN_CITIES.find(c => c.slug === normalizedSlug);
    return known?.postalCode || '';
  }, [cityGuide, normalizedSlug]);

  // 2. Récupération des biens actifs
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['activeProperties'],
    queryFn: propertyService.getActive,
  });

  // 3. Filtres locaux
  const [propertyType, setPropertyType] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Biens filtrés strictement pour cette commune
  const cityProperties = useMemo(() => {
    return properties.filter(p => propertyMatchesCity(p.location, cityName) || propertyMatchesCity(p.location, normalizedSlug));
  }, [properties, cityName, normalizedSlug]);

  // Application des sous-filtres utilisateur
  const filteredProperties = useMemo(() => {
    let results = cityProperties.filter(p => {
      const matchesType = propertyType === 'all' || p.type === propertyType;
      const matchesPrice = maxPrice === '' || p.price <= Number(maxPrice);
      const matchesBedrooms = (() => {
        if (bedrooms === 'all') return true;
        const minBeds = parseInt(bedrooms, 10);
        if (bedrooms.endsWith('+')) return p.bedrooms >= minBeds;
        return p.bedrooms === minBeds;
      })();
      return matchesType && matchesPrice && matchesBedrooms;
    });

    switch (sortBy) {
      case 'price_asc':
        return results.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return results.sort((a, b) => b.price - a.price);
      case 'date_desc':
      default:
        return results.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
    }
  }, [cityProperties, propertyType, maxPrice, bedrooms, sortBy]);

  // Autres biens dans le Vaucluse Nord pour suggestion si aucun bien dans la ville
  const alternativeProperties = useMemo(() => {
    if (cityProperties.length > 0) return [];
    return properties.slice(0, 3);
  }, [properties, cityProperties]);

  const handleSaveAlert = async (email: string) => {
    const summary = `Recherche à ${cityName} ${postalCode ? `(${postalCode})` : ''} - Type: ${propertyType !== 'all' ? propertyType : 'Tous'} ${maxPrice ? `- Budget max: ${maxPrice}€` : ''}`;
    const alertData = {
      email,
      message: `Alerte spécifique Ville : ${cityName}\n\nCritères :\n${summary}\n\nEmail du contact : ${email}`,
      _subject: `Alerte recherche ciblée : ${cityName} (${postalCode || 'Vaucluse'})`,
    };

    try {
      const response = await fetch('https://formspree.io/f/xqagvbqp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        alert(`Votre alerte pour ${cityName} a été enregistrée avec succès. Vous serez notifié dès qu'un bien sera disponible.`);
        setIsAlertModalOpen(false);
        return true;
      }
      alert("Une erreur est survenue lors de l'enregistrement de l'alerte.");
      return false;
    } catch (error) {
      console.error(error);
      alert('Erreur réseau. Merci de réessayer ultérieurement.');
      return false;
    }
  };

  // SEO & Métadonnées
  const canonicalUrl = `https://www.duroche.fr/immobilier-${normalizedSlug}`;
  const pageTitle = cityGuide?.metaTitle || `Immobilier ${cityName} ${postalCode ? `(${postalCode})` : ''} : Vente, Achat & Estimation | Duroche`;
  const pageDescription = cityGuide?.metaDescription || `Découvrez nos annonces immobilières à ${cityName} (${postalCode || 'Vaucluse'}) : maisons, villas, appartements à vendre et estimation offerte avec Duroche Immobilier.`;

  // Schema.org Structured Data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://www.duroche.fr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nos Biens',
        item: 'https://www.duroche.fr/properties',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Immobilier ${cityName}`,
        item: canonicalUrl,
      },
    ],
  };

  const itemListSchema = cityProperties.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Biens immobiliers à vendre à ${cityName}`,
    numberOfItems: cityProperties.length,
    itemListElement: cityProperties.map((prop, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: `${prop.type} à ${cityName}`,
      url: `https://www.duroche.fr/properties/${prop.reference || prop._id}`,
    })),
  } : null;

  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {itemListSchema && <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>}
      </Helmet>

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSave={handleSaveAlert}
        criteriaSummary={`Immobilier à ${cityName} ${postalCode ? `(${postalCode})` : ''} - Type: ${propertyType}`}
        cityName={cityName}
      />

      {/* Hero / Header de la page Ville */}
      <div className="bg-gradient-to-b from-white to-background border-b border-border-color/60 pt-28 pb-10 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Fil d'Ariane / Breadcrumbs */}
          <nav aria-label="Fil d'ariane" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link to="/properties" className="hover:text-accent transition-colors">Nos Biens</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-primary-text font-semibold truncate" aria-current="page">
                Immobilier {cityName}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Secteur Vaucluse Nord {postalCode ? `• ${postalCode}` : ''}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-primary-text tracking-tight">
                Immobilier à {cityName}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-secondary-text max-w-2xl font-light">
                {cityProperties.length > 0
                  ? `Découvrez nos ${cityProperties.length} ${cityProperties.length > 1 ? 'biens immobiliers disponibles' : 'bien immobilier disponible'} à la vente à ${cityName}.`
                  : `Consultez les opportunités immobilières et notre guide d'expertise locale pour ${cityName}.`}
              </p>
            </div>

            {/* Boutons d'actions rapides */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border-color hover:border-accent text-primary-text font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Créer une alerte {cityName}
              </button>
              <Link
                to="/estimation"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                Estimer un bien à {cityName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres & tri */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-border-color/60 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type */}
            <div>
              <label htmlFor="city-type-filter" className="block text-xs font-semibold text-secondary-text uppercase mb-1.5">
                Type de bien
              </label>
              <div className="relative">
                <PropertyTypeIcon className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="city-type-filter"
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background-alt border border-border-color rounded-xl focus:ring-2 focus:ring-accent focus:bg-white transition-colors"
                >
                  <option value="all">Tous types</option>
                  <option value="Maison">Maison</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Terrain">Terrain</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Budget Max */}
            <div>
              <label htmlFor="city-price-filter" className="block text-xs font-semibold text-secondary-text uppercase mb-1.5">
                Budget maximum
              </label>
              <div className="relative">
                <PriceIcon className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="city-price-filter"
                  type="number"
                  placeholder="Budget max (€)"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background-alt border border-border-color rounded-xl focus:ring-2 focus:ring-accent focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Chambres */}
            <div>
              <label htmlFor="city-bedrooms-filter" className="block text-xs font-semibold text-secondary-text uppercase mb-1.5">
                Chambres
              </label>
              <div className="relative">
                <BedroomsIcon className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="city-bedrooms-filter"
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background-alt border border-border-color rounded-xl focus:ring-2 focus:ring-accent focus:bg-white transition-colors"
                >
                  <option value="all">Toutes chambres</option>
                  <option value="1">1 chambre</option>
                  <option value="2">2 chambres</option>
                  <option value="3">3 chambres</option>
                  <option value="4+">4 chambres et +</option>
                </select>
              </div>
            </div>

            {/* Tri */}
            <div>
              <label htmlFor="city-sort-filter" className="block text-xs font-semibold text-secondary-text uppercase mb-1.5">
                Trier par
              </label>
              <select
                id="city-sort-filter"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background-alt border border-border-color rounded-xl focus:ring-2 focus:ring-accent focus:bg-white transition-colors"
              >
                <option value="date_desc">Nouveautés d'abord</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des biens de la commune */}
        {propertiesLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-primary-text">
                Annonces immobilières à {cityName} ({filteredProperties.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Box d'information quand 0 bien */}
            <div className="bg-white rounded-2xl border border-border-color/80 p-8 sm:p-10 text-center shadow-xs">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary-text mb-2">
                Aucun bien actuellement en vitrine à {cityName}
              </h2>
              <p className="text-secondary-text max-w-xl mx-auto text-sm sm:text-base mb-6 leading-relaxed">
                Les biens sur cette commune sont très prisés et trouvent régulièrement acquéreur en exclusivité ou via notre réseau d'acheteurs enregistrés.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
                >
                  Être alerté des nouveaux biens à {cityName}
                </button>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-background-alt hover:bg-gray-200 text-primary-text font-semibold rounded-xl text-sm transition-colors"
                >
                  Nous confier votre recherche
                </Link>
              </div>
            </div>

            {/* Suggestions de biens voisins dans le secteur */}
            {alternativeProperties.length > 0 && (
              <div>
                <h3 className="text-lg font-bold font-heading text-primary-text mb-4">
                  Découvrez également nos biens dans les communes voisines (Vaucluse Nord)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {alternativeProperties.map(property => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section Guide Local & SEO / GEO enrichi pour la commune */}
        <CityGuideSection
          cityName={cityName}
          activePropertiesCount={filteredProperties.length}
          onOpenAlertModal={() => setIsAlertModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default CityPropertiesPage;
