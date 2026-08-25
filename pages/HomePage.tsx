
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Properties from '../components/Properties';
import ContactForm from '../components/ContactForm';
import Estimation from '../components/Estimation';
import Portals from '../components/Portals';
import ReviewsSection from '../components/ReviewsSection';
import { homePageSettingsService } from '../services/homePageSettingsService';
import { propertyService } from '../services/propertyService';
import { slugifyCity } from '../utils/cityHelper';

const Zones: React.FC<{ title: string, subtitle: string, zones: string }> = ({ title, subtitle, zones }) => {
    const zonesList = zones?.split('\n').map(z => z.trim()).filter(Boolean) || [];
    return (
        <section id="zones" className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">{title}</h2>
                    <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">{subtitle}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {zonesList.map(zone => (
                        <Link 
                            key={zone} 
                            to={`/immobilier-${slugifyCity(zone)}`}
                            className="px-5 py-2 bg-background-alt border border-border-color rounded-full text-primary-text font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors shadow-xs"
                        >
                            Immobilier {zone}
                        </Link>
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

  const homeMetaTitle = content.metaTitle || "Duroche Immobilier | Agence Immobilière Orange & Vaucluse Nord";
  const homeMetaDescription = content.metaDescription || "Expert de l'immobilier dans le Vaucluse Nord. Achat, vente, estimation offerte. Découvrez nos maisons et appartements à Orange, Caderousse, Piolenc et environs.";

  return (
    <>
      <Helmet>
        <title>{homeMetaTitle}</title>
        <meta name="description" content={homeMetaDescription} />
        <link rel="canonical" href="https://www.duroche.fr" />
        <meta property="og:title" content={homeMetaTitle} />
        <meta property="og:description" content={homeMetaDescription} />
        <meta property="og:url" content="https://www.duroche.fr" />
        <meta property="og:type" content="website" />
      </Helmet>
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
      <ReviewsSection />
      <Portals />
      <ContactForm 
        title={content.contactTitle}
        subtitle={content.contactSubtitle}
      />
    </>
  );
};

export default HomePage;