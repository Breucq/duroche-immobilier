import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { cityGuideService } from '../services/cityGuideService';
import { urlFor } from '../services/sanityClient';
import type { CityGuide } from '../types';

interface CityGuideSectionProps {
  cityName: string;
  activePropertiesCount: number;
  onOpenAlertModal?: () => void;
}

export const CityGuideSection: React.FC<CityGuideSectionProps> = ({
  cityName,
  activePropertiesCount,
  onOpenAlertModal
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { data: cityGuide, isLoading } = useQuery<CityGuide | null>({
    queryKey: ['cityGuide', cityName],
    queryFn: () => cityGuideService.getByCityName(cityName),
    enabled: Boolean(cityName && cityName.trim() !== ''),
  });

  if (!cityName || cityName.trim() === '') return null;

  const formattedCity = cityName.trim();

  // URL d'image de couverture si présente dans Sanity
  const coverImageUrl = cityGuide?.coverImage
    ? urlFor(cityGuide.coverImage).width(1200).height(500).fit('crop').url()
    : null;

  // Configuration du PortableText pour le rendu riche Sanity
  const portableComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-4 leading-relaxed text-secondary-text">{children}</p>,
      h2: ({ children }) => <h2 className="text-2xl font-bold font-heading text-primary-text mt-8 mb-4 border-b border-border-color pb-2">{children}</h2>,
      h3: ({ children }) => <h3 className="text-xl font-bold font-heading text-primary-text mt-6 mb-3">{children}</h3>,
      blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 italic my-4 text-primary-text bg-background-alt py-2 pr-2 rounded-r">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-secondary-text marker:text-accent">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-secondary-text marker:font-bold">{children}</ol>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold text-primary-text">{children}</strong>,
      link: ({ value, children }) => (
        <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {children}
        </a>
      ),
    },
  };

  // Titres & descriptions SEO personnalisés ou générés automatiquement
  const pageTitle = cityGuide?.metaTitle || `Immobilier ${formattedCity} (${cityGuide?.postalCode || 'Vaucluse'}) | Vente & Estimation Duroche`;
  const pageMetaDesc = cityGuide?.metaDescription || `Découvrez nos biens immobiliers à vendre à ${formattedCity} et notre guide du marché local. Maisons, villas et appartements avec Duroche Immobilier.`;

  // FAQ par défaut enrichie pour le GEO (Generative Engine Optimization / AI search) si pas encore saisie dans Sanity
  const defaultFaqs = [
    {
      question: `Quel est le marché immobilier à ${formattedCity} ?`,
      answer: `${formattedCity} bénéficie d'une forte attractivité au cœur du Vaucluse, offrant un cadre de vie prisé entre vignobles et patrimoine. Les maisons provençales, villas avec jardin et appartements de charme y sont très recherchées par les acquéreurs locaux et régionaux.`
    },
    {
      question: `Pourquoi faire appel à Duroche Immobilier à ${formattedCity} ?`,
      answer: `Notre agence indépendante possède une connaissance intime du marché immobilier de ${formattedCity} et du Vaucluse Nord. Nous accompagnons acheteurs et vendeurs avec une estimation précise au prix juste et un suivi personnalisé de A à Z.`
    },
    {
      question: `Que faire si aucun bien n'est actuellement affiché à ${formattedCity} ?`,
      answer: `Certains biens font l'objet d'une vente en toute confidentialité (Off-Market). En créant une alerte ou en nous contactant directement, vous accéderez en priorité aux nouveaux biens avant leur parution publique.`
    }
  ];

  const faqsToDisplay = cityGuide?.faqs && cityGuide.faqs.length > 0 ? cityGuide.faqs : defaultFaqs;

  // Schema.org FAQPage pour Google & les moteurs de recherche IA (Perplexity, ChatGPT, Gemini)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsToDisplay.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Schema.org Place / RealEstateListing
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": formattedCity,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": formattedCity,
      "addressRegion": "Vaucluse",
      "addressCountry": "FR",
      ...(cityGuide?.postalCode ? { "postalCode": cityGuide.postalCode } : {})
    }
  };

  return (
    <section id="presentation-ville" className="mt-16 pt-12 border-t border-border-color/60 bg-gradient-to-b from-transparent via-background-alt/50 to-background-alt rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageMetaDesc} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(placeSchema)}</script>
      </Helmet>

      {/* Header section ville */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          Guide Immobilier & Cadre de Vie
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-primary-text mb-4">
          {cityGuide?.title || `L'immobilier à ${formattedCity}`}
        </h2>

        {cityGuide?.subtitle ? (
          <p className="text-lg text-secondary-text font-light max-w-2xl mx-auto">
            {cityGuide.subtitle}
          </p>
        ) : (
          <p className="text-base text-secondary-text font-light max-w-2xl mx-auto">
            Découvrez le marché immobilier, les atouts de {formattedCity} et l'expertise de Duroche Immobilier pour concrétiser votre projet en toute sérénité.
          </p>
        )}
      </div>

      {/* Image de couverture optionnelle */}
      {coverImageUrl && (
        <div className="max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-md max-h-72 relative">
          <img src={coverImageUrl} alt={`Cadre de vie à ${formattedCity}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <span className="text-white font-medium text-sm drop-shadow">
              {formattedCity} {cityGuide?.postalCode ? `(${cityGuide.postalCode})` : ''} - Vaucluse
            </span>
          </div>
        </div>
      )}

      {/* Message indicatif si aucun bien actif pour la ville */}
      {activePropertiesCount === 0 && (
        <div className="max-w-4xl mx-auto mb-10 bg-amber-50/80 border border-amber-200 rounded-2xl p-6 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-base">
                Aucun bien actuellement en ligne publiquement à {formattedCity}
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                Les biens disponibles sur cette commune sont rapidement vendus ou diffusés en toute confidentialité. Restez informé en créant une alerte personnalisée.
              </p>
            </div>
          </div>
          {onOpenAlertModal && (
            <button
              onClick={onOpenAlertModal}
              className="shrink-0 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer w-full sm:w-auto text-center"
            >
              M'alerter des nouveautés
            </button>
          )}
        </div>
      )}

      {/* Points forts / Key Highlights badges */}
      {cityGuide?.keyPoints && cityGuide.keyPoints.length > 0 && (
        <div className="max-w-4xl mx-auto mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text mb-3 text-center sm:text-left">
            Les points forts de {formattedCity}
          </h3>
          <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
            {cityGuide.keyPoints.map((point, index) => (
              <span key={index} className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-border-color text-xs sm:text-sm font-medium text-primary-text shadow-xs">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                {point}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contenu principal de présentation */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-border-color/60 p-6 sm:p-10 mb-10">
        {cityGuide?.intro && (
          <p className="text-base sm:text-lg text-primary-text font-medium leading-relaxed mb-6 pb-6 border-b border-border-color/60 italic">
            "{cityGuide.intro}"
          </p>
        )}

        {cityGuide?.content && Array.isArray(cityGuide.content) ? (
          <div className="prose prose-slate max-w-none text-sm sm:text-base">
            <PortableText value={cityGuide.content} components={portableComponents} />
          </div>
        ) : (
          <div className="space-y-4 text-sm sm:text-base text-secondary-text leading-relaxed">
            <p>
              Située au cœur du territoire provençal, la commune de <strong className="text-primary-text">{formattedCity}</strong> offre une qualité de vie privilégiée, alliant sérénité champêtre, patrimoine architectural et proximité immédiate des grands axes de communication du Vaucluse.
            </p>
            <p>
              Que vous cherchiez une maison de village pleine de cachet, une villa contemporaine avec piscine ou un terrain à bâtir, <strong className="text-primary-text">Duroche Immobilier</strong> met à votre disposition son savoir-faire local pour estimer, acheter ou vendre votre bien dans les meilleures conditions.
            </p>
          </div>
        )}

        {/* Action Vendeur & Acheteur */}
        <div className="mt-8 pt-8 border-t border-border-color/60 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background-alt/80 p-5 rounded-xl border border-border-color/40 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-primary-text text-sm font-heading mb-1">
                Vous possédez un bien à {formattedCity} ?
              </h4>
              <p className="text-xs text-secondary-text mb-4 leading-relaxed">
                Obtenez une estimation personnalisée basée sur les dernières transactions réelles de votre quartier.
              </p>
            </div>
            <Link
              to="/estimation"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
            >
              Estimer mon bien gratuitement
            </Link>
          </div>

          <div className="bg-background-alt/80 p-5 rounded-xl border border-border-color/40 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-primary-text text-sm font-heading mb-1">
                Recherche active à {formattedCity} ?
              </h4>
              <p className="text-xs text-secondary-text mb-4 leading-relaxed">
                Ne manquez aucune opportunité. Soyez informé immédiatement des nouveaux biens entrés sur le secteur.
              </p>
            </div>
            {onOpenAlertModal ? (
              <button
                onClick={onOpenAlertModal}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-text hover:bg-black text-white font-semibold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
              >
                Créer une alerte e-mail
              </button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-text hover:bg-black text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
              >
                Nous confier votre recherche
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Section FAQ Accordion (GEO / AI SEO) */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold font-heading text-primary-text mb-4 text-center sm:text-left flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Foire aux questions : Immobilier à {formattedCity}
        </h3>

        <div className="space-y-3">
          {faqsToDisplay.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-border-color/60 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-primary-text hover:bg-background-alt/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 shrink-0 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-secondary-text border-t border-gray-100 leading-relaxed bg-gray-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CityGuideSection;
