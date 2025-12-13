import fs from 'fs';
import axios from 'axios';

// Configuration Sanity
const PROJECT_ID = 'jvrtf17r';
const DATASET = 'production';
const DOCUMENT_ID = 'siteSettings';

// Requête pour récupérer l'URL du favicon (optimisée en 128px pour les onglets)
const QUERY = encodeURIComponent(`*[_type == "siteSettings" && _id == "${DOCUMENT_ID}"][0]{ "faviconUrl": favicon.asset->url }`);
const URL = `https://${PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${DATASET}?query=${QUERY}`;

async function run() {
  try {
    console.log('🔄 Récupération du favicon depuis Sanity...');
    const response = await axios.get(URL);
    
    const faviconUrl = response.data.result?.faviconUrl;

    if (faviconUrl) {
      console.log(`✅ Favicon trouvé : ${faviconUrl}`);
      
      // On ajoute un paramètre de largeur pour optimiser l'image et s'assurer que c'est un format web standard
      const optimizedUrl = `${faviconUrl}?w=128&fit=max&auto=format`;
      
      let html = fs.readFileSync('index.html', 'utf-8');
      
      // Regex pour trouver la balise <link rel="icon" id="favicon-link" ...> et remplacer son href
      // On cherche l'ID spécifique pour être sûr de ne pas casser autre chose
      const linkRegex = /(<link[^>]*id="favicon-link"[^>]*href=")([^"]*)("[^>]*>)/;
      
      if (linkRegex.test(html)) {
         // Remplacement de l'URL
         html = html.replace(linkRegex, `$1${optimizedUrl}$3`);
         
         // Nettoyage : si l'ancien favicon était un SVG (type="image/svg+xml"), on enlève cet attribut
         // car Sanity peut renvoyer un PNG ou JPG.
         // On remplace simplement type="..." par rien ou par type="image/png" si on veut être strict, 
         // mais sans type, les navigateurs modernes détectent automatiquement.
         html = html.replace(/type="image\/svg\+xml"/g, '');

         fs.writeFileSync('index.html', html);
         console.log('✅ index.html mis à jour avec le favicon de Sanity.');
      } else {
         console.warn('⚠️ Impossible de trouver la balise <link id="favicon-link"> dans index.html');
      }
    } else {
      console.log('ℹ️ Aucun favicon configuré dans Sanity (siteSettings). Le favicon par défaut sera utilisé.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du favicon :', error.message);
    // On ne bloque pas le build pour ça, on laisse l'erreur s'afficher mais le processus continue
  }
}

run();