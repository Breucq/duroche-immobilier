import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    Phone, 
    Mail, 
    MapPin, 
    ExternalLink, 
    TrendingUp, 
    ShieldCheck, 
    Award, 
    CheckCircle,
    UserCheck
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { contactPageSettingsService } from '../services/contactPageSettingsService';
import type { ContactPageSettings } from '../types';

const defaultSettings: ContactPageSettings = {
    metaTitle: 'Contact Duroche Immobilier | Conseillers Immobiliers Orange & Haut-Vaucluse',
    metaDescription: 'Besoin d\'un conseil ou d\'une estimation ? Contactez Sylvie Roche & Thomas Dubreucq (Duroche Immobilier). Accompagnement sur mesure à Orange, Caderousse et leurs environs.',
    title: 'Contactez votre Duo Immobilier dans le Haut-Vaucluse',
    introText: 'Vous avez un projet d\'achat, de vente ou besoin d\'un conseil technique sur votre bien ? Sylvie Roche et Thomas Dubreucq vous accompagnent à Orange, Caderousse, Piolenc, Courthézon et dans l\'ensemble du secteur du Haut-Vaucluse, ainsi qu\'à distance pour vos projets en Corse ou à Paris.\n\nRemplissez le formulaire ci-dessous ou contactez-nous directement par téléphone pour échanger sur vos besoins.',
    phone: '07 60 31 37 55',
    googleBusinessUrl: 'https://maps.google.com/?q=Duroche+Immobilier+Orange',
    advisors: [
        {
            name: 'Sylvie Roche',
            role: 'Expertise Bâtiment & Technique',
            email: 'sylvie.roche@duroche.fr',
        },
        {
            name: 'Thomas Dubreucq',
            role: 'Marketing & Commercialisation',
            email: 'thomas.dubreucq@duroche.fr',
        },
    ],
    generalEmail: 'contact@duroche.fr',
    address: 'Orange, 84100 (Haut-Vaucluse)',
    reassuranceBlocks: [
        {
            title: 'Vous souhaitez vendre votre bien ?',
            text: 'Vous voulez connaître la valeur réelle de votre maison ou appartement ? Faites une demande d\'évaluation complète en 24h à 48h.',
            linkText: 'Demander une estimation offerte',
            linkUrl: '/estimation',
            badge: 'Estimation 100% Offerte',
        },
        {
            title: 'Notre Réseau & Vos Garanties',
            text: 'Affiliés au réseau national Expertimo, nous diffusons vos biens sur plus de 300 portails immobiliers et auprès de notre réseau d\'acheteurs qualifiés.',
            linkText: 'Découvrir notre méthode de vente',
            linkUrl: '/vendre',
            badge: 'Diffusion Maximale',
        },
    ],
    interventionZones: 'Orange (84100), Caderousse (84860), Piolenc (84850), Courthézon (84350), Jonquières, Camaret-sur-Aigues, Uchaux, Mornas, Sérignan-du-Comtat, Châteauneuf-du-Pape.',
};

const ContactPage: React.FC = () => {
    const { reference } = useParams<{ reference: string }>();
    const [settings, setSettings] = useState<ContactPageSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await contactPageSettingsService.getSettings();
                if (data) {
                    setSettings({
                        ...defaultSettings,
                        ...data,
                        advisors: data.advisors && data.advisors.length > 0 ? data.advisors : defaultSettings.advisors,
                        reassuranceBlocks: data.reassuranceBlocks && data.reassuranceBlocks.length > 0 ? data.reassuranceBlocks : defaultSettings.reassuranceBlocks,
                    });
                }
            } catch (err) {
                console.error("Erreur chargement page contact:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Schéma JSON-LD RealEstateAgent pour Google SEO Local
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Duroche Immobilier",
        "description": settings.metaDescription || defaultSettings.metaDescription,
        "url": "https://www.duroche.fr/contact",
        "telephone": "+33760313755",
        "email": settings.generalEmail || "contact@duroche.fr",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Orange",
            "postalCode": "84100",
            "addressRegion": "Vaucluse",
            "addressCountry": "FR"
        },
        "areaServed": [
            "Orange", "Caderousse", "Piolenc", "Courthézon", "Jonquières", "Camaret-sur-Aigues", "Uchaux", "Mornas"
        ],
        "employee": [
            {
                "@type": "Person",
                "name": "Sylvie Roche",
                "jobTitle": "Conseillère en Immobilier & Expertise Technique"
            },
            {
                "@type": "Person",
                "name": "Thomas Dubreucq",
                "jobTitle": "Conseiller en Immobilier & Marketing"
            }
        ]
    };

    return (
        <div className="bg-background min-h-screen">
            <Helmet>
                <title>{settings.metaTitle || defaultSettings.metaTitle}</title>
                <meta name="description" content={settings.metaDescription || defaultSettings.metaDescription} />
                <link rel="canonical" href="https://www.duroche.fr/contact" />
                <meta property="og:title" content={settings.metaTitle || defaultSettings.metaTitle} />
                <meta property="og:description" content={settings.metaDescription || defaultSettings.metaDescription} />
                <meta property="og:url" content="https://www.duroche.fr/contact" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                
                {/* En-tête de la page */}
                <div className="text-center pt-6 mb-12 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-xs tracking-wider uppercase mb-3">
                        <Award className="w-3.5 h-3.5" />
                        Accompagnement Sur Mesure
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-primary-text leading-tight tracking-tight">
                        {settings.title || defaultSettings.title}
                    </h1>
                    <div className="mt-4 text-base sm:text-lg text-secondary-text leading-relaxed whitespace-pre-line">
                        {settings.introText || defaultSettings.introText}
                    </div>
                </div>

                {/* Section Principale : Coordonnées & Formulaire */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
                    
                    {/* Colonne gauche (5/12) : Contact direct, Conseillers, Google Map */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Carte Contact Direct & Conseillers */}
                        <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-border-color">
                            <div className="flex items-center justify-between pb-3 border-b border-border-color/60 mb-5">
                                <h2 className="text-xl font-heading font-semibold text-primary-text">
                                    Nous Appeler
                                </h2>
                                <span className="text-xs font-normal text-green-700 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-green-200">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Disponibles 7j/7
                                </span>
                            </div>

                            {/* Bouton d'appel direct unique 07 */}
                            <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 text-center sm:text-left">
                                <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-1">
                                    Ligne directe de l'agence
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                                    <div>
                                        <a 
                                            href={`tel:${(settings.phone || '07 60 31 37 55').replace(/\s+/g, '')}`}
                                            className="text-2xl font-bold font-heading text-primary-text hover:text-accent transition-colors block"
                                        >
                                            {settings.phone || '07 60 31 37 55'}
                                        </a>
                                        <span className="text-xs text-secondary-text">Appel non surtaxé</span>
                                    </div>
                                    <a 
                                        href={`tel:${(settings.phone || '07 60 31 37 55').replace(/\s+/g, '')}`}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg shadow-sm transition-all text-sm"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>Appeler direct</span>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Les Conseillers */}
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text mb-3">
                                Vos Interlocuteurs Dédiés
                            </h3>
                            <div className="space-y-3">
                                {(settings.advisors || defaultSettings.advisors || []).map((advisor, index) => (
                                    <div key={index} className="p-3.5 rounded-xl bg-background border border-border-color/70 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-heading font-bold text-primary-text text-sm flex items-center gap-1.5">
                                                <UserCheck className="w-3.5 h-3.5 text-accent" />
                                                {advisor.name}
                                            </h4>
                                            <p className="text-xs text-secondary-text mt-0.5">
                                                {advisor.role}
                                            </p>
                                        </div>
                                        {advisor.email && (
                                            <a 
                                                href={`mailto:${advisor.email}`}
                                                className="inline-flex items-center gap-1 text-xs text-secondary-text hover:text-accent transition-colors bg-white px-2.5 py-1.5 rounded-md border border-border-color/60 hover:border-accent/40"
                                                title={`Envoyer un email à ${advisor.name}`}
                                            >
                                                <Mail className="w-3 h-3 text-accent" />
                                                <span>Email</span>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Contact Général */}
                            <div className="mt-5 pt-4 border-t border-border-color/60 text-sm space-y-2 text-secondary-text">
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span>E-mail :</span>
                                    <a href={`mailto:${settings.generalEmail || 'contact@duroche.fr'}`} className="text-primary-text font-medium hover:text-accent underline transition-colors">
                                        {settings.generalEmail || 'contact@duroche.fr'}
                                    </a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span>Secteur principal :</span>
                                    <span className="text-primary-text font-medium">{settings.address || 'Orange (84100) & Haut-Vaucluse'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Carte Interactive & Google Business Profile */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-color">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-heading font-semibold text-primary-text">
                                    Localisation & Zone d'activité
                                </h3>
                                {settings.googleBusinessUrl && (
                                    <a 
                                        href={settings.googleBusinessUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        <span>Fiche Google Business</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                            
                            <div className="rounded-xl overflow-hidden shadow-inner border border-border-color">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45842.83151829902!2d4.781681!3d44.136214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b5823e24b25f8d%3A0x40819a5c990b450!2sOrange!5e0!3m2!1sfr!2sfr!4v1677324322451!5m2!1sfr!2sfr"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Carte de localisation de l'agence à Orange"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* Colonne droite (7/12) : Formulaire Optimisé */}
                    <div className="lg:col-span-7">
                        <ContactForm isPage={true} reference={reference} />
                    </div>

                </div>

                {/* Section Maillage de Réassurance (3 blocs d'accès rapide) */}
                <div className="max-w-6xl mx-auto pt-8 border-t border-border-color">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {(settings.reassuranceBlocks || defaultSettings.reassuranceBlocks || []).map((block, idx) => (
                            <div key={idx} className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-border-color flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    {block.badge && (
                                        <span className="inline-block px-2.5 py-1 text-xs font-semibold text-accent bg-accent/10 rounded-md mb-3">
                                            {block.badge}
                                        </span>
                                    )}
                                    <h3 className="text-xl font-heading font-semibold text-primary-text mb-2">
                                        {block.title}
                                    </h3>
                                    <p className="text-secondary-text text-sm leading-relaxed mb-4">
                                        {block.text}
                                    </p>
                                </div>
                                {block.linkUrl && (
                                    <div>
                                        {block.linkUrl.startsWith('http') ? (
                                            <a 
                                                href={block.linkUrl}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition-colors group"
                                            >
                                                <span>{block.linkText || 'En savoir plus'}</span>
                                                <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                            </a>
                                        ) : (
                                            <Link 
                                                to={block.linkUrl} 
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition-colors group"
                                            >
                                                <span>{block.linkText || 'En savoir plus'}</span>
                                                <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bloc Communes d'intervention (SEO Footprint) */}
                    <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-border-color">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-base font-heading font-bold text-primary-text mb-1.5">
                                    Communes & Secteurs d'intervention dans le Haut-Vaucluse
                                </h4>
                                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                                    {settings.interventionZones || defaultSettings.interventionZones}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
