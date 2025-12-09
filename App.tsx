import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertiesListPage from './pages/PropertiesListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ContactPage from './pages/ContactPage';
import BlogListPage from './pages/BlogListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import EstimationPage from './pages/EstimationPage';
import GenericPage from './pages/GenericPage';
import ImportPage from './pages/admin/ImportPage'; // Import de la page
import { settingsService } from './services/settingsService';
import { pageService } from './services/pageService';
import { propertyService } from './services/propertyService';
import PropertyCard from './components/PropertyCard';
import { useFavorites } from './context/FavoritesContext';
import type { Property } from './types';

const updateStructuredData = (data: object | null) => {
    const script = document.getElementById('structured-data');
    if (script) {
        script.innerHTML = data ? JSON.stringify(data, null, 2) : '';
    }
};

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    let element = document.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
};

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

    if (isLoading) return <div className="text-center py-48">Chargement des favoris...</div>;

    return (
        <div className="bg-background min-h-screen">
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

    if (isLoading) return <div className="text-center py-48">Chargement des biens vendus...</div>;

    return (
        <div className="bg-background min-h-screen">
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

    // SEO Management
    useEffect(() => {
        if (!settings || !dynamicPages) return;
        
        const metaKeywords = document.getElementById('meta-keywords') as HTMLMetaElement;
        
        let title = settings.title;
        let description = settings.description;
        let keywords = 'immobilier vaucluse, conseiller immobilier orange, maison à vendre caderousse';

        const pageSlug = pathname.substring(1).split('?')[0];
        const dynamicPage = dynamicPages.find(p => p.slug.current === pageSlug);

        if (dynamicPage) {
            title = dynamicPage.metaTitle || `${dynamicPage.title} | ${settings.title}`;
            description = dynamicPage.metaDescription || description;
            keywords = dynamicPage.metaKeywords || keywords;
            updateStructuredData(null);
        } else if (pathname === '/') {
             updateStructuredData({ "@context": "https://schema.org", "@type": "RealEstateAgent", "name": settings.title, "description": settings.description, "url": "https://duroche.fr", "logo": settings.logo, "telephone": "+33756874788", "email": "contact@duroche.fr", "areaServed": "Vaucluse Nord" });
        } else if (pathname.startsWith('/properties')) {
             title = `Nos Biens | ${settings.title}`;
             description = "Découvrez nos biens immobiliers à vendre dans le Vaucluse Nord.";
        }

        document.title = title;
        setMetaTag('name', 'description', description);
        if (metaKeywords) metaKeywords.content = keywords;
        
        // Favicon
        let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(favicon);
        }
        if (settings.favicon) favicon.href = settings.favicon;

    }, [pathname, settings, dynamicPages]);

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

    return (
        <div className="font-sans text-primary-text flex flex-col min-h-screen">
            {settings && <Header settings={settings} dynamicPages={dynamicPages || []} />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {settings && <Footer settings={settings} dynamicPages={dynamicPages || []} />}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="properties" element={<PropertiesListPage />} />
                <Route path="properties/:id" element={<PropertyDetailPage />} />
                <Route path="nos-biens-vendus" element={<SoldPropertiesListPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="blog" element={<BlogListPage />} />
                <Route path="blog/:slug" element={<ArticleDetailPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="contact/:reference" element={<ContactPage />} />
                <Route path="estimation" element={<EstimationPage />} />
                
                {/* Route Admin Import */}
                <Route path="admin/import" element={<ImportPage />} />

                {/* Route catch-all pour les pages dynamiques */}
                <Route path=":slug" element={<GenericPageWrapper />} />
            </Route>
        </Routes>
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

    if (isLoading) return <div className="py-48 text-center">Chargement...</div>;
    if (!page) return <div className="py-48 text-center">Page introuvable (404)</div>;
    return <GenericPage page={page} />;
};

export default App;