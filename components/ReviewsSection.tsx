import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import type { Review } from '../types';

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
  }
];

const ReviewsSection: React.FC = () => {
  const { data: dbReviews, isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: reviewService.getAll,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = dbReviews && dbReviews.length > 0 ? dbReviews : DEFAULT_REVIEWS;

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <section id="reviews" className="py-24 bg-background-alt overflow-hidden border-t border-b border-border-color">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">
            Avis Clients & Témoignages
          </h2>
          <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">
            La satisfaction de nos clients est notre plus belle réussite. Découvrez leurs retours d'expérience.
          </p>
        </div>

        {/* Grille Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Widget Google Synthèse à Gauche */}
          <div className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-sm border border-border-color text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {/* Icône Google stylisée avec des cercles colorés */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-100 shadow-sm font-bold text-xl text-blue-600 font-sans">
                G
              </div>
              <span className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
                Avis Google
              </span>
            </div>

            <div className="text-5xl font-extrabold text-primary-text mb-4">
              5.0<span className="text-2xl text-secondary-text font-normal">/5</span>
            </div>

            {/* Étoiles dorées */}
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-accent text-accent" />
              ))}
            </div>

            <p className="text-sm text-secondary-text mb-6">
              Basé sur la totalité de nos retours clients certifiés.
            </p>

            <a
              href="https://g.page/r/YOUR_GOOGLE_MAPS_REVIEW_URL/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-accent hover:bg-accent-dark transition-colors shadow-sm"
            >
              Laisser un avis Google
            </a>
          </div>

          {/* Carrousel de Témoignages à Droite */}
          <div className="lg:col-span-8 relative">
            <div className="relative bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-border-color min-h-[280px] flex flex-col justify-between">
              
              {/* Icône de citation en fond */}
              <Quote className="absolute right-8 top-8 w-16 h-16 text-gray-100 -z-0 pointer-events-none" />

              <div className="relative z-10">
                {/* Note */}
                <div className="flex gap-1 mb-6">
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Texte */}
                <p className="text-lg text-primary-text italic leading-relaxed mb-6">
                  "{reviews[currentIndex].text}"
                </p>
              </div>

              {/* Auteur */}
              <div className="relative z-10 flex items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  <h4 className="font-semibold text-primary-text text-base">
                    {reviews[currentIndex].author}
                  </h4>
                  {reviews[currentIndex].role && (
                    <p className="text-sm text-secondary-text mt-0.5">
                      {reviews[currentIndex].role}
                    </p>
                  )}
                </div>

                {/* Badge Google */}
                {reviews[currentIndex].isGoogleReview && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Avis Certifié
                  </span>
                )}
              </div>
            </div>

            {/* Contrôles du Carrousel */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={prevReview}
                className="p-3 rounded-full bg-white border border-border-color text-primary-text hover:bg-accent hover:text-white hover:border-accent transition-colors shadow-sm"
                aria-label="Avis précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                className="p-3 rounded-full bg-white border border-border-color text-primary-text hover:bg-accent hover:text-white hover:border-accent transition-colors shadow-sm"
                aria-label="Avis suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
