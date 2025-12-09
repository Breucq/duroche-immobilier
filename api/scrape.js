import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(request, response) {
  // Configuration CORS pour autoriser les requêtes venant de Sanity Studio
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*'); // Pour la prod, remplacez '*' par votre URL Sanity (ex: https://duroche-immobilier.sanity.studio)
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Gestion de la requête pré-vol (OPTIONS)
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { url } = request.query;

  if (!url) {
    return response.status(400).json({ error: 'URL manquante' });
  }

  try {
    // 1. Récupérer le HTML de la page cible
    const { data } = await axios.get(url, {
      headers: {
        // User-Agent réaliste pour éviter les blocages
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    // 2. Charger le HTML dans Cheerio
    const $ = cheerio.load(data);

    // 3. Extraction intelligente
    
    // Titre
    const title = $('h1').first().text().trim() || $('title').text().trim();

    // Prix
    let price = 0;
    // On cherche dans les classes communes ou via regex dans le body
    const priceText = $('.price, .prix, .detail-price, .item-price').text() || $('body').text();
    const priceMatch = priceText.match(/([0-9\s.,]+)\s?€/);
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/[^0-9]/g, ''), 10);
    }

    // Description
    let description = $('.detail-desc, .description, #description, .text-description, [itemprop="description"]').text().trim();
    description = description.replace(/\s+/g, ' ').trim();

    // Référence
    const reference = $('body').text().match(/Ref\.?\s?:\s?([A-Z0-9-]+)/i)?.[1] || '';

    // Images
    const images = [];
    // Priorité aux meta tags OG
    $('meta[property="og:image"]').each((_, el) => {
      const img = $(el).attr('content');
      if (img) images.push(img);
    });
    // Fallback: slider ou galerie
    if (images.length === 0) {
        $('.slider img, .gallery img, .carousel img, .swiper-slide img').each((_, el) => {
            let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy');
            if (src && src.startsWith('http')) images.push(src);
        });
    }

    // Caractéristiques via Regex sur le texte complet (plus robuste que les sélecteurs CSS variables)
    const bodyText = $('body').text();
    
    let surface = 0;
    const surfaceMatch = bodyText.match(/([0-9]+)\s?m²(?!\s?terrain)/i); // m² mais pas "m² terrain"
    if (surfaceMatch) surface = parseInt(surfaceMatch[1], 10);

    let rooms = 0;
    const roomsMatch = bodyText.match(/([0-9]+)\s?pièce/i);
    if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);

    let bedrooms = 0;
    const bedroomsMatch = bodyText.match(/([0-9]+)\s?chambre/i);
    if (bedroomsMatch) bedrooms = parseInt(bedroomsMatch[1], 10);

    // Localisation
    let location = '';
    const cityMatch = title.match(/(Orange|Caderousse|Piolenc|Jonquières|Uchaux|Camaret|Sérignan|Mornas)/i);
    if (cityMatch) location = cityMatch[0];

    // Type
    let type = 'Maison';
    if (title.toLowerCase().includes('appartement')) type = 'Appartement';
    if (title.toLowerCase().includes('terrain')) type = 'Terrain';
    if (title.toLowerCase().includes('immeuble')) type = 'Autre';

    return response.status(200).json({
      title,
      price,
      description,
      reference,
      images: [...new Set(images)].slice(0, 10), // Limite à 10 images uniques
      surface,
      rooms,
      bedrooms,
      location: location || 'Vaucluse',
      type
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return response.status(500).json({ error: 'Erreur lors de l\'analyse de la page. Vérifiez l\'URL.' });
  }
}