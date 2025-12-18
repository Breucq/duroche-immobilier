import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: 'jvrtf17r',
  dataset: 'production',
  useCdn: false, // On veut les données fraîches pour le partage
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

/**
 * Extrait du texte brut à partir du Portable Text Sanity
 */
function toPlainText(blocks = []) {
  if (!Array.isArray(blocks)) return blocks || '';
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
}

export default async function handler(request, response) {
  // Configuration CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');

  const { ref } = request.query;

  if (!ref) {
    return response.status(400).send('Reference manquante');
  }

  try {
    // On cherche le bien par référence ou ID
    const query = `*[_type == "property" && (reference == $ref || _id == $ref)][0]{
      _id,
      type,
      location,
      price,
      area,
      bedrooms,
      description,
      image,
      characteristics
    }`;
    
    const property = await client.fetch(query, { ref });

    if (!property) {
        // Redirection vers la liste si non trouvé
        return response.redirect(307, '/properties');
    }

    // --- Construction des données SEO ---
    const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price);
    const city = property.location ? property.location.split(',')[0].trim() : 'Vaucluse';

    // Extraction de la description (String ou Portable Text)
    let rawDescription = '';
    if (typeof property.description === 'string') {
        rawDescription = property.description;
    } else if (Array.isArray(property.description)) {
        rawDescription = toPlainText(property.description);
    }

    const cleanDescription = rawDescription.replace(/\s+/g, ' ').trim();
    const description = cleanDescription.length > 160 
        ? cleanDescription.substring(0, 157) + '...' 
        : cleanDescription || `Découvrez ce bien d'exception à ${property.location} au prix de ${formattedPrice}.`;

    // Atouts pour le titre
    const keyAmenities = [];
    if (property.characteristics) {
        const allChars = [
            ...(property.characteristics.exterior || []),
            ...(property.characteristics.general || []),
            ...(property.characteristics.land || [])
        ];
        if (allChars.some(c => c.toLowerCase().includes('piscine'))) keyAmenities.push('Piscine');
        if (allChars.some(c => c.toLowerCase().includes('jardin'))) keyAmenities.push('Jardin');
        if (allChars.some(c => c.toLowerCase().includes('garage'))) keyAmenities.push('Garage');
    }
    
    const amenitiesString = keyAmenities.length > 0 ? ` - ${keyAmenities.join(' - ')}` : '';
    const title = `${property.type} à ${city}${property.area ? ` - ${property.area}m²` : ''}${property.bedrooms ? ` - ${property.bedrooms} ch.` : ''}${amenitiesString} | Duroche Immobilier`;

    // Image (Optimisée pour les réseaux sociaux 1200x630)
    let imageUrl = 'https://cdn.sanity.io/images/jvrtf17r/production/b5a4529d38c642277c0827137f88467472097973-1920x1080.jpg?fm=jpg';
    if (property.image) {
        try {
            imageUrl = urlFor(property.image).width(1200).height(630).fit('crop').format('jpg').url();
        } catch (e) {
            console.error('Erreur transformation image:', e);
        }
    }

    // URL de redirection finale
    const finalDestinationUrl = `https://www.duroche.fr/properties/${ref}`;
    const proxyUrl = `https://www.duroche.fr/api/share?ref=${ref}`;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:site_name" content="Duroche Immobilier" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${proxyUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">

    <script type="text/javascript">
        window.location.href = "${finalDestinationUrl}";
    </script>
</head>
<body>
    <h1>${title}</h1>
    <p>${description}</p>
    <img src="${imageUrl}" alt="${title}" />
    <p>Redirection en cours vers <a href="${finalDestinationUrl}">la fiche du bien</a>...</p>
</body>
</html>`;

    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    return response.status(200).send(html);

  } catch (error) {
    console.error('Erreur share API:', error);
    return response.status(500).send('Erreur serveur lors de la génération du partage');
  }
}