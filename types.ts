

/**
 * Représente un bien immobilier tel que retourné par Sanity.
 */
export interface Property {
  _id: string;
  _createdAt: string;
  publicationDate?: string;
  reference?: string;
  image: SanityImage;
  images: SanityImage[];
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  area: number;
  description: string;
  virtualTourUrl?: string;
  
  status?: 'Disponible' | 'Nouveautés' | 'Sous offre' | 'Vendu';
  isHidden?: boolean;

  details?: {
    yearBuilt: number;
    condition: 'À rénover' | 'Bon état' | 'Excellent état' | 'Neuf';
    heating: 'Gaz' | 'Électrique' | 'Fioul' | 'Pompe à chaleur' | 'Aucun';
    levels: number;
    availability: string;
  };

  dpe?: {
    class: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
    value: number;
  };

  ges?: {
    class: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
    value: number;
  };

  characteristics?: {
    general?: string[];
    interior?: string[];
    exterior?: string[];
    equipment?: string[];
    commercial?: string[];
    land?: string[];
  };

  financials?: {
    propertyTax?: number;
    condoFees?: number;
    agencyFees: string;
  };

  coOwnership?: {
    isCoOwnership: boolean;
    numberOfLots?: number;
    proceedings?: 'Oui' | 'Non' | 'Non applicable';
  };

  risks?: string;
}

/**
 * Représente un article de blog tel que retourné par Sanity.
 */
export interface Article {
  _id: string;
  slug: { current: string };
  title: string;
  author: string;
  date: string;
  image: SanityImage;
  summary: string;
  content: string; // Ou type Portable Text si utilisé
}

/**
 * Représente une page de contenu dynamique tel que retourné par Sanity.
 */
export interface Page {
    _id: string;
    slug: { current: string };
    title: string;
    subtitle?: string;
    coverImage?: SanityImage; // URL ou objet image
    content: any; // Portable Text array
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    showInHeader: boolean;
    showInFooter: boolean;
}

/**
 * Paramètres généraux du site tel que retourné par Sanity.
 */
export interface SiteSettings {
    title: string;
    description: string;
    logo: string; // URL de l'image
    footerLogo: string; // URL de l'image
    favicon: string; // URL de l'image
    maintenanceMode?: boolean;
}

/**
 * Type pour les icônes de service disponibles.
 */
export type ServiceIcon = 'KeyIcon' | 'BuildingStorefrontIcon' | 'ChartBarIcon';

/**
 * Représente un service dans les paramètres de la page d'accueil (Sanity).
 */
export interface Service {
  _key: string;
  icon: SanityImage; // Changé de string (enum) à SanityImage pour upload personnalisé
  title: string;
  description: string;
}

/**
 * Paramètres de contenu de la page d'accueil tel que retourné par Sanity.
 */
export interface HomePageSettings {
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    heroBackgroundImage: string; // URL de l'image
    propertiesTitle: string;
    propertiesSubtitle: string;
    servicesTitle: string;
    servicesSubtitle: string;
    services: Service[];
    zonesTitle: string;
    zonesSubtitle: string;
    zones: string;
    contactTitle: string;
    contactSubtitle: string;
    estimationTitle: string;
    estimationSubtitle: string;
    estimationButtonText: string;
    estimationBackgroundImage: string; // URL de l'image
}

/**
 * Paramètres de contenu du pied de page tel que retourné par Sanity.
 */
export interface FooterSettings {
    description: string;
    email: string;
    phone: string;
    address: string;
    facebookUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    youtubeUrl: string;
    copyright: string;
    professionalCardLogo: string; // URL de l'image
    professionalCardNumber: string;
}

/**
 * Paramètres de contenu de la page d'estimation tel que retourné par Sanity.
 */
export interface EstimationPageSettings {
    title: string;
    subtitle: string;
}

/**
 * Représente une alerte e-mail (gérée localement).
 */
export interface Alert {
    id: number;
    email: string;
    criteria: {
        searchTerm: string;
        propertyType: string;
        maxPrice: string;
        bedrooms: string;
        minArea: string;
        amenities: {
            pool: boolean;
            garden: boolean;
            garage: boolean;
            terrace: boolean;
            cellar: boolean;
        };
    };
    createdAt: string;
}

/**
 * Représente un objet image retourné par l'API de Sanity.
 */
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}