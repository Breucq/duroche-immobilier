import React, { useState, useEffect } from 'react';
import { estimationPageSettingsService } from '../services/estimationPageSettingsService';
import type { EstimationPageSettings } from '../types';

// --- SVG Icons for form fields ---
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
const AreaIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>);
const BedroomsIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>);

const EstimationPage: React.FC = () => {
    const [content, setContent] = useState<EstimationPageSettings | null>(null);
    
    useEffect(() => {
        const fetchContent = async () => {
            const settings = await estimationPageSettingsService.getSettings();
            setContent(settings);
        }
        fetchContent();
    }, []);
    
    const inputBaseClass = "py-3 px-4 block w-full bg-white shadow-sm border-border-color rounded-lg focus:ring-1 focus:ring-accent focus:border-accent";
    const buttonClass = "w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors";

    if (!content) {
        return <div className="py-48 text-center">Chargement...</div>;
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                 <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">{content.title}</h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-border-color/50">
                     <form action="https://formspree.io/f/xzzklgrv" method="POST" className="space-y-6">
                        <input type="hidden" name="_subject" value="Nouvelle demande d'estimation" />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1">Nom & Prénom</label><div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="text" id="name" name="name" placeholder="ex: Jean Dupont" className={`${inputBaseClass} pl-10`} required /></div></div>
                             <div><label htmlFor="email" className="block text-sm font-medium text-primary-text mb-1">Email</label><div className="relative"><MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="email" id="email" name="email" placeholder="ex: jean.dupont@email.com" className={`${inputBaseClass} pl-10`} required /></div></div>
                             <div><label htmlFor="phone" className="block text-sm font-medium text-primary-text mb-1">Téléphone</label><div className="relative"><PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="tel" id="phone" name="phone" className={`${inputBaseClass} pl-10`} required /></div></div>
                         </div>
                         <hr className="border-border-color"/>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div><label htmlFor="address" className="block text-sm font-medium text-primary-text mb-1">Adresse du bien</label><div className="relative"><LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="text" id="address" name="address" placeholder="ex: 123 Rue de la République" className={`${inputBaseClass} pl-10`} required /></div></div>
                            <div><label htmlFor="city" className="block text-sm font-medium text-primary-text mb-1">Ville</label><div className="relative"><BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="text" id="city" name="city" placeholder="ex: Orange" className={`${inputBaseClass} pl-10`} required /></div></div>
                            <div><label htmlFor="area" className="block text-sm font-medium text-primary-text mb-1">Surface (m²)</label><div className="relative"><AreaIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="number" id="area" name="Surface (en m²)" placeholder="ex: 120" className={`${inputBaseClass} pl-10`} /></div></div>
                             <div><label htmlFor="bedrooms" className="block text-sm font-medium text-primary-text mb-1">Nombre de chambres</label><div className="relative"><BedroomsIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" /><input type="number" id="bedrooms" name="Nombre de chambres" placeholder="ex: 3" className={`${inputBaseClass} pl-10`} /></div></div>
                         </div>
                        <div className="pt-4"><button type="submit" className={buttonClass}>Demander une estimation</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EstimationPage;