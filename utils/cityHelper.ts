import type { CityGuide } from '../types';

/**
 * Normalise et transforme un nom de ville en slug URL SEO propre (sans accents, sans caractères spéciaux).
 * Exemple: "Camaret-sur-Aigues" -> "camaret-sur-aigues"
 * Exemple: "Sérignan-du-Comtat" -> "serignan-du-comtat"
 * Exemple: "Sainte-Cécile-les-Vignes" -> "sainte-cecile-les-vignes"
 */
export function slugifyCity(cityName: string): string {
  if (!cityName) return '';
  return cityName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '');        // Supprime les tirets au début et à la fin
}

/**
 * Liste des villes principales du secteur d'intervention Duroche Immobilier (Vaucluse Nord & Environs)
 * avec leur formatage et code postal de référence.
 */
export const KNOWN_CITIES: Array<{ name: string; slug: string; postalCode: string; department: string }> = [
  { name: 'Piolenc', slug: 'piolenc', postalCode: '84420', department: 'Vaucluse' },
  { name: 'Camaret-sur-Aigues', slug: 'camaret-sur-aigues', postalCode: '84850', department: 'Vaucluse' },
  { name: 'Orange', slug: 'orange', postalCode: '84100', department: 'Vaucluse' },
  { name: 'Caderousse', slug: 'caderousse', postalCode: '84860', department: 'Vaucluse' },
  { name: 'Sérignan-du-Comtat', slug: 'serignan-du-comtat', postalCode: '84830', department: 'Vaucluse' },
  { name: 'Mornas', slug: 'mornas', postalCode: '84550', department: 'Vaucluse' },
  { name: 'Sainte-Cécile-les-Vignes', slug: 'sainte-cecile-les-vignes', postalCode: '84290', department: 'Vaucluse' },
  { name: 'Bollène', slug: 'bollene', postalCode: '84500', department: 'Vaucluse' },
  { name: 'Uchaux', slug: 'uchaux', postalCode: '84100', department: 'Vaucluse' },
  { name: 'Jonquières', slug: 'jonquieres', postalCode: '84150', department: 'Vaucluse' },
  { name: 'Mondragon', slug: 'mondragon', postalCode: '84430', department: 'Vaucluse' },
  { name: 'Courthézon', slug: 'courthezon', postalCode: '84350', department: 'Vaucluse' },
  { name: 'Châteauneuf-du-Pape', slug: 'chateauneuf-du-pape', postalCode: '84230', department: 'Vaucluse' },
  { name: 'Violès', slug: 'violes', postalCode: '84150', department: 'Vaucluse' },
  { name: 'Travaillan', slug: 'travaillan', postalCode: '84850', department: 'Vaucluse' },
  { name: 'Rasteau', slug: 'rasteau', postalCode: '84110', department: 'Vaucluse' },
  { name: 'Cairanne', slug: 'cairanne', postalCode: '84290', department: 'Vaucluse' },
  { name: 'Lapalud', slug: 'lapalud', postalCode: '84840', department: 'Vaucluse' },
  { name: 'Lamotte-du-Rhône', slug: 'lamotte-du-rhone', postalCode: '84840', department: 'Vaucluse' },
  { name: 'Lagarde-Paréol', slug: 'lagarde-pareol', postalCode: '84290', department: 'Vaucluse' },
  { name: 'Vaison-la-Romaine', slug: 'vaison-la-romaine', postalCode: '84110', department: 'Vaucluse' },
];

/**
 * Retrouve le nom d'affichage propre d'une ville à partir d'un slug
 */
export function getCityDisplayName(slug: string, cityGuide?: CityGuide | null): string {
  if (cityGuide?.cityName) return cityGuide.cityName;

  const normalizedSlug = slugifyCity(slug);
  const known = KNOWN_CITIES.find(c => c.slug === normalizedSlug);
  if (known) return known.name;

  // Reformatage intelligent (tirets en espaces avec majuscules)
  return slug
    .split('-')
    .map(word => {
      if (['sur', 'du', 'les', 'la', 'le', 'de', 'des', 'en', 'sous'].includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('-');
}

/**
 * Vérifie si la localisation d'un bien (ex: "Piolenc, 84420" ou "Camaret sur Aigues") correspond à la ville ciblée.
 */
export function propertyMatchesCity(propertyLocation: string | undefined, targetCityOrSlug: string): boolean {
  if (!propertyLocation || !targetCityOrSlug) return false;
  
  const cleanLoc = slugifyCity(propertyLocation.split(',')[0].trim());
  const cleanTarget = slugifyCity(targetCityOrSlug);

  return cleanLoc.includes(cleanTarget) || cleanTarget.includes(cleanLoc);
}
