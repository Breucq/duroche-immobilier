import { client } from './sanityClient';
import type { Property } from '../types';

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

export const propertyService = {
  async getAll(): Promise<Property[]> {
    const query = `*[_type == "property"] | order(publicationDate desc) { ${propertyFields} }`;
    return client.fetch(query);
  },

  async getActive(): Promise<Property[]> {
    const query = `*[_type == "property" && isHidden != true && status != "Vendu"] | order(publicationDate desc) { ${propertyFields} }`;
    return client.fetch(query);
  },

  async getSold(): Promise<Property[]> {
    const query = `*[_type == "property" && status == "Vendu"] | order(publicationDate desc) { ${propertyFields} }`;
    return client.fetch(query);
  },

  async getById(id: string): Promise<Property | null> {
    const query = `*[_type == "property" && _id == $id][0] { ${propertyFields} }`;
    return client.fetch(query, { id });
  },

  /**
   * Récupère un bien par sa référence OU son ID.
   * Cette méthode est sécurisée : elle cherche une correspondance exacte soit avec le champ 'reference',
   * soit avec le champ système '_id'.
   */
  async getByReference(refOrId: string): Promise<Property | null> {
    const query = `*[_type == "property" && (reference == $ref || _id == $ref)][0] { ${propertyFields} }`;
    return client.fetch(query, { ref: refOrId });
  },

  async getByIds(ids: string[]): Promise<Property[]> {
    const query = `*[_type == "property" && _id in $ids] { ${propertyFields} }`;
    return client.fetch(query, { ids });
  },
  
  async getSimilar(property: Property): Promise<{ sameLocation: Property[], sameType: Property[] }> {
    if (!property) return { sameLocation: [], sameType: [] };

    const city = property.location.split(',')[0].trim();
    
    const sameLocationQuery = `*[_type == "property" && _id != $id && location match $city && isHidden != true && status != "Vendu"] | order(publicationDate desc) [0...5] { ${propertyFields} }`;
    const sameTypeQuery = `*[_type == "property" && _id != $id && type == $type && isHidden != true && status != "Vendu"] | order(publicationDate desc) [0...5] { ${propertyFields} }`;

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
      
      // Extraction et déduplication des villes (ex: "Orange, 84100" -> "Orange")
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