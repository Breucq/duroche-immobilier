import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Properties from '../components/Properties';
import ContactForm from '../components/ContactForm';
import Estimation from '../components/Estimation';
import { homePageSettingsService } from '../services/homePageSettingsService';
import { propertyService } from '../services/propertyService';
import type { HomePageSettings, Property } from '../types';

const Zones: React.FC<{ setCurrentPage: (page: string) => void, title: string, subtitle: string, zones: string }> = ({ setCurrentPage, title, subtitle, zones }) => {
    const zonesList = zones?.split('\n').map(z => z.trim()).filter(Boolean) || [];
    const handleZoneClick = (e: React.MouseEvent<HTMLAnchorElement>, city: string) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('location', city);
        setCurrentPage(`/properties?${params.toString()}`);
    };
    return (
        <section id="zones" className="py-24 bg-background-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">{title}</h2>
                    <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">{subtitle}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {zonesList.map(zone => (
                        <a key={zone} href="#" onClick={(e) => handleZoneClick(e, zone)} className="px-5 py-2 bg-white border border-border-color rounded-full text-primary-text font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors shadow-sm">
                            {zone}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, favoriteIds, toggleFavorite }) => {
  const [content, setContent] = useState<HomePageSettings | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [settingsData, propertiesData] = await Promise.all([
                homePageSettingsService.getSettings(),
                propertyService.getActive()
            ]);
            setContent(settingsData);
            setProperties(propertiesData);
        } catch (error) {
            console.error("Failed to fetch home page data:", error);
        }
    };
    fetchData();
  }, []);

  if (!content) {
    return <div className="py-48 text-center">Chargement de la page d'accueil...</div>;
  }

  return (
    <>
      <Hero 
        setCurrentPage={setCurrentPage} 
        title={content.heroTitle} 
        subtitle={content.heroSubtitle} 
        buttonText={content.heroButtonText}
        heroBackgroundImage={content.heroBackgroundImage}
      />
      <Properties 
        isHomePage={true} 
        setCurrentPage={setCurrentPage} 
        favoriteIds={favoriteIds} 
        toggleFavorite={toggleFavorite} 
        title={content.propertiesTitle}
        subtitle={content.propertiesSubtitle}
        properties={properties}
      />
      <Estimation 
        setCurrentPage={setCurrentPage}
        title={content.estimationTitle}
        subtitle={content.estimationSubtitle}
        buttonText={content.estimationButtonText}
        backgroundImage={content.estimationBackgroundImage}
       />
      <Services 
        title={content.servicesTitle}
        subtitle={content.servicesSubtitle}
        services={content.services || []}
      />
      <Zones 
        setCurrentPage={setCurrentPage} 
        title={content.zonesTitle}
        subtitle={content.zonesSubtitle}
        zones={content.zones}
      />
      <ContactForm 
        title={content.contactTitle}
        subtitle={content.contactSubtitle}
      />
    </>
  );
};

export default HomePage;