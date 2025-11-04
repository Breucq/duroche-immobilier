import React from 'react';

interface EstimationProps {
  setCurrentPage: (page: string) => void;
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
}

/**
 * Section d'appel à l'action (CTA) pour la demande d'estimation.
 * Affiche un titre, un texte et un bouton sur une image de fond.
 */
const Estimation: React.FC<EstimationProps> = ({ setCurrentPage, title, subtitle, buttonText, backgroundImage }) => {
    return (
        <section id="estimation" className="py-24 bg-cover bg-center" style={{ backgroundImage: `url('${backgroundImage}')` }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                 <div className="absolute inset-0 bg-primary-text opacity-70 rounded-xl"></div>
                 <div className="relative z-10 text-center text-white p-8 md:p-16 rounded-xl">
                    <h2 className="text-3xl font-bold font-heading sm:text-4xl mb-4">
                        {title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto mb-8">
                        {subtitle}
                    </p>
                    <button 
                        onClick={() => setCurrentPage('/estimation')}
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Estimation;