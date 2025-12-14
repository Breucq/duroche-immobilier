import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import { settingsService } from './services/settingsService';
import { pageService } from './services/pageService';
import { propertyService } from './services/propertyService';
import PropertyCard from './components/PropertyCard';
import { useFavorites } from './context/FavoritesContext';
import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';
import type { Property } from './types';

// --- Lazy Loading des pages pour optimiser le bundle initial ---
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PropertiesListPage = React.lazy(() => import('./pages/PropertiesListPage'));
const PropertyDetailPage = React.lazy(() => import('./pages/PropertyDetailPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));
const EstimationPage = React.lazy(() => import('./pages/EstimationPage'));
const SellingPage = React.lazy(() => import('./pages/SellingPage'));
const GenericPage = React.lazy(() => import('./pages/GenericPage'));

// Composant de chargement léger pour le Suspense
const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
);

const FavoritesPage: React.FC = () => {
    const { favoriteIds } = useFavorites();
    const { data: favoritedProperties, isLoading } = useQuery({
        queryKey: ['favorites', favoriteIds],
        queryFn: async () => {
             if (favoriteIds.length > 0) {
                const props = await propertyService.getByIds(favoriteIds);
                return props.filter(p => !p.isHidden);
            }
            return [];
        },
        enabled: favoriteIds.length > 0
    });

    if (isLoading) return <PageLoader />;

    return (
        <div className="bg-background min-h-screen">
            <Helmet>
                <title>Mes Favoris | Duroche Immobilier</title>
                <meta name="description" content="Retrouvez vos biens immobiliers favoris." />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">Mes Biens Favoris</h1>
                    {(!favoritedProperties || favoritedProperties.length === 0) && (
                        <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                            Vous n'avez pas encore de favoris. Cliquez sur le cœur sur un bien pour l'ajouter.
                        </p>
                    )}
                </div>
                {favoritedProperties && favoritedProperties.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoritedProperties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const SoldPropertiesListPage: React.FC = () => {
    const { data: soldProperties, isLoading } = useQuery({
        queryKey: ['soldProperties'],
        queryFn: propertyService.getSold
    });

    if (isLoading) return <PageLoader />;

    return (
        <div className="bg-background min-h-screen">
            <Helmet>
                <title>Nos Références - Biens Vendus | Duroche Immobilier</title>
                <meta name="description" content="Découvrez une sélection de biens que nous avons récemment vendus dans le Vaucluse Nord." />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">Nos Références - Biens Vendus</h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                        Découvrez une sélection de biens que nous avons récemment vendus.
                    </p>
                </div>
                {soldProperties && soldProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {soldProperties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-8"><p className="text-lg text-secondary-text">Aucun bien vendu à afficher.</p></div>
                )}
            </div>
        </div>
    );
};

const Layout: React.FC = () => {
    const { pathname } = useLocation();
    
    // Fetch global settings and dynamic pages
    const { data: settings, isLoading: settingsLoading } = useQuery({ queryKey: ['settings'], queryFn: settingsService.getSettings });
    const { data: dynamicPages, isLoading: pagesLoading } = useQuery({ queryKey: ['dynamicPages'], queryFn: pageService.getAll });

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    if (settingsLoading || pagesLoading) return <div className="bg-background min-h-screen flex items-center justify-center">Chargement...</div>;

    if (settings?.maintenanceMode) {
         return (
            <div className="bg-background min-h-screen flex flex-col items-center justify-center text-center p-4 font-sans">
                {settings?.logo && <img src={settings.logo} alt={settings.title} className="h-16 max-w-[250px] object-contain mb-8" />}
                <h1 className="text-4xl font-bold font-heading text-primary-text mb-4">Site en maintenance</h1>
                <p className="text-lg text-secondary-text">Nous revenons très vite.</p>
            </div>
        );
    }

    // Default SEO data
    const defaultTitle = settings?.title || 'Duroche Immobilier';
    // Changement ici : Remplacement de "Agence immobilière" par "Expert de l'immobilier"
    const defaultDescription = settings?.description || 'Expert de l\'immobilier dans le Vaucluse Nord.';
    const defaultKeywords = 'immobilier vaucluse, conseiller immobilier orange, maison à vendre caderousse';
    
    // Determine dynamic page SEO if applicable (for pages handled via :slug that aren't specialized routes)
    // Note: specialized pages like PropertyDetailPage handle their own SEO overriding these defaults.
    const pageSlug = pathname.substring(1).split('?')[0];
    const dynamicPage = dynamicPages?.find(p => p.slug.current === pageSlug);
    
    let title = defaultTitle;
    let description = defaultDescription;
    let keywords = defaultKeywords;
    let structuredData = null;

    if (dynamicPage) {
        title = dynamicPage.metaTitle || `${dynamicPage.title} | ${settings?.title}`;
        description = dynamicPage.metaDescription || description;
        keywords = dynamicPage.metaKeywords || keywords;
    } else if (pathname === '/') {
        structuredData = { 
            "@context": "https://schema.org", 
            "@type": "RealEstateAgent", 
            "name": settings?.title, 
            "description": settings?.description, 
            "url": "https://duroche.fr", 
            "logo": settings?.logo, 
            "telephone": "+33756874788", 
            "email": "contact@duroche.fr", 
            "areaServed": "Vaucluse Nord" 
        };
    } else if (pathname.startsWith('/properties')) {
         title = `Nos Biens | ${settings?.title}`;
         description = "Découvrez nos biens immobiliers à vendre dans le Vaucluse Nord. Maisons, appartements, terrains...";
    }

    return (
        <div className="font-sans text-primary-text flex flex-col min-h-screen">
             {/* Intégration du Tracker Google Analytics */}
             <GoogleAnalyticsTracker />

             {settings && (
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <meta name="keywords" content={keywords} />
                    {settings.favicon && <link rel="icon" href={settings.favicon} />}
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content={settings.title} />
                    <meta property="og:locale" content="fr_FR" />
                    <link rel="canonical" href={window.location.href} />
                    {structuredData && (
                        <script type="application/ld+json">
                            {JSON.stringify(structuredData)}
                        </script>
                    )}
                </Helmet>
            )}
            
            {settings && <Header settings={settings} dynamicPages={dynamicPages || []} />}
            <main className="flex-grow">
                {/* Suspense wrap for lazy loaded routes */}
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            {settings && <Footer settings={settings} dynamicPages={dynamicPages || []} />}
        </div>
    );
};

// Wrapper pour récupérer la page dynamique via le slug
const GenericPageWrapper: React.FC = () => {
    const location = useLocation();
    const slug = location.pathname.substring(1);
    const { data: page, isLoading } = useQuery({
        queryKey: ['page', slug],
        queryFn: () => pageService.getBySlug(slug),
        retry: false
    });

    if (isLoading) return <PageLoader />;
    if (!page) return <div className="py-48 text-center">Page introuvable (404)</div>;
    return <GenericPage page={page} />;
};


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="properties" element={<PropertiesListPage />} />
                {/* Utilisation de :reference au lieu de :id pour l'URL courte */}
                <Route path="properties/:reference" element={<PropertyDetailPage />} />
                <Route path="nos-biens-vendus" element={<SoldPropertiesListPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="blog" element={<BlogListPage />} />
                <Route path="blog/:slug" element={<ArticleDetailPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="contact/:reference" element={<ContactPage />} />
                <Route path="estimation" element={<EstimationPage />} />
                <Route path="vendre" element={<SellingPage />} />

                {/* Route catch-all pour les pages dynamiques */}
                <Route path=":slug" element={<GenericPageWrapper />} />
            </Route>
        </Routes>
    );
};

export default App;