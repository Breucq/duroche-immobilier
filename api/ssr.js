import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Client Sanity optimisé pour le rendu serveur
const client = createClient({
  projectId: 'jvrtf17r',
  dataset: 'production',
  useCdn: true, // CDN pour réponse instantanée < 50ms
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
  if (!source) return null;
  return builder.image(source);
}

function toPlainText(blocks = []) {
  if (!Array.isArray(blocks)) return blocks || '';
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map((child) => child.text).join('');
    })
    .join(' ');
}

// Données postales des villes phares du Vaucluse
const CITY_POSTAL_CODES = {
  orange: '84100',
  caderousse: '84860',
  piolenc: '84420',
  'camaret-sur-aigues': '84850',
  'serignan-du-comtat': '84830',
  mornas: '84550',
  'sainte-cecile-les-vignes': '84290',
  bollene: '84500',
  uchaux: '84100',
  jonquieres: '84150',
  mondragon: '84430',
  courthezon: '84350',
  'chateauneuf-du-pape': '84230',
  violes: '84150',
  travaillan: '84850',
  rasteau: '84110',
  cairanne: '84290',
  lapalud: '84840',
  'lamotte-du-rhone': '84840',
  'lagarde-pareol': '84290',
  'vaison-la-romaine': '84110',
};

function formatCityName(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(' Sur ', '-sur-')
    .replace(' Du ', '-du-')
    .replace(' Les ', '-les-')
    .replace(' La ', '-la-');
}

export default async function handler(request, response) {
  try {
    // 1. Détermination du chemin demandé
    let rawPath = '';
    if (request.query && request.query.path) {
      rawPath = Array.isArray(request.query.path) ? request.query.path.join('/') : request.query.path;
    } else if (request.url) {
      const parsedUrl = new URL(request.url, 'https://www.duroche.fr');
      rawPath = parsedUrl.pathname.replace(/^\/api\/ssr/, '').replace(/^\//, '');
    }

    const cleanPath = rawPath.replace(/^\/+|\/+$/g, '');
    const baseUrl = 'https://www.duroche.fr';
    const canonicalUrl = cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;

    // 2. Définition des valeurs par défaut
    let title = 'Duroche Immobilier | Agence Immobilière Orange & Vaucluse Nord';
    let description = "Expert de l'immobilier dans le Vaucluse Nord. Achat, vente, estimation offerte. Découvrez nos maisons et appartements à Orange, Caderousse, Piolenc et environs.";
    let ogImage = 'https://cdn.sanity.io/images/jvrtf17r/production/b5a4529d38c642277c0827137f88467472097973-1920x1080.jpg?fm=jpg&w=1200&h=630&fit=crop';
    let ogType = 'website';
    let robotsMeta = 'index, follow';
    let jsonLdSchemas = [];

    // Données Schema d'agence locale
    const realEstateAgentSchema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Duroche Immobilier',
      url: 'https://www.duroche.fr',
      logo: 'https://cdn.sanity.io/images/jvrtf17r/production/fcfe23f10ab906658ab09e12607b30e2afa6e0f2-495x119.png',
      image: ogImage,
      telephone: '+33 4 90 00 00 00',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Orange',
        postalCode: '84100',
        addressRegion: 'Vaucluse',
        addressCountry: 'FR',
      },
      areaServed: [
        'Orange',
        'Caderousse',
        'Piolenc',
        'Camaret-sur-Aigues',
        'Sérignan-du-Comtat',
        'Courthézon',
        'Jonquières',
        'Châteauneuf-du-Pape',
        'Bollène',
        'Haut-Vaucluse',
      ],
      priceRange: '€€',
    };

    // 3. Routing et Récupération des données selon la page
    if (!cleanPath || cleanPath === '') {
      // --- ACCUEIL ---
      const homeData = await client.fetch(`*[_id == "homePageSettings" || _type == "homePageSettings"][0]{
        metaTitle,
        metaDescription,
        heroBackgroundImage
      }`);
      if (homeData) {
        if (homeData.metaTitle) title = homeData.metaTitle;
        if (homeData.metaDescription) description = homeData.metaDescription;
        if (homeData.heroBackgroundImage) {
          ogImage = urlFor(homeData.heroBackgroundImage).width(1200).height(630).fit('crop').url();
        }
      }
      jsonLdSchemas.push(realEstateAgentSchema);
    } else if (cleanPath === 'vendre') {
      // --- PAGE VENDRE ---
      const sellData = await client.fetch(`*[_id == "sellingPageSettings" || _type == "sellingPageSettings" || _type == "sellingPage"][0]{
        metaTitle,
        metaDescription,
        faq
      }`);
      title = sellData?.metaTitle || 'Vendre son bien immobilier à Orange & Haut-Vaucluse | Duroche Immobilier';
      description = sellData?.metaDescription || 'Confiez la vente de votre maison ou appartement à Orange, Caderousse, Piolenc à Duroche Immobilier. Estimation juste, diffusion maximale sur +50 portails et accompagnement de A à Z.';
      
      if (sellData?.faq && Array.isArray(sellData.faq) && sellData.faq.length > 0) {
        jsonLdSchemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: sellData.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        });
      }
      jsonLdSchemas.push(realEstateAgentSchema);
    } else if (cleanPath === 'estimation') {
      // --- PAGE ESTIMATION ---
      const estData = await client.fetch(`*[_id == "estimationPageSettings" || _type == "estimationPageSettings"][0]{
        metaTitle,
        metaDescription,
        faq
      }`);
      title = estData?.metaTitle || 'Estimer votre bien immobilier à Orange et environs | Duroche Immobilier';
      description = estData?.metaDescription || 'Obtenez une estimation précise, 100% gratuite et confidentielle de votre maison ou appartement à Orange, Caderousse, Piolenc et Haut-Vaucluse en 2 minutes.';
      
      if (estData?.faq && Array.isArray(estData.faq) && estData.faq.length > 0) {
        jsonLdSchemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: estData.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        });
      }
      jsonLdSchemas.push(realEstateAgentSchema);
    } else if (cleanPath === 'contact') {
      // --- PAGE CONTACT ---
      title = 'Contactez-nous | Duroche Immobilier - Agence Immobilière Orange';
      description = "Contactez Duroche Immobilier, votre expert de l'immobilier dans le Vaucluse Nord. Nous sommes à votre écoute pour vos projets d'achat, vente ou estimation.";
      jsonLdSchemas.push(realEstateAgentSchema);
    } else if (cleanPath === 'properties' || cleanPath === 'nos-biens') {
      // --- CATALOGUE DES BIENS ---
      title = 'Nos Biens Immobiliers à Vendre dans le Vaucluse Nord | Duroche Immobilier';
      description = 'Consultez notre sélection de biens immobiliers à vendre dans le Vaucluse Nord (Orange, Caderousse, Piolenc...). Maisons de village, villas, appartements et terrains.';
      jsonLdSchemas.push(realEstateAgentSchema);
    } else if (cleanPath === 'nos-biens-vendus') {
      // --- BIENS VENDUS ---
      title = 'Nos Références - Biens Vendus dans le Vaucluse Nord | Duroche Immobilier';
      description = 'Découvrez les maisons, villas et appartements récemment vendus par Duroche Immobilier à Orange, Caderousse, Piolenc et environs.';
    } else if (cleanPath.startsWith('properties/')) {
      // --- FICHE DÉTAIL BIEN ---
      const ref = cleanPath.split('/')[1];
      const property = await client.fetch(
        `*[_type == "property" && (reference == $ref || _id == $ref)][0]{
          _id,
          reference,
          type,
          location,
          price,
          area,
          bedrooms,
          description,
          image,
          characteristics,
          dpe
        }`,
        { ref }
      );

      if (property) {
        const city = property.location ? property.location.split(',')[0].trim() : 'Vaucluse';
        const formattedPrice = new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        }).format(property.price);

        title = `${property.type || 'Bien'} à ${city}${property.area ? ` - ${property.area}m²` : ''}${
          property.bedrooms ? ` - ${property.bedrooms} ch.` : ''
        } | Duroche Immobilier`;

        let rawDesc = '';
        if (typeof property.description === 'string') {
          rawDesc = property.description;
        } else if (Array.isArray(property.description)) {
          rawDesc = toPlainText(property.description);
        }
        const cleanDesc = rawDesc.replace(/\s+/g, ' ').trim();
        description =
          cleanDesc.length > 160
            ? cleanDesc.substring(0, 157) + '...'
            : cleanDesc || `Découvrez ce bien d'exception (${property.type}) à ${property.location} au prix de ${formattedPrice}.`;

        if (property.image) {
          try {
            ogImage = urlFor(property.image).width(1200).height(630).fit('crop').url();
          } catch (e) {}
        }

        jsonLdSchemas.push({
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: title,
          description: description,
          url: canonicalUrl,
          image: ogImage,
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
        });
      }
    } else if (cleanPath.startsWith('immobilier-')) {
      // --- LANDING PAGE VILLE SEO ---
      const citySlug = cleanPath.replace('immobilier-', '');
      const cityName = formatCityName(citySlug);
      const postalCode = CITY_POSTAL_CODES[citySlug] || '';
      const postalInfo = postalCode ? ` (${postalCode})` : '';

      title = `Immobilier ${cityName} : Annonces et Maisons à Vendre${postalInfo} | Duroche Immobilier`;
      description = `Découvrez tous les biens immobiliers à vendre à ${cityName}${postalInfo} : maisons de village, villas contemporaines, appartements et terrains. Estimation et conseils experts avec Duroche Immobilier.`;

      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Immobilier ${cityName}`,
            item: canonicalUrl,
          },
        ],
      });
      jsonLdSchemas.push(realEstateAgentSchema);
    } else if (cleanPath === 'blog') {
      // --- LISTE BLOG ---
      title = 'Blog & Conseils Immobiliers dans le Vaucluse | Duroche Immobilier';
      description = "Découvrez nos conseils d'experts, guides d'achat et de vente, et analyses du marché immobilier à Orange et dans le Haut-Vaucluse.";
    } else if (cleanPath.startsWith('blog/')) {
      // --- ARTICLE DE BLOG ---
      const articleSlug = cleanPath.split('/')[1];
      const article = await client.fetch(
        `*[_type == "article" && slug.current == $slug][0]{
          title,
          summary,
          image,
          _createdAt,
          _updatedAt
        }`,
        { slug: articleSlug }
      );

      if (article) {
        title = `${article.title} | Blog Duroche Immobilier`;
        description = article.summary || article.title;
        ogType = 'article';
        if (article.image) {
          try {
            ogImage = urlFor(article.image).width(1200).height(630).fit('crop').url();
          } catch (e) {}
        }

        jsonLdSchemas.push({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: description,
          url: canonicalUrl,
          image: ogImage,
          datePublished: article._createdAt,
          dateModified: article._updatedAt || article._createdAt,
          publisher: {
            '@type': 'Organization',
            name: 'Duroche Immobilier',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cdn.sanity.io/images/jvrtf17r/production/fcfe23f10ab906658ab09e12607b30e2afa6e0f2-495x119.png',
            },
          },
        });
      }
    } else if (cleanPath === 'favorites') {
      // --- FAVORIS (NOINDEX) ---
      title = 'Mes Favoris | Duroche Immobilier';
      description = 'Retrouvez vos biens immobiliers favoris.';
      robotsMeta = 'noindex, follow';
    } else {
      // --- PAGE SANITY GÉNÉRIQUE (mentions légales, barème, etc.) ---
      const pageData = await client.fetch(
        `*[_type == "page" && slug.current == $slug][0]{
          title,
          subtitle,
          metaTitle,
          metaDescription,
          coverImage
        }`,
        { slug: cleanPath }
      );

      if (pageData) {
        title = pageData.metaTitle || `${pageData.title} | Duroche Immobilier`;
        description = pageData.metaDescription || pageData.subtitle || description;
        if (pageData.coverImage) {
          try {
            ogImage = urlFor(pageData.coverImage).width(1200).height(630).fit('crop').url();
          } catch (e) {}
        }
      }
    }

    // 4. Lecture du fichier index.html de base (dist ou root)
    let html = '';
    const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
    const rootIndexPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(distIndexPath)) {
      html = fs.readFileSync(distIndexPath, 'utf8');
    } else if (fs.existsSync(rootIndexPath)) {
      html = fs.readFileSync(rootIndexPath, 'utf8');
    } else {
      html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><div id="root"></div></body></html>`;
    }

    // Nettoyage des balises temporaires pour éviter les doublons
    html = html
      .replace(/<title>.*?<\/title>/gi, '')
      .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
      .replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '')
      .replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '')
      .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');

    // 5. Construction du bloc SEO injecté dans le <head> avant le JS
    const headInjection = `
    <!-- Rendu Serveur SEO (Pré-rendu Head & Métadonnées) -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robotsMeta}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:site_name" content="Duroche Immobilier" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:locale" content="fr_FR" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    ${jsonLdSchemas
      .map(
        (schema) => `
    <script type="application/ld+json">
      ${JSON.stringify(schema)}
    </script>`
      )
      .join('\n')}
    `;

    // Insertion directe dans <head>
    html = html.replace('</head>', `${headInjection}\n</head>`);

    // Pré-rendu du contenu dans <div id="root"> pour l'indexation textuelle immédiate des robots
    const botContent = `
      <header class="main-header"></header>
      <main style="padding: 40px 20px; max-width: 1200px; margin: 0 auto; font-family: sans-serif;">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        <p><a href="https://www.duroche.fr">Duroche Immobilier</a> - Agence immobilière Orange et Vaucluse Nord</p>
      </main>
    `;
    if (html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root">${botContent}</div>`);
    }

    // 6. Envoi de la réponse avec headers de cache optimisés
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
    return response.status(200).send(html);
  } catch (err) {
    console.error('Erreur SSR / Head Injection:', err);
    // En cas d'erreur exceptionnelle, on renvoie index.html standard
    try {
      const fallbackHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      return response.status(200).send(fallbackHtml);
    } catch (e) {
      return response.status(500).send('Erreur serveur');
    }
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
