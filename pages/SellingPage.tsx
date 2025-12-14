import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ContactForm from '../components/ContactForm';
import Portals from '../components/Portals';

// Icônes
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const HandshakeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const BadgeCheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>);

const StepCard: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
    <div className="relative p-6 bg-white border border-border-color rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold font-heading text-xl shadow-md">
            {number}
        </div>
        <h3 className="text-xl font-bold font-heading text-primary-text mt-2 mb-3">{title}</h3>
        <p className="text-secondary-text">{description}</p>
    </div>
);

const SellingPage: React.FC = () => {
    // Données structurées FAQ pour Google (Rich Snippets)
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Combien de temps faut-il pour vendre ma maison ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dans le Vaucluse Nord, le délai moyen de vente varie selon le prix et l'état du bien. Avec une estimation au prix du marché et notre stratégie de diffusion, nous visons une offre sous 30 à 60 jours."
                }
            },
            {
                "@type": "Question",
                "name": "L'estimation de mon bien est-elle payante ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Non, chez Duroche Immobilier, l'avis de valeur est entièrement offert et sans engagement. Nous vous remettons un dossier complet basé sur les ventes récentes dans votre quartier."
                }
            },
            {
                "@type": "Question",
                "name": "Quels diagnostics sont obligatoires pour vendre ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le DPE (Diagnostic de Performance Énergétique) est obligatoire dès la mise en vente. Ensuite, selon l'année de construction et la localisation, vous devrez fournir : amiante, plomb, électricité, gaz, termites et l'ERP (État des Risques et Pollutions)."
                }
            }
        ]
    };

    return (
        <div className="bg-background min-h-screen">
            <Helmet>
                <title>Vendre votre bien immobilier à Orange et Vaucluse Nord | Duroche Immobilier</title>
                <meta name="description" content="Vous souhaitez vendre votre maison ou appartement ? Profitez de l'expertise locale Duroche Immobilier : estimation précise, photos HD, diffusion massive et vente rapide." />
                <meta name="keywords" content="vendre maison orange, vendre appartement vaucluse, estimation gratuite, agence immobilière vaucluse nord, mandat vente" />
                <link rel="canonical" href="https://www.duroche.fr/vendre" />
                <script type="application/ld+json">
                    {JSON.stringify(faqData)}
                </script>
            </Helmet>

            {/* Hero Section Spécial Vendeur */}
            <div className="relative bg-primary-text py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#b68d3d_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white mb-6 leading-tight">
                        Vendez votre bien au <span className="text-accent">meilleur prix</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
                        Une stratégie de vente sur-mesure pour votre patrimoine dans le Vaucluse Nord. <br/>
                        Valorisation, diffusion et négociation : nous nous occupons de tout.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/estimation" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-lg">
                            Estimer mon bien gratuitement
                        </Link>
                        <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-primary-text transition-colors">
                            Prendre rendez-vous
                        </a>
                    </div>
                </div>
            </div>

            {/* Pourquoi nous choisir ? */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">
                            Pourquoi confier votre vente à Duroche Immobilier ?
                        </h2>
                        <p className="mt-4 text-secondary-text max-w-2xl mx-auto">
                            Vendre n'est pas seulement une transaction, c'est un projet de vie. Nous mettons en place les meilleurs outils pour sécuriser et accélérer votre vente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="mb-4 p-3 bg-background-alt rounded-full"><BadgeCheckIcon /></div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Estimation Juste</h3>
                            <p className="text-secondary-text text-sm">Une analyse comparative de marché précise pour positionner votre bien au prix réel, garantissant une vente dans les meilleurs délais.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="mb-4 p-3 bg-background-alt rounded-full"><CameraIcon /></div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Mise en Valeur</h3>
                            <p className="text-secondary-text text-sm">Photos HDR professionnelles, visites virtuelles et conseils de home-staging pour créer le coup de cœur dès la première seconde.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="mb-4 p-3 bg-background-alt rounded-full"><SearchIcon /></div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Visibilité Maximale</h3>
                            <p className="text-secondary-text text-sm">Diffusion sur plus de 50 portails immobiliers et sur nos réseaux sociaux pour toucher 100% des acquéreurs potentiels.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="mb-4 p-3 bg-background-alt rounded-full"><HandshakeIcon /></div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Accompagnement Total</h3>
                            <p className="text-secondary-text text-sm">De la constitution du dossier à la signature chez le notaire, nous gérons l'administratif et filtrons les acheteurs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Réutilisation du composant Portals existant pour montrer la puissance de diffusion */}
            <Portals />

            {/* Les étapes de la vente */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">
                            Votre vente en 4 étapes clés
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <StepCard 
                            number="1" 
                            title="L'Avis de Valeur" 
                            description="Nous visitons votre bien et analysons ses atouts et faiblesses. Nous étudions les dernières ventes comparables dans votre quartier pour définir le prix net vendeur idéal." 
                        />
                        <StepCard 
                            number="2" 
                            title="La Stratégie Commerciale" 
                            description="Signature du mandat, réalisation des diagnostics obligatoires, prise de photos professionnelles et rédaction d'une annonce attractive." 
                        />
                        <StepCard 
                            number="3" 
                            title="Les Visites Qualifiées" 
                            description="Nous filtrons les curieux et vérifions la solvabilité des acquéreurs. Vous recevez un compte-rendu après chaque visite pour suivre l'avancée du projet." 
                        />
                        <StepCard 
                            number="4" 
                            title="La Négociation & La Vente" 
                            description="Réception des offres, négociation au mieux de vos intérêts, rédaction du compromis et accompagnement jusqu'à la remise des clés." 
                        />
                    </div>
                    
                    <div className="text-center mt-12">
                        <Link to="/nos-biens-vendus" className="text-accent font-medium hover:underline text-lg">
                            Voir nos dernières réussites &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ SEO */}
            <section className="py-24 bg-white border-t border-border-color">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <h2 className="text-3xl font-bold font-heading text-primary-text mb-12 text-center">Questions fréquentes</h2>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Combien de temps faut-il pour vendre ma maison ?</h3>
                            <p className="text-secondary-text">
                                Dans le Vaucluse Nord, le délai moyen de vente varie selon le prix et l'état du bien. Avec une estimation au prix du marché et notre stratégie de diffusion, nous visons une offre acceptée sous 30 à 60 jours. Un bien au juste prix se vend toujours rapidement.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">L'estimation de mon bien est-elle payante ?</h3>
                            <p className="text-secondary-text">
                                Non, chez Duroche Immobilier, l'avis de valeur est <strong>entièrement offert et sans engagement</strong>. Nous vous remettons un dossier complet basé sur les données du marché local.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Dois-je faire des travaux avant de vendre ?</h3>
                            <p className="text-secondary-text">
                                Pas nécessairement. Certains travaux de rafraîchissement (peinture, désencombrement) peuvent aider à vendre plus vite ("Home Staging"), mais les gros travaux ne sont pas toujours rentables. Nous vous conseillerons au cas par cas lors de notre première visite.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary-text mb-2">Quels sont les frais d'agence ?</h3>
                            <p className="text-secondary-text">
                                Les honoraires sont fixés à la signature du mandat et ne sont dus qu'en cas de succès (vente actée chez le notaire). Ils sont généralement inclus dans le prix affiché et peuvent être à la charge du vendeur ou de l'acquéreur selon le mandat.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <ContactForm 
                title="Parlons de votre projet de vente" 
                subtitle="Remplissez ce formulaire pour être recontacté sous 24h pour une estimation offerte."
            />
        </div>
    );
};

export default SellingPage;