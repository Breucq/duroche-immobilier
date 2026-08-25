<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- 1. PRÉCONNEXIONS RENFORCÉES -->
    <link rel="preconnect" href="https://jvrtf17r.api.sanity.io" crossorigin>
    <link rel="preconnect" href="https://cdn.sanity.io" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.sanity.io">
    
    <style>
      /* CSS CRITIQUE : Contient tout ce qui est visible immédiatement (LCP) */
      :root { 
        --background: #FDFCFB; 
        --primary-text: #333D4B; 
        --accent: #b68d3d; 
        --accent-dark: #9e7a32; 
        --secondary-text: #6B7A90;
      }
      body { 
        margin: 0; 
        background-color: var(--background); 
        color: var(--primary-text); 
        font-family: system-ui, -apple-system, 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      #root { min-height: 100vh; display: flex; flex-direction: column; }
      
      header.main-header { height: 80px; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid #E0E6ED; position: sticky; top: 0; z-index: 30; }
      
      .lcp-wrap { position: relative; width: 100%; overflow: hidden; background: #1a1a1a; display: flex; align-items: center; justify-content: center; }
      .lcp-home { height: 60vh; min-height: 450px; }
      .lcp-detail { aspect-ratio: 16/9; }
      
      .hero-content-placeholder { text-align: center; color: white; z-index: 10; padding: 0 20px; }
      .hero-h1-placeholder { height: 48px; width: 300px; background: rgba(255,255,255,0.2); margin: 0 auto 20px; border-radius: 8px; }
      
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    </style>
    
    <script>
      /* SCRIPT LCP V4 : Préchauffage LCP responsive (mobile 640px / desktop 1200px) */
      (function() {
        const pId = 'jvrtf17r';
        const path = window.location.pathname;
        const isMobile = window.innerWidth <= 640;

        const logoUrl = "https://cdn.sanity.io/images/"+pId+"/production/fcfe23f10ab906658ab09e12607b30e2afa6e0f2-495x119.png?w=220&q=50&auto=format";
        const lLink = document.createElement('link'); lLink.rel = 'preload'; lLink.as = 'image'; lLink.href = logoUrl; lLink.fetchPriority = 'high';
        document.head.appendChild(lLink);

        let q = ''; let t = '';
        if (path === '/') { t='home'; q='*[_id=="homePageSettings"][0]{"u":heroBackgroundImage.asset->url}'; }
        else if (path.startsWith('/properties/')) {
          const r = path.split('/').pop();
          if (r) { t=r; q=`*[_type=="property" && (reference=="${r}"||_id=="${r}")][0]{"u":image.asset->url}`; }
        }
        if (q) {
          const url = `https://${pId}.api.sanity.io/v2023-05-03/data/query/production?query=${encodeURIComponent(q)}`;
          fetch(url, { priority: 'high' }).then(r => r.json()).then(d => {
            const imgUrl = d?.result?.u;
            if (imgUrl) {
              const fullUrl = isMobile
                ? imgUrl + '?w=640&h=480&q=70&auto=format&fit=crop'
                : imgUrl + '?w=1200&h=675&q=75&auto=format&fit=crop';
              window.__LCP_IMG_URL__ = fullUrl; window.__LCP_TARGET__ = t;
              const l = document.createElement('link'); l.rel = 'preload'; l.as = 'image'; l.href = fullUrl; l.fetchPriority = 'high';
              document.head.appendChild(l);
              const bg = document.getElementById('lcp-img'); if (bg) { bg.src = fullUrl; bg.style.opacity = "1"; }
            }
          }).catch(()=>{});
        }
      })();
    </script>

    <title>Duroche Immobilier</title>
    <meta name="description" content="Expert de l'immobilier dans le Vaucluse Nord. Achat, vente, estimation offerte. Découvrez nos maisons et appartements à Orange, Caderousse, Piolenc et environs." />
    <meta name="author" content="Duroche Immobilier">

    <!-- Open Graph par défaut -->
    <meta property="og:site_name" content="Duroche Immobilier" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Duroche Immobilier | Agence Immobilière Orange & Vaucluse Nord" />
    <meta property="og:description" content="Expert de l'immobilier dans le Vaucluse Nord. Achat, vente, estimation offerte. Découvrez nos maisons et appartements à Orange, Caderousse, Piolenc et environs." />
    <meta property="og:image" content="https://cdn.sanity.io/images/jvrtf17r/production/b5a4529d38c642277c0827137f88467472097973-1920x1080.jpg?fm=jpg&amp;w=1200&amp;h=630&amp;fit=crop" />
    <meta property="og:image:secure_url" content="https://cdn.sanity.io/images/jvrtf17r/production/b5a4529d38c642277c0827137f88467472097973-1920x1080.jpg?fm=jpg&amp;w=1200&amp;h=630&amp;fit=crop" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />

    <!-- Twitter par défaut -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Duroche Immobilier | Agence Immobilière Orange & Vaucluse Nord" />
    <meta name="twitter:description" content="Expert de l'immobilier dans le Vaucluse Nord. Achat, vente, estimation offerte. Découvrez nos maisons et appartements à Orange, Caderousse, Piolenc et environs." />
    <meta name="twitter:image" content="https://cdn.sanity.io/images/jvrtf17r/production/b5a4529d38c642277c0827137f88467472097973-1920x1080.jpg?fm=jpg&amp;w=1200&amp;h=630&amp;fit=crop" />
    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:wght@700&display=swap" media="print" onload="this.media='all'">

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#b68d3d">

    <!-- OPTIMISATION ANALYTICS : Chargement retardé (non-bloquant) -->
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      
      const loadGA = () => {
        const script = document.createElement('script');
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-V83SQRDZET";
        document.head.appendChild(script);
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setTimeout(loadGA, 2000));
      } else {
        setTimeout(loadGA, 3000);
      }
    </script>
<script type="importmap">
{
  "imports": {
    "@hookform/resolvers/": "https://esm.sh/@hookform/resolvers@^5.2.2/",
    "vite": "https://esm.sh/vite@^7.3.1",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2",
    "@sanity/image-url": "https://esm.sh/@sanity/image-url@^2.0.3",
    "@sanity/image-url/": "https://esm.sh/@sanity/image-url@^2.0.3/",
    "sanity": "https://esm.sh/sanity@^5.5.0",
    "sanity/": "https://esm.sh/sanity@^5.5.0/",
    "@sanity/vision": "https://esm.sh/@sanity/vision@^5.5.0",
    "sanity-plugin-media": "https://esm.sh/sanity-plugin-media@^4.1.1",
    "@sanity/icons": "https://esm.sh/@sanity/icons@^3.7.4",
    "axios": "https://esm.sh/axios@^1.13.2",
    "cheerio": "https://esm.sh/cheerio@^1.1.2",
    "@sanity/ui": "https://esm.sh/@sanity/ui@^3.1.11",
    "nanoid": "https://esm.sh/nanoid@^5.1.6",
    "papaparse": "https://esm.sh/papaparse@^5.5.3",
    "fs": "https://esm.sh/fs@^0.0.1-security",
    "path": "https://esm.sh/path@^0.12.7",
    "url": "https://esm.sh/url@^0.11.4",
    "react-router-dom": "https://esm.sh/react-router-dom@^7.12.0",
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom": "https://esm.sh/react-dom@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react-hook-form": "https://esm.sh/react-hook-form@^7.71.1",
    "@tanstack/react-query": "https://esm.sh/@tanstack/react-query@^5.90.19",
    "zod": "https://esm.sh/zod@^4.3.5",
    "react-helmet-async": "https://esm.sh/react-helmet-async@^2.0.5",
    "@sanity/client": "https://esm.sh/@sanity/client@^7.14.0",
    "@portabletext/react": "https://esm.sh/@portabletext/react@^6.0.2"
  }
}
</script>
</head>
  <body class="antialiased">
    <div id="root">
        <header class="main-header"></header>
        <div id="lcp-placeholder" class="lcp-wrap animate-pulse">
            <img id="lcp-img" alt="" role="presentation" style="width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity 0.3s;" fetchpriority="high">
            <div class="hero-content-placeholder">
                <div class="hero-h1-placeholder"></div>
                <div style="height:20px; width:200px; background:rgba(255,255,255,0.1); margin:0 auto; border-radius:4px;"></div>
            </div>
        </div>
        <script>
            (function() {
                const p = window.location.pathname;
                const el = document.getElementById('lcp-placeholder');
                if (p === '/') { el.classList.add('lcp-home'); } 
                else if (p.startsWith('/properties/')) { el.classList.add('lcp-detail'); }
                else { el.style.display = 'none'; }
            })();
        </script>
    </div>
    <script type="module" src="/index.tsx" fetchpriority="high"></script>
  </body>
</html>