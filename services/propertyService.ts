import { client } from './sanityClient';
import type { Property } from '../types';

// Champs complets pour la page de détail
const propertyFields = `
  _id,
  _createdAt,
  publicationDate,
  reference,
  "image": image.asset->,
  "images": images[].asset->,
  type,
  price,
  location,
  bedrooms,
  bathrooms,
  rooms,
  area,
  description,
  virtualTourUrl,
  status,
  isHidden,
  details,
  dpe,
  ges,
  characteristics,
  financials,
  coOwnership,
  risks
`;

// Champs réduits pour les cartes (listes) : Gain de performance énorme
const propertyCardFields = `
  _id,
  _createdAt,
  publicationDate,
  reference,
  "image": image.asset->,
  "images": images[0...4].asset->, // On ne charge que les 5 premières images pour le slider au survol
  type,
  price,
  location,
  bedrooms,
  rooms,
  area,
  status,
  isHidden,
  dpe,
  characteristics // Utile pour les filtres (piscine, etc.)
`;

export const propertyService = {
  async getAll(): Promise<Property[]> {
    // Utilisation de cardFields au lieu de propertyFields
    const query = `*[_type == "property"] | order(publicationDate desc) { ${propertyCardFields} }`;
    return client.fetch(query);
  },

  async getActive(): Promise<Property[]> {
    // Utilisation de cardFields
    const query = `*[_type == "property" && isHidden != true && status != "Vendu"] | order(publicationDate desc) { ${propertyCardFields} }`;
    return client.fetch(query);
  },

  async getSold(): Promise<Property[]> {
    // Utilisation de cardFields
    const query = `*[_type == "property" && status == "Vendu"] | order(publicationDate desc) { ${propertyCardFields} }`;
    return client.fetch(query);
  },

  async getById(id: string): Promise<Property | null> {
    // Garde propertyFields (complet) pour le détail
    const query = `*[_type == "property" && _id == $id][0] { ${propertyFields} }`;
    return client.fetch(query, { id });
  },

  /**
   * Récupère un bien par sa référence OU son ID.
   */
  async getByReference(refOrId: string): Promise<Property | null> {
    // Garde propertyFields (complet) pour le détail
    const query = `*[_type == "property" && (reference == $ref || _id == $ref)][0] { ${propertyFields} }`;
    return client.fetch(query, { ref: refOrId });
  },

  async getByIds(ids: string[]): Promise<Property[]> {
    // Card fields pour les favoris
    const query = `*[_type == "property" && _id in $ids] { ${propertyCardFields} }`;
    return client.fetch(query, { ids });
  },
  
  async getSimilar(property: Property): Promise<{ sameLocation: Property[], sameType: Property[] }> {
    if (!property) return { sameLocation: [], sameType: [] };

    const city = property.location.split(',')[0].trim();
    
    // Card fields pour les suggestions similaires
    const sameLocationQuery = `*[_type == "property" && _id != $id && location match $city && isHidden != true && status != "Vendu"] | order(publicationDate desc) [0...5] { ${propertyCardFields} }`;
    const sameTypeQuery = `*[_type == "property" && _id != $id && type == $type && isHidden != true && status != "Vendu"] | order(publicationDate desc) [0...5] { ${propertyCardFields} }`;

    const [sameLocation, sameType] = await Promise.all([
      client.fetch(sameLocationQuery, { id: property._id, city: `*${city}*` }),
      client.fetch(sameTypeQuery, { id: property._id, type: property.type })
    ]);
    
    return { sameLocation, sameType };
  },

  /**
   * Récupère la liste unique des villes où des biens sont actifs.
   */
  async getUniqueLocations(): Promise<string[]> {
      const query = `*[_type == "property" && isHidden != true && status != "Vendu"].location`;
      const locations: string[] = await client.fetch(query);
      
      const uniqueCities = new Set<string>();
      locations.forEach(loc => {
          if (loc) {
              const city = loc.split(',')[0].trim();
              if (city) uniqueCities.add(city);
          }
      });
      return Array.from(uniqueCities).sort();
  }
};