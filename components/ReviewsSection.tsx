import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Quote, Check, ArrowRight, MessageSquare } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { settingsService } from '../services/settingsService';
import type { Review, SiteSettings } from '../types';

const DEFAULT_REVIEWS: Review[] = [
  {
    _id: 'default-1',
    author: 'Jean-Pierre M.',
    role: 'Vendeur d\'une maison à Orange',
    rating: 5,
    text: 'Un accompagnement exceptionnel pour la vente de notre maison. Thomas s\'est montré extrêmement professionnel, transparent, disponible et de très bon conseil du début à la fin. Je recommande les yeux fermés !',
    date: '2026-04-12',
    isGoogleReview: true,
  },
  {
    _id: 'default-2',
    author: 'Sophie R.',
    role: 'Acquéreur à Caderousse',
    rating: 5,
    text: 'Nous avons acheté notre résidence principale grâce à Duroche Immobilier. Tout s\'est déroulé à la perfection : des conseils pertinents, un intermédiaire à l\'écoute et un accompagnement complet jusqu\'à la signature.',
    date: '2026-05-18',
    isGoogleReview: true,
  },
  {
    _id: 'default-3',
    author: 'Mathieu L.',
    role: 'Vendeur d\'un appartement à Orange',
    rating: 5,
    text: 'Une estimation extrêmement rigoureuse et réaliste. Notre appartement a été vendu en moins d\'un mois, sans négociation interminable. Un service clé en main d\'une rare efficacité !',
    date: '2026-05-29',
    isGoogleReview: true,
  },
  {
    _id: 'default-4',
    author: 'Isabelle & Marc D.',
    role: 'Vendeurs d\'une villa à Piolenc',
    rating: 5,
    text: 'Thomas a fait preuve d\'un professionnalisme hors pair. Photos de grande qualité, visites ciblées et comptes-rendus réguliers. Nous nous sommes sentis en totale confiance. Merci encore !',
    date: '2026-06-05',
    isGoogleReview: true,
  },
  {
    _id: 'default-5',
    author: 'Guillaume T.',
    role: 'Acheteur à Courthézon',
    rating: 5,
    text: 'Très satisfait des services de Duroche Immobilier. Écoute active, réactivité excellente face à nos interrogations de primo-accédants et très bon suivi du dossier chez le notaire.',
    date: '2026-06-14',
    isGoogleReview: true,
  }
];

const ReviewsSection: React.FC = () => {
  const { data: dbReviews, isLoading: isReviewsLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: reviewService.getAll,
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  const [showAll, setShowAll] = useState(false);

  const reviews = dbReviews && dbReviews.length > 0 ? dbReviews : DEFAULT_REVIEWS;
  const googleReviewUrl = settings?.googleReviewUrl || "https://g.page/r/YOUR_GOOGLE_MAPS_REVIEW_URL/review";

  // Format date to French (e.g. "avril 2026")
  const formatDateFr = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const formatted = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
      return dateStr;
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (isReviewsLoading) {
    return (
      <div className="py-24 flex justify-center bg-background-alt border-t border-b border-border-color">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <section id="reviews" className="py-24 bg-background-alt border-t border-b border-border-color">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête avec disposition split moderne (Titre à gauche, Widget Google à droite sur grand écran) */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-16 pb-10 border-b border-gray-100">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Témoignages Clients</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl leading-tight">
              La satisfaction de nos clients est notre plus belle réussite
            </h2>
            <p className="mt-4 text-base sm:text-lg text-secondary-text">
              Découvrez les retours d'expérience et avis de propriétaires vendeurs et d'acquéreurs qui nous ont fait confiance à Orange et ses alentours.
            </p>
          </div>

          {/* Widget Synthétique Google - Très élégant et compact */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-border-color shadow-sm w-full lg:w-auto shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border border-gray-100 shadow-sm font-bold text-2xl text-blue-600 font-sans shrink-0">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-primary-text">5.0</span>
                  <span className="text-sm text-secondary-text">/5</span>
                </div>
                <div className="flex gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xs text-secondary-text font-medium">Avis Google Certifiés</p>
              </div>
            </div>
            
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-sm cursor-pointer"
            >
              Laisser un avis Google
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Grille de témoignages responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedReviews.map((review, idx) => (
            <div
              key={review._id || idx}
              className="relative bg-white p-6 sm:p-8 rounded-2xl border border-border-color shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-accent/40"
            >
              {/* Petite barre dorée décorative sur le dessus qui s'allonge au survol */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-accent/20 to-accent/60 rounded-b-full group-hover:from-accent group-hover:to-accent-dark transition-all duration-300"></div>
              
              <div>
                {/* Étoiles et Citation */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gray-100 group-hover:text-accent/10 transition-colors duration-300" />
                </div>

                {/* Texte de l'avis */}
                <p className="text-primary-text text-sm sm:text-base leading-relaxed italic mb-6">
                  "{review.text}"
                </p>
              </div>

              {/* Auteur */}
              <div className="border-t border-gray-100 pt-5 mt-auto">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-primary-text text-sm sm:text-base">
                      {review.author}
                    </h4>
                    {review.role && (
                      <p className="text-xs sm:text-sm text-secondary-text mt-0.5 font-medium leading-tight">
                        {review.role}
                      </p>
                    )}
                    {review.date && (
                      <span className="text-[11px] text-secondary-text/80 block mt-1 font-mono">
                        {formatDateFr(review.date)}
                      </span>
                    )}
                  </div>

                  {review.isGoogleReview && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100/60 shrink-0 whitespace-nowrap">
                      <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                      Certifié
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton d'action "Voir plus d'avis" */}
        {reviews.length > 3 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center px-6 py-3 border border-border-color text-sm font-semibold rounded-xl bg-white text-primary-text hover:bg-gray-50 transition-colors shadow-sm hover:border-accent cursor-pointer"
            >
              {showAll ? 'Réduire la liste des avis' : `Voir tous les avis (${reviews.length})`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewsSection;
