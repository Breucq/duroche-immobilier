import { createClient } from '@sanity/client';

export default async function handler(request, response) {
  const client = createClient({
    projectId: 'jvrtf17r',
    dataset: 'production',
    useCdn: true, // On utilise le CDN pour la rapidité
    apiVersion: '2023-05-03',
  });

  const baseUrl = 'https://www.duroche.fr';
  // Date du jour pour indiquer à Google que les pages statiques sont à jour
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    // 1. Récupération de toutes les routes dynamiques depuis Sanity
    const query = `{
      "properties": *[_type == "property" && status != "Vendu" && isHidden != true] { 
        "ref": reference, 
        _id, 
        location,
        _updatedAt 
      },
      "articles": *[_type == "article"] { 
        "slug": slug.current, 
        _updatedAt 
      },
      "pages": *[_type == "page"] { 
        "slug": slug.current, 
        _updatedAt 
      },
      "cityGuides": *[_type == "cityGuide"] {
        "slug": slug.current,
        cityName,
        _updatedAt
      }
    }`;

    const data = await client.fetch(query);

    // Fonction de slugification pour les villes
    const slugify = (str) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Villes majeures du secteur d'intervention (Vaucluse Nord & Environs)
    const coreSectorSlugs = [
      'piolenc',
      'camaret-sur-aigues',
      'orange',
      'caderousse',
      'serignan-du-comtat',
      'mornas',
      'sainte-cecile-les-vignes',
      'bollene',
      'uchaux',
      'jonquieres',
      'mondragon',
      'courthezon',
      'chateauneuf-du-pape',
      'violes',
      'travaillan',
      'rasteau',
      'cairanne',
      'lapalud',
      'lamotte-du-rhone',
      'lagarde-pareol',
      'vaison-la-romaine'
    ];

    // Collecter l'ensemble des slugs de villes uniques
    const citySlugMap = new Map();

    // 1) Villes du secteur de base
    coreSectorSlugs.forEach(slug => {
      citySlugMap.set(slug, currentDate);
    });

    // 2) Villes des guides Sanity
    if (data.cityGuides && Array.isArray(data.cityGuides)) {
      data.cityGuides.forEach(cg => {
        const slug = cg.slug || slugify(cg.cityName);
        if (slug) {
          const updateDate = cg._updatedAt ? cg._updatedAt.split('T')[0] : currentDate;
          citySlugMap.set(slug, updateDate);
        }
      });
    }

    // 3) Villes extraites des annonces actives
    if (data.properties && Array.isArray(data.properties)) {
      data.properties.forEach(p => {
        if (p.location) {
          const rawCity = p.location.split(',')[0].trim();
          const slug = slugify(rawCity);
          if (slug && !citySlugMap.has(slug)) {
            const updateDate = p._updatedAt ? p._updatedAt.split('T')[0] : currentDate;
            citySlugMap.set(slug, updateDate);
          }
        }
      });
    }

    // 2. Définition des pages statiques avec priorités fortes
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/properties', priority: '0.9', changefreq: 'daily' },
      { url: '/vendre', priority: '0.9', changefreq: 'weekly' },
      { url: '/nos-biens-vendus', priority: '0.8', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/estimation', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
    ];

    // 3. Construction du XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((page) => {
          return `
            <url>
              <loc>${baseUrl}${page.url}</loc>
              <lastmod>${currentDate}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `;
        })
        .join('')}
      
      ${Array.from(citySlugMap.entries())
        .map(([slug, updateDate]) => {
          return `
            <url>
              <loc>${baseUrl}/immobilier-${slug}</loc>
              <lastmod>${updateDate}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.9</priority>
            </url>
          `;
        })
        .join('')}

      ${data.properties
        .map((property) => {
          // Logique pour l'URL : ref ou ID (idem App.tsx)
          const slug = property.ref && /^[a-zA-Z0-9\-_]+$/.test(property.ref) ? property.ref : property._id;
          return `
            <url>
              <loc>${baseUrl}/properties/${slug}</loc>
              <lastmod>${property._updatedAt.split('T')[0]}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}

      ${data.articles
        .map((article) => {
          return `
            <url>
              <loc>${baseUrl}/blog/${article.slug}</loc>
              <lastmod>${article._updatedAt.split('T')[0]}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}

      ${data.pages
        .map((page) => {
          return `
            <url>
              <loc>${baseUrl}/${page.slug}</loc>
              <lastmod>${page._updatedAt.split('T')[0]}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
    `;

    // 4. Envoi de la réponse avec le bon header XML
    response.setHeader('Content-Type', 'application/xml');
    response.status(200).send(sitemap);

  } catch (e) {
    console.error(e);
    response.status(500).send('Error generating sitemap');
  }
}