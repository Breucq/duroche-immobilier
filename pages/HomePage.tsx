
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Properties from '../components/Properties';
import ContactForm from '../components/ContactForm';
import Estimation from '../components/Estimation';
import Portals from '../components/Portals';
import { homePageSettingsService } from '../services/homePageSettingsService';
import { propertyService } from '../services/propertyService';

const Zones: React.FC<{ title: string, subtitle: string, zones: string }> = ({ title, subtitle, zones }) => {
    const navigate = useNavigate();
    const zonesList = zones?.split('\n').map(z => z.trim()).filter(Boolean) || [];
    const handleZoneClick = (e: React.MouseEvent<HTMLAnchorElement>, city: string) => {
        e.preventDefault();
        navigate(`/properties?location=${encodeURIComponent(city)}`);
    };
    return (
        <section id="zones" className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">{title}</h2>
                    <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">{subtitle}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {zonesList.map(zone => (
                        <a key={zone} href="#" onClick={(e) => handleZoneClick(e, zone)} className="px-5 py-2 bg-background-alt border border-border-color rounded-full text-primary-text font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors shadow-sm">
                            Immobilier {zone}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: content } = useQuery({ queryKey: ['homePageSettings'], queryFn: homePageSettingsService.getSettings });
  const { data: properties } = useQuery({ queryKey: ['activeProperties'], queryFn: propertyService.getActive });

  // AFFICHAGE ALÉATOIRE : On mélange la liste des biens uniquement quand ils sont chargés
  const shuffledProperties = useMemo(() => {
    if (!properties) return [];
    // Algorithme de tri aléatoire (Fisher-Yates simplifié)
    return [...properties].sort(() => Math.random() - 0.5);
  }, [properties]);

  if (!content) return <div className="py-48 text-center min-h-screen">Chargement...</div>;

  return (
    <>
      <Hero 
        setCurrentPage={(path) => navigate(path)}
        title={content.heroTitle} 
        subtitle={content.heroSubtitle} 
        buttonText={content.heroButtonText}
        heroBackgroundImage={content.heroBackgroundImage}
      />
      <Properties 
        isHomePage={true} 
        setCurrentPage={(path) => navigate(path)}
        title={content.propertiesTitle}
        subtitle={content.propertiesSubtitle}
        properties={shuffledProperties}
      />
      <Estimation 
        setCurrentPage={(path) => navigate(path)}
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
        title={content.zonesTitle}
        subtitle={content.zonesSubtitle}
        zones={content.zones}
      />
      <Portals />
      <ContactForm 
        title={content.contactTitle}
        subtitle={content.contactSubtitle}
      />
    </>
  );
};

export default HomePage;