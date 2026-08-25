import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ContactForm from '../components/ContactForm';
import Portals from '../components/Portals';
import { sellingPageSettingsService } from '../services/sellingPageSettingsService';
import type { SellingPageSettings } from '../types';

// Icônes des atouts
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HandshakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BadgeCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const SellingPage: React.FC = () => {
  const [content, setContent] = useState<SellingPageSettings | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Valeurs par défaut optimisées SEO & conversion
  const defaultMetaTitle = "Vendre son bien immobilier à Orange & Haut-Vaucluse | Duroche Immobilier";
  const defaultMetaDescription = "Confiez la vente de votre maison ou appartement à Orange, Caderousse, Piolenc à Duroche Immobilier. Estimation juste, diffusion maximale sur +50 portails et accompagnement de A à Z.";
  const defaultHeroBadge = "Expertise Immobilière • Orange & Haut-Vaucluse";
  const defaultHeroTitle = "Vendez votre bien au meilleur prix à Orange et ses environs";
  const defaultHeroSubtitle = "Une stratégie de vente sur-mesure pour votre patrimoine dans le Vaucluse Nord : valorisation soignée, diffusion maximale sur +50 portails et négociation experte pour sécuriser votre transaction.";

  const defaultHeroStats = [
    { value: "48h", label: "Avis de valeur offert" },
    { value: "+50", label: "Portails de diffusion" },
    { value: "100%", label: "Accompagnement notarié" },
  ];

  const defaultPillarsTitle = "Pourquoi confier votre vente à Duroche Immobilier ?";
  const defaultPillarsSubtitle = "Vendre n'est pas seulement une transaction, c'est un projet de vie. Nous mettons en place les meilleurs outils pour valoriser, sécuriser et accélérer votre vente.";

  const defaultPillars = [
    {
      title: "Estimation Juste",
      description: "Une analyse comparative de marché précise pour positionner votre bien au prix réel et déclencher des offres qualifiées rapidement.",
      icon: "chart"
    },
    {
      title: "Mise en Valeur",
      description: "Photos HDR professionnelles, visites virtuelles et valorisation des volumes pour susciter le coup de cœur dès la première seconde.",
      icon: "camera"
    },
    {
      title: "Visibilité Maximale",
      description: "Diffusion ciblée sur plus de 50 portails immobiliers (SeLoger, Leboncoin, Bien'ici...) et sur nos réseaux sociaux.",
      icon: "globe"
    },
    {
      title: "Accompagnement Total",
      description: "Filtrage et vérification de la solvabilité des acquéreurs, suivi notarié rigoureux jusqu'à la signature de l'acte authentique.",
      icon: "shield"
    }
  ];

  const defaultStepsTitle = "Votre vente en 4 étapes clés";
  const defaultStepsSubtitle = "Un processus transparent et structuré pour réussir votre vente en toute sérénité.";

  const defaultSteps = [
    {
      stepNumber: "01",
      title: "L'Avis de Valeur",
      description: "Visite approfondie de votre bien, analyse de ses spécificités et étude des transactions comparables récentes pour définir le prix net vendeur optimal."
    },
    {
      stepNumber: "02",
      title: "La Stratégie Commerciale",
      description: "Signature du mandat adapté, réalisation des diagnostics obligatoires, reportage photo professionnel et diffusion multi-plateformes percutante."
    },
    {
      stepNumber: "03",
      title: "Les Visites Qualifiées",
      description: "Filtrage rigoureux des acheteurs, validation de leur financement et comptes-rendus systématiques après chaque visite pour suivre l'avancée."
    },
    {
      stepNumber: "04",
      title: "La Négociation & La Vente",
      description: "Défense de vos intérêts, sécurisation de l'offre d'achat, coordination avec les études notariales et présence à vos côtés jusqu'à la remise des clés."
    }
  ];

  const defaultFaqTitle = "Foire aux questions des vendeurs";
  const defaultFaqSubtitle = "Toutes les réponses à vos interrogations pour aborder votre projet de vente en toute confiance.";

  const defaultFaq = [
    {
      question: "Combien de temps faut-il pour vendre ma maison ou mon appartement ?",
      answer: "Dans le Vaucluse Nord (Orange, Caderousse, Piolenc...), le délai moyen dépend principalement du positionnement prix. Un bien au juste prix avec notre stratégie de diffusion reçoit généralement une offre ferme sous 30 à 60 jours."
    },
    {
      question: "L'estimation de mon bien est-elle payante ou engageante ?",
      answer: "Non, chez Duroche Immobilier, l'avis de valeur est 100% offert, confidentiel et sans aucun engagement. Nous vous remettons un dossier d'estimation complet et documenté."
    },
    {
      question: "Quels diagnostics sont obligatoires dès la mise en vente ?",
      answer: "Le Diagnostic de Performance Énergétique (DPE) et l'Audit énergétique (si applicable) sont obligatoires dès la parution de l'annonce. Selon la date de construction et la zone, vous devrez également fournir les diagnostics amiante, plomb, électricité, gaz, termites et l'ERP (État des Risques)."
    },
    {
      question: "Dois-je faire des travaux de rénovation avant de vendre ?",
      answer: "Pas obligatoirement. Un rafraîchissement (peintures neutres, désencombrement, mise en valeur des espaces) est souvent très rentable pour créer le coup de cœur, tandis que de gros travaux ne sont pas toujours amortis. Nous vous conseillons lors de notre première visite."
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const settings = await sellingPageSettingsService.getSettings();
        setContent(settings);
      } catch (err) {
        console.error("Erreur chargement Sanity Vendre:", err);
      }
    };
    fetchContent();
  }, []);

  const metaTitle = content?.metaTitle || defaultMetaTitle;
  const metaDescription = content?.metaDescription || defaultMetaDescription;
  const heroBadge = content?.heroBadge || defaultHeroBadge;
  const heroTitle = content?.heroTitle || defaultHeroTitle;
  const heroSubtitle = content?.heroSubtitle || defaultHeroSubtitle;
  const heroStats = content?.heroStats && content.heroStats.length > 0 ? content.heroStats : defaultHeroStats;
  
  const pillarsTitle = content?.pillarsTitle || defaultPillarsTitle;
  const pillarsSubtitle = content?.pillarsSubtitle || defaultPillarsSubtitle;
  const pillars = content?.pillars && content.pillars.length > 0 ? content.pillars : defaultPillars;

  const stepsTitle = content?.stepsTitle || defaultStepsTitle;
  const stepsSubtitle = content?.stepsSubtitle || defaultStepsSubtitle;
  const steps = content?.steps && content.steps.length > 0 ? content.steps : defaultSteps;

  const faqTitle = content?.faqTitle || defaultFaqTitle;
  const faqSubtitle = content?.faqSubtitle || defaultFaqSubtitle;
  const faq = content?.faq && content.faq.length > 0 ? content.faq : defaultFaq;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Balisage Schema.org pour Google
  const schemaOrgFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const schemaOrgService = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Duroche Immobilier - Vente immobilière",
    "description": metaDescription,
    "url": "https://www.duroche.fr/vendre",
    "areaServed": ["Orange", "Caderousse", "Piolenc", "Courthézon", "Jonquières", "Camaret-sur-Aigues", "Sérignan-du-Comtat", "Haut-Vaucluse"]
  };

  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="vendre maison orange, vendre appartement orange vaucluse, estimation vente immobilier orange, agence vente caderousse piolenc, mandat de vente duroche immobilier" />
        <link rel="canonical" href="https://www.duroche.fr/vendre" />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgFaq)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgService)}
        </script>
      </Helmet>

      {/* 1. HERO SECTION VENDEUR */}
      <div className="relative bg-primary-text py-20 sm:py-28 overflow-hidden pt-32">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#b68d3d_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge Hero */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-medium text-xs sm:text-sm mb-6">
            <span>{heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-white mb-6 leading-tight max-w-4xl mx-auto">
            {heroTitle}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/estimation" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base sm:text-lg font-semibold rounded-xl text-white bg-accent hover:bg-accent-dark transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Estimer mon bien gratuitement
            </Link>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-base sm:text-lg font-medium rounded-xl text-white hover:bg-white hover:text-primary-text transition-all"
            >
              Prendre rendez-vous
            </a>
          </div>

          {/* Chiffres clés / Stats */}
          {heroStats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10">
              {heroStats.map((stat, idx) => (
                <div key={idx} className="p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-accent">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 2. SECTION ATOUTS (POURQUOI NOUS CHOISIR) */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-primary-text">
              {pillarsTitle}
            </h2>
            <p className="mt-4 text-secondary-text text-sm sm:text-base leading-relaxed">
              {pillarsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center p-7 bg-background/50 rounded-2xl border border-border-color/60 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="mb-5 p-4 bg-white rounded-2xl shadow-sm border border-border-color/40">
                  {idx === 0 && <BadgeCheckIcon />}
                  {idx === 1 && <CameraIcon />}
                  {idx === 2 && <SearchIcon />}
                  {idx >= 3 && <HandshakeIcon />}
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2.5">{pillar.title}</h3>
                <p className="text-secondary-text text-xs sm:text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DIFFUSION DES ANNONCES (PORTALS) */}
      <Portals />

      {/* 4. LES 4 ÉTAPES DE LA VENTE */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-primary-text">
              {stepsTitle}
            </h2>
            <p className="mt-4 text-secondary-text text-sm sm:text-base">
              {stepsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-7 bg-white border border-border-color/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center font-bold text-base shadow-sm mb-4">
                  {step.stepNumber || `0${idx + 1}`}
                </div>
                <h3 className="text-xl font-bold font-serif text-primary-text mb-2.5">{step.title}</h3>
                <p className="text-secondary-text text-xs sm:text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/nos-biens-vendus" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline text-base sm:text-lg">
              <span>Découvrir nos dernières ventes réalisées dans le secteur</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAQ VENDEUR (ACCORDÉONS INTERACTIFS + SEO) */}
      <section className="py-20 sm:py-24 bg-white border-t border-border-color">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-primary-text mb-3">
              {faqTitle}
            </h2>
            <p className="text-secondary-text text-sm sm:text-base">
              {faqSubtitle}
            </p>
          </div>
          
          <div className="space-y-3">
            {faq.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-background/40 rounded-xl border border-border-color overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-primary-text hover:bg-background/80 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{item.question}</span>
                    <svg 
                      className={`w-5 h-5 shrink-0 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs sm:text-sm text-secondary-text leading-relaxed border-t border-border-color/60 pt-3 bg-white/60">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FORMULAIRE DE CONTACT VENDEUR */}
      <div id="contact">
        <ContactForm 
          title="Parlons de votre projet de vente" 
          subtitle="Remplissez ce formulaire pour être recontacté sous 24h par votre conseiller local dédié."
        />
      </div>
    </div>
  );
};

export default SellingPage;
