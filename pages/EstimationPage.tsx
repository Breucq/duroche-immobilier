import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { estimationPageSettingsService } from '../services/estimationPageSettingsService';
import type { EstimationPageSettings } from '../types';

// --- Icônes SVG pour les champs du formulaire ---
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const AreaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
);

const RoomsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const BedroomsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EstimationPage: React.FC = () => {
  const [content, setContent] = useState<EstimationPageSettings | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Valeurs par défaut enrichies
  const defaultTitle = "Estimer votre bien immobilier à Orange et ses environs";
  const defaultSubtitle = "Vous souhaitez connaître la valeur réelle de votre maison ou appartement à Orange, Caderousse, Piolenc, Courthézon ou dans le Haut-Vaucluse ? Obtenez une évaluation précise et personnalisée en 2 minutes.";
  const defaultReassuranceBadge = "100% Gratuit • Confidentiel • Sans engagement • Réponse sous 48h";

  const defaultWhyUsCards = [
    {
      title: "Analyse du marché local",
      description: "Nous ne nous basons pas sur de simples algorithmes, mais sur les données réelles des dernières transactions conclues dans votre quartier.",
      icon: "market"
    },
    {
      title: "Valorisation de vos atouts",
      description: "Proximité des écoles, vue dégagée, rénovation, piscine : chaque détail de votre bien est pris en compte pour fixer le juste prix.",
      icon: "value"
    },
    {
      title: "Dossier & Conseils offerts",
      description: "Recevez un rapport d'estimation détaillé et bénéficiez de l'accompagnement personnalisé de nos conseillers locaux.",
      icon: "report"
    }
  ];

  const defaultSteps = [
    {
      stepNumber: "1",
      title: "Vous remplissez le formulaire",
      description: "(1 min chrono)"
    },
    {
      stepNumber: "2",
      title: "Prise de contact par un expert local",
      description: "Échange personnalisé pour cadrer votre projet."
    },
    {
      stepNumber: "3",
      title: "Visite du bien ou analyse comparative",
      description: "Étude rigoureuse des caractéristiques et du marché."
    },
    {
      stepNumber: "4",
      title: "Remise de votre dossier d'estimation complet",
      description: "Rapport clair, précis et argumenté."
    }
  ];

  const defaultFaq = [
    {
      question: "L'estimation est-elle vraiment gratuite et sans engagement ?",
      answer: "Oui, absolument. Notre service d'estimation est 100% gratuit et ne vous engage à aucune mise en vente. Notre vocation est de vous apporter une vision claire et objective de la valeur de votre bien sur le marché actuel."
    },
    {
      question: "Sous combien de temps vais-je recevoir mon estimation ?",
      answer: "Après réception de votre demande, un conseiller local prend contact avec vous sous 24h à 48h ouvrées afin de vous remettre un dossier d'estimation précis et argumenté."
    },
    {
      question: "Pourquoi réaliser une estimation professionnelle plutôt qu'une évaluation automatique en ligne ?",
      answer: "Les algorithmes automatisés ne tiennent pas compte de l'état réel du bien, de la vue, de l'exposition, des prestations haut de gamme, du calme de la rue ou des récentes ventes comparables dans votre quartier immédiat. Seule l'expertise d'un agent de proximité garantit un prix juste et optimisé."
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const settings = await estimationPageSettingsService.getSettings();
        setContent(settings);
      } catch (err) {
        console.error("Erreur chargement Sanity estimation:", err);
      }
    };
    fetchContent();
  }, []);

  const title = content?.title || defaultTitle;
  const subtitle = content?.subtitle || defaultSubtitle;
  const reassuranceBadge = content?.reassuranceBadge || defaultReassuranceBadge;
  const whyUsCards = content?.whyUsCards && content.whyUsCards.length > 0 ? content.whyUsCards : defaultWhyUsCards;
  const steps = content?.steps && content.steps.length > 0 ? content.steps : defaultSteps;
  const faqList = content?.faq && content.faq.length > 0 ? content.faq : defaultFaq;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const inputBaseClass = "py-3 px-4 block w-full bg-white shadow-sm border border-border-color rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all";
  const buttonClass = "w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all transform hover:-translate-y-0.5 cursor-pointer";

  // Données structurées FAQ pour Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{content?.metaTitle || "Estimer votre bien immobilier à Orange et environs | Duroche Immobilier"}</title>
        <meta 
          name="description" 
          content={content?.metaDescription || "Obtenez une estimation précise, 100% gratuite et confidentielle de votre maison ou appartement à Orange, Caderousse, Piolenc et Haut-Vaucluse en 2 minutes."} 
        />
        <link rel="canonical" href="https://duroche.fr/estimation" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="bg-background min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          {/* 1. HEADER DE PAGE */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-text mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-secondary-text max-w-2xl mx-auto leading-relaxed mb-6">
              {subtitle}
            </p>

            {/* Réassurance discrète */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/25 text-accent font-medium text-xs sm:text-sm shadow-sm">
              <CheckCircleIcon className="w-4 h-4 text-accent shrink-0" />
              <span>{reassuranceBadge}</span>
            </div>
          </div>

          {/* 2. FORMULAIRE D'ESTIMATION EN 2 COLONNES */}
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-xl border border-border-color/70 mb-20">
            <form action="https://formspree.io/f/xzzklgrv" method="POST" className="space-y-8">
              <input type="hidden" name="_subject" value="Nouvelle demande d'estimation détaillée (Duroche.fr)" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Colonne 1 : Vos coordonnées */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border-color pb-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h2 className="text-lg font-bold text-primary-text">Vos coordonnées</h2>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1.5">
                      Nom & Prénom <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="ex: Jean Dupont" 
                        className={`${inputBaseClass} pl-11`} 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-text mb-1.5">
                      Email <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="ex: jean.dupont@email.com" 
                        className={`${inputBaseClass} pl-11`} 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primary-text mb-1.5">
                      Téléphone <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        placeholder="ex: 06 12 34 56 78" 
                        className={`${inputBaseClass} pl-11`} 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Colonne 2 : Informations sur le bien */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border-color pb-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">2</span>
                    <h2 className="text-lg font-bold text-primary-text">Informations sur le bien</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-primary-text mb-1.5">Adresse du bien</label>
                      <div className="relative">
                        <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input 
                          type="text" 
                          id="address" 
                          name="address" 
                          placeholder="ex: 12 Rue de la République" 
                          className={`${inputBaseClass} pl-9`} 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-primary-text mb-1.5">
                        Ville <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input 
                          type="text" 
                          id="city" 
                          name="city" 
                          placeholder="ex: Orange, Caderousse..." 
                          className={`${inputBaseClass} pl-9`} 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-primary-text mb-1.5">
                        Type de bien <span className="text-accent">*</span>
                      </label>
                      <select 
                        id="propertyType" 
                        name="propertyType" 
                        defaultValue="Maison"
                        className={`${inputBaseClass} bg-white`}
                      >
                        <option value="Maison">Maison / Villa</option>
                        <option value="Appartement">Appartement</option>
                        <option value="Terrain">Terrain</option>
                        <option value="Immeuble">Immeuble</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-primary-text mb-1.5">Surface (m²)</label>
                      <div className="relative">
                        <AreaIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input 
                          type="number" 
                          id="area" 
                          name="surface" 
                          placeholder="ex: 120" 
                          className={`${inputBaseClass} pl-9`} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="rooms" className="block text-xs font-medium text-primary-text mb-1">Nb de pièces</label>
                      <div className="relative">
                        <RoomsIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input 
                          type="number" 
                          id="rooms" 
                          name="rooms" 
                          placeholder="ex: 5" 
                          className={`${inputBaseClass} pl-8 py-2.5 text-xs sm:text-sm`} 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bedrooms" className="block text-xs font-medium text-primary-text mb-1">Nb de chambres</label>
                      <div className="relative">
                        <BedroomsIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input 
                          type="number" 
                          id="bedrooms" 
                          name="bedrooms" 
                          placeholder="ex: 3" 
                          className={`${inputBaseClass} pl-8 py-2.5 text-xs sm:text-sm`} 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="condition" className="block text-xs font-medium text-primary-text mb-1">État du bien</label>
                      <select 
                        id="condition" 
                        name="condition" 
                        defaultValue="Bon état"
                        className="py-2.5 px-2.5 block w-full bg-white shadow-sm border border-border-color rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-xs sm:text-sm"
                      >
                        <option value="À rénover">À rénover</option>
                        <option value="Bon état">Bon état</option>
                        <option value="Excellent état">Excellent état</option>
                      </select>
                    </div>
                  </div>

                </div>

              </div>

              <div className="pt-6 border-t border-border-color text-center">
                <button type="submit" className={buttonClass}>
                  Demander mon estimation gratuite
                </button>
                <p className="text-xs text-secondary-text mt-3">
                  Vos informations sont confidentielles et utilisées uniquement dans le cadre de votre projet d'estimation.
                </p>
              </div>
            </form>
          </div>

          {/* 3. NOUVELLE SECTION : POURQUOI NOUS CHOISIR */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-text mb-3">
                Pourquoi faire estimer votre bien par Duroche Immobilier ?
              </h2>
              <p className="text-secondary-text text-sm sm:text-base">
                La précision de l'évaluation est la clé pour déclencher un coup de cœur et vendre dans les meilleurs délais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {whyUsCards.map((card, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-7 border border-border-color shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 font-bold">
                    {idx === 0 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                    {idx >= 2 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-primary-text mb-2">{card.title}</h3>
                  <p className="text-secondary-text text-sm leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. NOUVELLE SECTION : COMMENT ÇA MARCHE ? */}
          <div className="mb-20 bg-white/80 rounded-2xl p-8 sm:p-12 border border-border-color shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-text mb-3">
                Comment ça marche ?
              </h2>
              <p className="text-secondary-text text-sm sm:text-base">
                Un processus transparent en 4 étapes simples.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                    {step.stepNumber || idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. BLOC FAQ SEO */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-text mb-2">
                Foire aux questions (FAQ)
              </h2>
              <p className="text-secondary-text text-sm sm:text-base">
                Tout ce que vous devez savoir avant de faire estimer votre bien.
              </p>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-xl border border-border-color overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-primary-text hover:bg-gray-50/50 transition-colors"
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
                      <div className="px-6 pb-4 text-xs sm:text-sm text-secondary-text leading-relaxed border-t border-gray-100 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EstimationPage;
