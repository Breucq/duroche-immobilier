import React from 'react';
import type { Page } from '../types';

interface GenericPageProps {
  page: Page;
}

const GenericPage: React.FC<GenericPageProps> = ({ page }) => {
  // Traite le contenu textuel pour le convertir en HTML.
  // Les blocs de texte séparés par une ou plusieurs lignes vides sont transformés en paragraphes.
  // Les sauts de ligne simples à l'intérieur d'un bloc sont conservés via <br />.
  const processedContent = page.content
    ? page.content
        .split(/\n\s*\n/) // Sépare les blocs par une ou plusieurs lignes vides
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`) // Remplace les sauts de ligne internes par <br>
        .join('')
    : '';

  return (
    <div className="bg-background py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-8">
        <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl mb-12 text-center">{page.title}</h1>
        <div 
          className="prose prose-lg max-w-none text-secondary-text leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </div>
  );
};

export default GenericPage;