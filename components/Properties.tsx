import React from 'react';
import PropertyCard from './PropertyCard';
import type { Property } from '../types';

interface PropertiesProps {
    isHomePage?: boolean;
    setCurrentPage: (page: string) => void;
    favoriteIds: string[];
    toggleFavorite: (id: string) => void;
    title?: string;
    subtitle?: string;
    properties: Property[];
}

const Properties: React.FC<PropertiesProps> = ({ isHomePage = false, setCurrentPage, favoriteIds, toggleFavorite, title, subtitle, properties }) => {
  const propertiesToShow = isHomePage ? properties.slice(0, 6) : properties;
  
  const sectionTitle = title || (isHomePage ? "Nos Biens à la Vente" : "Tous Nos Biens");
  const sectionSubtitle = subtitle || (isHomePage ? "Découvrez une sélection de nos biens d'exception disponibles dès maintenant." : "Parcourez notre catalogue complet de propriétés.");

  return (
    <section id="properties" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>
        
        {propertiesToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertiesToShow.map((property) => (
              <PropertyCard key={property._id} property={property} setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-secondary-text">Aucun bien disponible pour le moment.</p>
          </div>
        )}

        {isHomePage && properties.length > 6 && (
            <div className="text-center mt-12">
                <button 
                    onClick={() => setCurrentPage('/properties')}
                    className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                    Voir tous les biens
                </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default Properties;