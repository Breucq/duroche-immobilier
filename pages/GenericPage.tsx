import React from 'react';
import { Link } from 'react-router-dom';
import type { Page } from '../types';

interface GenericPageProps {
  page: Page;
}

const GenericPage: React.FC<GenericPageProps> = ({ page }) => {
  return (
    <div className="bg-background min-h-screen">
        {/* Header de la page avec fond subtil */}
        <div className="relative bg-primary-text py-20 sm:py-28 overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                 <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6 border border-accent/30 uppercase tracking-wider">
                    Agence Duroche Immobilier
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white mb-6">
                    {page.title}
                </h1>
                <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
            </div>
        </div>

        {/* Contenu principal façon "Carte éditoriale" */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto border border-border-color/40">
                
                <div className="prose prose-lg prose-slate max-w-none mx-auto prose-headings:font-heading prose-headings:text-primary-text prose-a:text-accent hover:prose-a:text-accent-dark prose-img:rounded-xl">
                     <div className="whitespace-pre-line text-secondary-text leading-loose">
                        {page.content}
                     </div>
                </div>

                {/* Bloc Contact en bas de contenu */}
                <div className="mt-16 pt-10 border-t border-border-color flex flex-col md:flex-row items-center justify-between gap-6 bg-background-alt p-6 rounded-xl">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-primary-text font-heading">Vous souhaitez en savoir plus ?</h3>
                        <p className="text-secondary-text mt-1">Notre équipe est à votre écoute pour vous accompagner.</p>
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