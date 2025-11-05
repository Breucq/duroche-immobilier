import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertiesListPage from './pages/PropertiesListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ContactPage from './pages/ContactPage';
import { settingsService } from './services/settingsService';
import { pageService } from './services/pageService';
import { propertyService } from './services/propertyService';
import BlogListPage from './pages/BlogListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import PropertyCard from './components/PropertyCard';
import EstimationPage from './pages/EstimationPage';
import GenericPage from './pages/GenericPage';
import type { SiteSettings, Page, Property } from './types';


/**
 * Met à jour la balise script pour les données structurées JSON-LD dans le head du document.
 * @param {object | null} data - L'objet de données structurées à injecter, ou null pour vider.
 */
const updateStructuredData = (data: object | null) => {
    const script = document.getElementById('structured-data');
    if (script) {
        script.innerHTML = data ? JSON.stringify(data, null, 2) : '';
    }
};

const FavoritesPage: React.FC<{
    favoriteIds: string[];
    setCurrentPage: (page: string) => void;
    toggleFavorite: (id: string) => void;
}> = ({ favoriteIds, setCurrentPage, toggleFavorite }) => {
    const [favoritedProperties, setFavoritedProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (favoriteIds.length > 0) {
                const properties = await propertyService.getByIds(favoriteIds);
                setFavoritedProperties(properties.filter(p => !p.isHidden));
            } else {
                setFavoritedProperties([]);
            }
            setIsLoading(false);
        };
        fetchFavorites();
    }, [favoriteIds]);

    if (isLoading) {
        return <div className="text-center py-48">Chargement des favoris...</div>;
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">
                        Mes Biens Favoris
                    </h1>
                    {favoritedProperties.length === 0 && (
                        <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                            Vous n'avez pas encore de favoris. Cliquez sur le cœur sur un bien pour l'ajouter.
                        </p>
                    )}
                </div>
                
                {favoritedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoritedProperties.map((property) => (
                            <PropertyCard key={property._id} property={property} setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-8">
                         <button onClick={() => setCurrentPage('/properties')} className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                            Voir tous les biens
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SoldPropertiesListPage: React.FC<{
    setCurrentPage: (page: string) => void;
    favoriteIds: string[];
    toggleFavorite: (id: string) => void;
}> = ({ setCurrentPage, favoriteIds, toggleFavorite }) => {
    const [soldProperties, setSoldProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSold = async () => {
            const properties = await propertyService.getSold();
            setSoldProperties(properties);
            setIsLoading(false);
        };
        fetchSold();
    }, []);

    if (isLoading) {
        return <div className="text-center py-48">Chargement des biens vendus...</div>;
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">
                        Nos Références - Biens Vendus
                    </h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                        Découvrez une sélection de biens que nous avons récemment vendus, témoignant de notre expertise et de la confiance de nos clients.
                    </p>
                    <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('/properties'); }} className="mt-8 inline-block text-base font-medium text-accent hover:text-accent-dark">
                        &larr; Voir les biens à la vente
                    </a>
                </div>
                
                {soldProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {soldProperties.map((property) => (
                            <PropertyCard key={property._id} property={property} setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-lg text-secondary-text">Aucun bien vendu à afficher pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currentPage, setCurrentPageInternal] = useState(window.location.pathname);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [dynamicPages, setDynamicPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPageInternal(window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const setCurrentPage = (path: string) => {
        if (window.location.pathname !== path) {
            window.history.pushState({ path }, '', path);
        }
        setCurrentPageInternal(path);
        window.scrollTo(0, 0);
    };

    const FAVORITES_STORAGE_KEY = 'duroche_favorites';
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
        try { const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY); return storedFavorites ? JSON.parse(storedFavorites) : []; } 
        catch (error) { console.error("Error reading favorites from localStorage", error); return []; }
    });
    useEffect(() => {
        try { localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds)); } 
        catch (error) { console.error("Error saving favorites to localStorage", error); }
    }, [favoriteIds]);
    const toggleFavorite = (id: string) => {
        setFavoriteIds(prevIds => prevIds.includes(id) ? prevIds.filter(favId => favId !== id) : [...prevIds, id]);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [siteSettings, pages] = await Promise.all([
                    settingsService.getSettings(),
                    pageService.getAll()
                ]);
                setSettings(siteSettings);
                setDynamicPages(pages);

                let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
                if (!favicon) {
                    favicon = document.createElement('link');
                    favicon.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(favicon);
                }
                favicon.href = siteSettings.favicon || '/favicon.ico';
            } catch (error) {
                console.error("Failed to fetch initial settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);
    
    useEffect(() => {
        if (currentPage.startsWith('/#')) {
             const id = currentPage.substring(2);
             setTimeout(() => {
                const element = document.getElementById(id);
                if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
             }, 100);
        }
    }, [currentPage]);
    
    const path = currentPage;

    useEffect(() => {
        if (isLoading || !settings) return;

        const metaDescription = document.getElementById('meta-description') as HTMLMetaElement;
        const metaKeywords = document.getElementById('meta-keywords') as HTMLMetaElement;
        if (!metaDescription || !metaKeywords) return;
        
        let title = settings.title;
        let description = settings.description;
        let keywords = 'immobilier vaucluse, conseiller immobilier orange, maison à vendre caderousse, appartement jonquières, terrain piolenc, duroche immobilier';

        const getSlugFromPath = (currentPath: string): string | undefined => {
            const parts = currentPath.split('/');
            return parts[2] ? parts[2] : undefined;
        }

        const slug = getSlugFromPath(path);
        
        const pageSlug = path.substring(1).split('?')[0];
        const dynamicPage = dynamicPages.find(p => p.slug.current === pageSlug);

        if (dynamicPage) {
            title = dynamicPage.metaTitle || `${dynamicPage.title} | ${settings.title}`;
            description = dynamicPage.metaDescription || description;
            keywords = dynamicPage.metaKeywords || keywords;
            updateStructuredData(null);
        } else if (path.startsWith('/properties/') && slug) {
            // SEO for properties is now handled async on the detail page itself
        } else if (path.startsWith('/blog/') && slug) {
            // SEO for articles is now handled async on the detail page itself
        } else if (path.startsWith('/properties')) {
            title = `Nos Biens Immobiliers à Vendre - Vaucluse Nord | ${settings.title}`;
            description = 'Parcourez tous nos biens immobiliers à vendre : maisons, appartements, terrains à Orange, Caderousse, Piolenc et tout le Vaucluse Nord. Trouvez votre futur chez-vous.';
            keywords = 'biens à vendre vaucluse, acheter maison orange, liste immobilier caderousse, annonces immobilières piolenc';
            updateStructuredData(null);
        } else if (path === '/blog') {
            title = `Blog Immobilier - Conseils et Actualités | ${settings.title}`;
            description = 'Suivez les actualités et nos conseils sur le marché immobilier du Vaucluse Nord. Tendances, astuces pour vendre ou acheter à Orange, Caderousse, et environs.';
            keywords = 'blog immobilier vaucluse, actualités immobilières orange, conseils vente maison caderousse';
            updateStructuredData(null);
        } else if (path === '/estimation') {
            title = `Estimer Votre Bien Immobilier - Vaucluse | ${settings.title}`;
            description = 'Obtenez une estimation gratuite et personnalisée de votre maison ou appartement à Orange, Caderousse et environs. Remplissez notre formulaire pour une évaluation par nos experts locaux.';
            keywords = 'estimation immobilière vaucluse, estimer maison orange, prix immobilier caderousse, évaluation bien immobilier';
            updateStructuredData(null);
        } else if (path === '/nos-biens-vendus') {
            title = `Nos Biens Vendus - Références | ${settings.title}`;
            description = 'Consultez notre galerie de biens vendus à Orange, Caderousse et dans le Vaucluse. La preuve de notre efficacité et de la satisfaction de nos clients vendeurs et acheteurs.';
            keywords = 'biens vendus vaucluse, référence immobilière orange, maison vendue caderousse, conseiller immobilier efficace';
            updateStructuredData(null);
        } else if (path.startsWith('/contact')) {
            title = `Contactez-nous | ${settings.title}`;
            description = `Contactez ${settings.title} pour votre projet immobilier à Orange et dans le Vaucluse Nord. Rendez-nous visite, appelez-nous ou envoyez un message.`;
            keywords = 'contacter conseiller immobilier orange, adresse duroche immobilier, téléphone immobilier vaucluse';
            updateStructuredData({ "@context": "https://schema.org", "@type": "RealEstateAgent", "name": settings.title, "description": settings.description, "url": "https://duroche.fr", "logo": settings.logo, "address": { "@type": "PostalAddress", "streetAddress": "123 Rue de la République", "addressLocality": "Orange", "postalCode": "84100", "addressRegion": "Vaucluse", "addressCountry": "FR" }, "telephone": "+33600000000", "email": "contact@duroche.fr" });
        } else { // Page d'accueil
             updateStructuredData({ "@context": "https://schema.org", "@type": "RealEstateAgent", "name": settings.title, "description": settings.description, "url": "https://duroche.fr", "logo": settings.logo, "address": { "@type": "PostalAddress", "streetAddress": "123 Rue de la République", "addressLocality": "Orange", "postalCode": "84100", "addressRegion": "Vaucluse", "addressCountry": "FR" }, "telephone": "+33600000000", "email": "contact@duroche.fr", "areaServed": { "@type": "AdministrativeArea", "name": "Vaucluse Nord", "containedInPlace": { "@type": "State", "name": "Vaucluse" } } });
        }

        document.title = title;
        metaDescription.content = description;
        metaKeywords.content = keywords;
    }, [path, settings, isLoading, dynamicPages]);

    const renderPage = () => {
        const pageSlug = path.substring(1).split('?')[0];
        const dynamicPage = dynamicPages.find(p => p.slug.current === pageSlug);

        if (dynamicPage) return <GenericPage page={dynamicPage} />;
        if (path.startsWith('/properties/')) return <PropertyDetailPage key={path.split('/')[2]} path={path} setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />;
        if (path.startsWith('/properties')) return <PropertiesListPage setCurrentPage={setCurrentPage} path={path} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />;
        if (path.startsWith('/blog/')) return <ArticleDetailPage key={path.split('/')[2]} path={path} setCurrentPage={setCurrentPage} />;
        if (path === '/blog') return <BlogListPage setCurrentPage={setCurrentPage} />;
        if (path.startsWith('/contact/')) return <ContactPage reference={path.split('/')[2]} />;
        
        switch (path) {
            case '/': return <HomePage setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />;
            case '/estimation': return <EstimationPage />;
            case '/contact': return <ContactPage />;
            case '/favorites': return <FavoritesPage favoriteIds={favoriteIds} setCurrentPage={setCurrentPage} toggleFavorite={toggleFavorite} />;
            case '/nos-biens-vendus': return <SoldPropertiesListPage setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />;
            default:
                 if (path.startsWith('/#')) return <HomePage setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />;
                return <HomePage setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />;
        }
    };

    if (isLoading) {
        return <div className="bg-background min-h-screen flex items-center justify-center text-center py-48">Chargement du site...</div>;
    }

    if (settings?.maintenanceMode) {
        return (
            <div className="bg-background min-h-screen flex flex-col items-center justify-center text-center p-4 font-sans">
                {settings?.logo && <img src={settings.logo} alt={settings.title} className="h-16 max-w-[250px] object-contain mb-8" />}
                <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl mb-4">Site en maintenance</h1>
                <p className="text-lg text-secondary-text max-w-xl mx-auto">
                    Nous effectuons actuellement des mises à jour pour améliorer votre expérience.
                    <br/>
                    Le site sera de retour très prochainement. Merci de votre patience.
                </p>
            </div>
        );
    }
    
    return (
        <div className="font-sans text-primary-text">
            {settings && <Header setCurrentPage={setCurrentPage} favoriteIds={favoriteIds} settings={settings} dynamicPages={dynamicPages} />}
            <main>{renderPage()}</main>
            {settings && <Footer setCurrentPage={setCurrentPage} settings={settings} dynamicPages={dynamicPages} />}
        </div>
    );
};

export default App;