import React from 'react';
import type { Article } from '../types';
import { urlFor } from '../services/sanityClient';

interface ArticleCardProps {
  article: Article;
  setCurrentPage: (page: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, setCurrentPage }) => {
  
  const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const detailPath = `/blog/${article.slug.current}`;
  const imageUrl = urlFor(article.image).width(400).height(300).url();

  return (
    <div 
      onClick={() => setCurrentPage(detailPath)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col cursor-pointer border border-border-color/50"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setCurrentPage(detailPath)}
      aria-label={`Lire l'article : ${article.title}`}
    >
      <div className="relative">
        <img className="w-full h-56 object-cover" src={imageUrl} alt={`Image de couverture pour l'article : ${article.title}`} loading="lazy" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold font-heading text-primary-text mb-2 leading-tight">
          {article.title}
        </h2>
        <div className="text-sm text-secondary-text mb-4">
          <span>Par {article.author}</span> &bull; <span>{formattedDate}</span>
        </div>
        <p className="text-secondary-text flex-grow">
          {article.summary}
        </p>
      </div>
    </div>
  );
};

export default ArticleCard;