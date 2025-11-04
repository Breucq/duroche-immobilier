import React from 'react';
import ContactForm from '../components/ContactForm';

interface ContactPageProps {
    reference?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ reference }) => {
    return (
        <div className="bg-background min-h-screen">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                 <div className="text-center pt-8 mb-12">
                    <h1 className="text-4xl font-bold font-heading text-primary-text sm:text-5xl">Contactez-nous</h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                        Basés à Orange, nous intervenons dans tout le Vaucluse Nord. Nous sommes à votre écoute pour toute question ou pour discuter de votre projet immobilier.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-border-color/50">
                        <h2 className="text-2xl font-heading font-semibold text-primary-text mb-6">Nos Coordonnées</h2>
                        <div className="space-y-4 text-primary-text">
                            <p className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>123 Rue de la République<br/>84100 Orange, Vaucluse</span>
                            </p>
                             <p className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <a href="tel:0600000000" className="hover:text-accent">06 00 00 00 00</a>
                            </p>
                             <p className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:contact@duroche.fr" className="hover:text-accent">contact@duroche.fr</a>
                            </p>
                        </div>
                        <div className="mt-8 rounded-lg overflow-hidden shadow-md">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45842.83151829902!2d4.781681!3d44.136214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b5823e24b25f8d%3A0x40819a5c990b450!2sOrange!5e0!3m2!1sfr!2sfr!4v1677324322451!5m2!1sfr!2sfr"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Carte de localisation de l'agence à Orange"
                            ></iframe>
                        </div>
                    </div>
                    <div>
                         <ContactForm isPage={true} reference={reference} />
                    </div>
                </div>
             </div>
        </div>
    );
};

export default ContactPage;