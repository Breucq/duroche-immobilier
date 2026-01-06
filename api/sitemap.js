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
        _updatedAt 
      },
      "articles": *[_type == "article"] { 
        "slug": slug.current, 
        _updatedAt 
      },
      "pages": *[_type == "page"] { 
        "slug": slug.current, 
        _updatedAt 
      }
    }`;

    const data = await client.fetch(query);

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