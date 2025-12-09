import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(request, response) {
  const { url } = request.query;

  if (!url) {
    return response.status(400).json({ error: 'URL manquante' });
  }

  try {
    // 1. Récupérer le HTML de la page cible (en se faisant passer pour un navigateur classique)
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // 2. Charger le HTML dans Cheerio
    const $ = cheerio.load(data);

    // 3. Extraction intelligente (basée sur la structure Groupement Immo et standards)
    
    // Titre (Souvent H1)
    const title = $('h1').first().text().trim();

    // Prix (Recherche d'un format prix dans les classes courantes ou le texte)
    let price = 0;
    const priceText = $('.price, .prix, .detail-price').text() || $('body').text().match(/[0-9\s]+€/)?.[0] || '';
    if (priceText) {
      price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
    }

    // Description
    let description = $('.detail-desc, .description, #description').text().trim();
    // Nettoyage description
    description = description.replace(/\s+/g, ' ').trim();

    // Référence
    const reference = $('body').text().match(/Ref\s?:\s?([A-Z0-9-]+)/i)?.[1] || '';

    // Images (Recherche des balises meta og:image ou slider)
    const images = [];
    $('meta[property="og:image"]').each((_, el) => {
      images.push($(el).attr('content'));
    });
    // Fallback si pas d'OG image, on cherche les images du slider
    if (images.length === 0) {
        $('.slider img, .gallery img').each((_, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && src.startsWith('http')) images.push(src);
        });
    }

    // Caractéristiques (Extraction depuis les tables ou listes)
    let surface = 0;
    let rooms = 0;
    let bedrooms = 0;
    let location = '';

    // Analyse du texte brut pour trouver des motifs "115 m²", "3 chambres"
    const bodyText = $('body').text();
    
    const surfaceMatch = bodyText.match(/([0-9]+)\s?m²/i);
    if (surfaceMatch) surface = parseInt(surfaceMatch[1], 10);

    const roomsMatch = bodyText.match(/([0-9]+)\s?pièce/i);
    if (roomsMatch) rooms = parseInt(roomsMatch[1], 10);

    const bedroomsMatch = bodyText.match(/([0-9]+)\s?chambre/i);
    if (bedroomsMatch) bedrooms = parseInt(bedroomsMatch[1], 10);

    // Tentative de trouver la ville dans le titre ou fil d'ariane
    const cityMatch = title.match(/(Orange|Caderousse|Piolenc|Jonquières|Uchaux|Camaret)/i);
    if (cityMatch) location = cityMatch[0];

    // Déduction du type
    let type = 'Maison';
    if (title.toLowerCase().includes('appartement')) type = 'Appartement';
    if (title.toLowerCase().includes('terrain')) type = 'Terrain';

    return response.status(200).json({
      title,
      price,
      description,
      reference,
      images: [...new Set(images)], // Uniques
      surface,
      rooms,
      bedrooms,
      location,
      type
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return response.status(500).json({ error: 'Erreur lors de l\'analyse de la page. Vérifiez l\'URL.' });
  }
}