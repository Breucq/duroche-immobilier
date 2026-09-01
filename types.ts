

/**
 * Extension de l'interface Window pour Google Analytics
 */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Représente un bien immobilier tel que retourné par Sanity.
 */
export interface Property {
  _id: string;
  _createdAt: string;
  publicationDate?: string;
  reference?: string;
  legacyReferences?: string[];
  image: SanityImage;
  images: SanityImage[];
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  area: number;
  landArea?: number; // Surface du terrain
  description: string | any[]; // String (Legacy) ou PortableText Array
  virtualTourUrl?: string;
  
  status?: 'Disponible' | 'Nouveautés' | 'Sous offre' | 'Vendu' | 'Privé';
  isHidden?: boolean;
  isPrivate?: boolean;
  accessPassword?: string;

  details?: {
    yearBuilt: number;
    condition: 'À rénover' | 'Bon état' | 'Excellent état' | 'Neuf';
    heating: string[]; // Modifié pour accepter plusieurs valeurs
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
  format?: 'richText' | 'html';
  content: any; // Portable Text array si richText
  contentHtml?: string; // String HTML brut si html
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
    googleReviewUrl?: string;
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
    metaTitle?: string;
    metaDescription?: string;
    title: string;
    subtitle: string;
    reassuranceBadge?: string;
    whyUsCards?: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    steps?: Array<{
        stepNumber: string;
        title: string;
        description: string;
    }>;
    faq?: Array<{
        question: string;
        answer: string;
    }>;
}

/**
 * Paramètres de contenu de la page Vendre tel que retourné par Sanity.
 */
export interface SellingPageSettings {
    metaTitle?: string;
    metaDescription?: string;
    heroBadge?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroStats?: Array<{
        value: string;
        label: string;
    }>;
    pillarsTitle?: string;
    pillarsSubtitle?: string;
    pillars?: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    stepsTitle?: string;
    stepsSubtitle?: string;
    steps?: Array<{
        stepNumber: string;
        title: string;
        description: string;
    }>;
    faqTitle?: string;
    faqSubtitle?: string;
    faq?: Array<{
        question: string;
        answer: string;
    }>;
}

/**
 * Paramètres de contenu de la page Contact tel que retourné par Sanity.
 */
export interface ContactPageSettings {
    metaTitle?: string;
    metaDescription?: string;
    title?: string;
    introText?: string;
    phone?: string;
    googleBusinessUrl?: string;
    advisors?: Array<{
        name: string;
        role: string;
        phone?: string;
        email?: string;
    }>;
    generalEmail?: string;
    address?: string;
    reassuranceBlocks?: Array<{
        title: string;
        text: string;
        linkText?: string;
        linkUrl?: string;
        badge?: string;
    }>;
    interventionZones?: string;
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

/**
 * Représente un avis client / avis Google
 */
export interface Review {
  _id: string;
  author: string;
  role?: string;
  rating: number;
  text: string;
  date?: string;
  isGoogleReview?: boolean;
}

/**
 * Représente un guide de présentation SEO / GEO d'une ville (Sanity)
 */
export interface CityGuide {
  _id: string;
  cityName: string;
  slug?: { current: string };
  postalCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  title: string;
  subtitle?: string;
  coverImage?: SanityImage;
  intro?: string;
  content?: any; // PortableText
  keyPoints?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}
