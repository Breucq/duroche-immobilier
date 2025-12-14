import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Nécessaire pour __dirname en module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Sanity
const PROJECT_ID = 'jvrtf17r';
const DATASET = 'production';
const DOCUMENT_ID = 'siteSettings';

// On interroge Sanity pour avoir l'URL de base
const QUERY = encodeURIComponent(`*[_type == "siteSettings" && _id == "${DOCUMENT_ID}"][0]{ "faviconUrl": favicon.asset->url }`);
const URL = `https://${PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${DATASET}?query=${QUERY}`;

// Dossier de destination (public/ à la racine pour Vite)
const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function downloadImage(url, filename) {
    const filePath = path.join(PUBLIC_DIR, filename);
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function run() {
  try {
    // Création du dossier public s'il n'existe pas
    if (!fs.existsSync(PUBLIC_DIR)){
        fs.mkdirSync(PUBLIC_DIR);
    }

    console.log('🔄 Récupération de la configuration favicon depuis Sanity...');
    const response = await axios.get(URL);
    const faviconUrl = response.data.result?.faviconUrl;

    if (faviconUrl) {
      console.log(`✅ Image source trouvée : ${faviconUrl}`);
      
      // 1. Favicon PNG standard pour Google (Recommandation : multiple de 48px, 192x192 est idéal)
      console.log('⬇️  Génération de public/favicon.png (192x192)...');
      await downloadImage(`${faviconUrl}?w=192&h=192&fit=crop&auto=format&fm=png`, 'favicon.png');

      // 2. Apple Touch Icon pour iPhone/iPad et certains affichages Google Mobile (180x180)
      console.log('⬇️  Génération de public/apple-touch-icon.png (180x180)...');
      await downloadImage(`${faviconUrl}?w=180&h=180&fit=crop&auto=format&fm=png`, 'apple-touch-icon.png');
      
      // 3. Favicon.ico pour la compatibilité historique (48x48)
      // Google cherche souvent ce fichier à la racine par défaut
      console.log('⬇️  Génération de public/favicon.ico (48x48)...');
      await downloadImage(`${faviconUrl}?w=48&h=48&fit=crop&auto=format&fm=png`, 'favicon.ico');

      console.log('✅ Tous les favicons ont été générés avec succès.');
    } else {
      console.log('ℹ️  Aucun favicon configuré dans Sanity. Les fichiers existants ou par défaut seront utilisés.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la génération des favicons :', error.message);
    // On ne bloque pas le build, le site fonctionnera avec les assets précédents s'ils existent
  }
}

run();