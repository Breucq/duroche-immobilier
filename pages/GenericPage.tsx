import React from 'react';
import type { Page } from '../types';

interface GenericPageProps {
  page: Page;
}

const GenericPage: React.FC<GenericPageProps> = ({ page }) => {
  return (
    <div className="bg-background py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div 
          className="prose prose-lg max-w-none text-primary-text leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export default GenericPage;