import React from 'react';

const PORTALS = [
    { name: "Bien'ici", className: "bg-[#FFD700] text-black border-transparent font-bold" },
    { name: "SeLoger", className: "bg-[#FF4D4D] text-white border-transparent font-bold" },
    { name: "Green-Acres", className: "bg-[#22C55E] text-white border-transparent font-bold" },
    { name: "Le Bon Coin", className: "bg-[#FDF1E6] text-[#EA580C] border-transparent font-bold" },
    { name: "LuxuryEstate", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Alentoor.fr", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Bazar.lu", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Etre Proprio", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Evrovilla", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Globimmo", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Go Flint", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Immobilier en Corse", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Immo gratuit", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "immoSquare", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "inspectimmo.fr", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Kyero", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "La Bonne Pierre", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Le42Immo.com", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "L'immobilier Francais", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Le Partenaire", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "LeProImmo", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Leroiloc", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Les Terrains", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Ma Cabane", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "MonBien.fr", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Arlet immo", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Petits Prix Immo", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Superimmo", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Properstar", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Wymmo", className: "bg-white text-primary-text border-border-color hover:border-accent" },
    { name: "Zilek", className: "bg-white text-primary-text border-border-color hover:border-accent" },
];

const Portals: React.FC = () => {
    return (
        <section id="portals" className="py-24 bg-background-alt border-t border-border-color/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-heading text-primary-text sm:text-4xl">Une visibilité maximale pour votre bien</h2>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                        Nous diffusons vos annonces sur l'ensemble des portails immobiliers leaders en France et à l'international pour toucher 100% des acquéreurs actifs.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                    {PORTALS.map((portal) => (
                        <span 
                            key={portal.name} 
                            className={`px-5 py-2.5 rounded-full text-sm font-medium border shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 select-none ${portal.className}`}
                        >
                            {portal.name}
                        </span>
                    ))}
                     <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-gray-200 text-secondary-text border border-transparent shadow-inner">
                        et + de 268 autres...
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Portals;