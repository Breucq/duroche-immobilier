import React from 'react';
import { Link } from 'react-router-dom';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { Page } from '../types';
import { urlFor } from '../services/sanityClient';

interface GenericPageProps {
  page: Page;
}

const GenericPage: React.FC<GenericPageProps> = ({ page }) => {
  
  const coverImageUrl = page.coverImage 
    ? urlFor(page.coverImage).width(1920).height(600).fit('crop').url() 
    : null;

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-4 leading-relaxed text-secondary-text">{children}</p>,
      h1: ({ children }) => <h1 className="text-3xl font-bold font-heading text-primary-text mt-10 mb-4">{children}</h1>,
      h2: ({ children }) => <h2 className="text-2xl font-bold font-heading text-primary-text mt-8 mb-4 border-b border-border-color pb-2">{children}</h2>,
      h3: ({ children }) => <h3 className="text-xl font-bold font-heading text-primary-text mt-6 mb-3">{children}</h3>,
      h4: ({ children }) => <h4 className="text-lg font-bold font-heading text-primary-text mt-4 mb-2">{children}</h4>,
      blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 italic my-6 text-primary-text bg-background-alt py-2 pr-2 rounded-r">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-secondary-text marker:text-accent">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-secondary-text marker:font-bold">{children}</ol>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-bold text-primary-text">{children}</strong>,
        link: ({ value, children }) => {
            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
            return (
                <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-accent hover:text-accent-dark underline decoration-accent/30 hover:decoration-accent transition-colors">
                    {children}
                </a>
            );
        },
    },
  };

  return (
    <div className="bg-background min-h-screen">
        {/* Header de la page */}
        <div className="relative bg-primary-text py-20 sm:py-28 overflow-hidden">
             {coverImageUrl && (
                 <>
                    <div 
                        className="absolute inset-0 bg-cover bg-center z-0" 
                        style={{ backgroundImage: `url('${coverImageUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-[2px]"></div>
                 </>
             )}
             
             {!coverImageUrl && (
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
             )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                 <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6 border border-accent/30 uppercase tracking-wider backdrop-blur-sm">
                    Agence Duroche Immobilier
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white mb-6">
                    {page.title}
                </h1>
                {page.subtitle && (
                    <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
                        {page.subtitle}
                    </p>
                )}
                {!page.subtitle && <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>}
            </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto border border-border-color/40">
                
                <div className="prose prose-lg prose-slate max-w-none mx-auto">
                     {/* Rendu du Portable Text */}
                     {Array.isArray(page.content) ? (
                        <PortableText value={page.content} components={components} />
                     ) : (
                        /* Fallback pour l'ancien contenu texte simple si présent */
                        <div className="whitespace-pre-line text-secondary-text leading-loose">
                            {typeof page.content === 'string' ? page.content : ''}
                        </div>
                     )}
                </div>

                {/* Bloc Contact en bas de contenu */}
                <div className="mt-16 pt-10 border-t border-border-color flex flex-col md:flex-row items-center justify-between gap-6 bg-background-alt p-6 rounded-xl">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-primary-text font-heading">Une question ?</h3>
                        <p className="text-secondary-text mt-1">Notre équipe est à votre disposition pour y répondre.</p>
                    </div>
                    <Link 
                        to="/contact" 
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Contactez-nous
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GenericPage;