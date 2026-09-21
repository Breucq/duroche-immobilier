import React from 'react';
import type { Property } from '../types';
import { urlFor } from '../services/sanityClient';

interface PropertyPrintSheetProps {
  property: Property;
  canonicalUrl: string;
  formattedPrice: string;
  formattedPricePerSqM?: string;
  allImages: any[];
}

const DPE_GRADES = [
  { class: 'A', label: '≤ 70', color: '#009E3D', textColor: '#ffffff' },
  { class: 'B', label: '71-110', color: '#51B848', textColor: '#ffffff' },
  { class: 'C', label: '111-180', color: '#CADB2A', textColor: '#000000' },
  { class: 'D', label: '181-250', color: '#E3B800', textColor: '#000000' },
  { class: 'E', label: '251-330', color: '#E67300', textColor: '#ffffff' },
  { class: 'F', label: '331-420', color: '#EB5E28', textColor: '#ffffff' },
  { class: 'G', label: '> 420', color: '#D62227', textColor: '#ffffff' },
];

const GES_GRADES = [
  { class: 'A', label: '≤ 6', color: '#EDE5F6', textColor: '#460F6B' },
  { class: 'B', label: '7-11', color: '#D5BFE7', textColor: '#460F6B' },
  { class: 'C', label: '12-30', color: '#B893D3', textColor: '#ffffff' },
  { class: 'D', label: '31-50', color: '#9C6ABF', textColor: '#ffffff' },
  { class: 'E', label: '51-70', color: '#8145AB', textColor: '#ffffff' },
  { class: 'F', label: '71-100', color: '#642691', textColor: '#ffffff' },
  { class: 'G', label: '> 100', color: '#460F6B', textColor: '#ffffff' },
];

/**
 * Fiche d'impression A4 haute définition
 * Conçue pour tenir rigoureusement sur 1 seule feuille A4
 */
export const PropertyPrintSheet: React.FC<PropertyPrintSheetProps> = ({
  property,
  canonicalUrl,
  formattedPrice,
  formattedPricePerSqM,
  allImages,
}) => {
  // Sélection des 3 meilleures images pour la fiche
  const img1 = allImages[0]
    ? urlFor(allImages[0]).width(900).height(560).fit('crop').quality(85).url()
    : null;
  const img2 = allImages[1]
    ? urlFor(allImages[1]).width(500).height(310).fit('crop').quality(85).url()
    : null;
  const img3 = allImages[2]
    ? urlFor(allImages[2]).width(500).height(310).fit('crop').quality(85).url()
    : null;

  // Extraction d'un texte propre et structuré
  const extractParagraphs = (desc: string | any[]): { title?: string; body: string }[] => {
    if (Array.isArray(desc)) {
      const items: { title?: string; body: string }[] = [];
      let currentTitle = '';
      let currentBody = '';

      desc.forEach((block) => {
        if (!block) return;
        const text = (block.children?.map((c: any) => c.text).join('') || '').trim();
        if (!text) return;

        if (block.style === 'h1' || block.style === 'h2' || block.style === 'h3' || block.style === 'h4') {
          if (currentBody || currentTitle) {
            items.push({ title: currentTitle, body: currentBody.trim() });
            currentTitle = '';
            currentBody = '';
          }
          currentTitle = text;
        } else {
          currentBody += (currentBody ? '\n' : '') + text;
        }
      });

      if (currentTitle || currentBody) {
        items.push({ title: currentTitle, body: currentBody.trim() });
      }
      return items;
    }

    if (typeof desc === 'string') {
      const lines = desc.split('\n').map((l) => l.trim()).filter(Boolean);
      const items: { title?: string; body: string }[] = [];
      let currentTitle = '';
      let currentBody = '';

      lines.forEach((line) => {
        if (line.startsWith('#') || line.startsWith('###') || line.startsWith('##')) {
          if (currentBody || currentTitle) {
            items.push({ title: currentTitle, body: currentBody.trim() });
            currentTitle = '';
            currentBody = '';
          }
          currentTitle = line.replace(/^#+\s*/, '');
        } else {
          currentBody += (currentBody ? ' ' : '') + line;
        }
      });

      if (currentTitle || currentBody) {
        items.push({ title: currentTitle, body: currentBody.trim() });
      }
      return items;
    }

    return [];
  };

  const paragraphs = extractParagraphs(property.description);

  // Caractéristiques saillantes
  const highlights: string[] = [];
  if (property.characteristics?.exterior) highlights.push(...property.characteristics.exterior);
  if (property.characteristics?.equipment) highlights.push(...property.characteristics.equipment);
  if (property.characteristics?.general) highlights.push(...property.characteristics.general);

  const city = property.location?.split(',')[0]?.trim() || property.location;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(canonicalUrl)}`;

  const renderDpeBar = (currentClass?: string, currentValue?: number, isGes = false) => {
    const grades = isGes ? GES_GRADES : DPE_GRADES;
    const cleanClass = currentClass?.toUpperCase()?.trim();
    const activeGrade = grades.find((g) => g.class === cleanClass);

    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-gray-700 w-8 shrink-0">
          {isGes ? 'GES' : 'DPE'}
        </span>
        <div className="flex-1 flex gap-0.5 items-center">
          {grades.map((g) => {
            const isSelected = g.class === cleanClass;
            return (
              <div
                key={g.class}
                style={{
                  backgroundColor: g.color,
                  color: g.textColor,
                  border: isSelected ? '1.5px solid #000' : 'none',
                  transform: isSelected ? 'scaleY(1.2)' : 'none',
                }}
                className={`flex-1 h-3.5 flex items-center justify-center text-[8px] font-bold rounded-xs transition-all ${
                  isSelected ? 'shadow-sm z-10' : 'opacity-70'
                }`}
              >
                {g.class}
              </div>
            );
          })}
        </div>
        <div
          style={{
            backgroundColor: activeGrade?.color || '#333D4B',
            color: activeGrade?.textColor || '#ffffff',
          }}
          className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 min-w-[55px] text-center"
        >
          {cleanClass || '-'} {currentValue ? `(${currentValue})` : ''}
        </div>
      </div>
    );
  };

  return (
    <div className="a4-print-container bg-white text-[#22292f] font-sans antialiased leading-tight select-none">
      {/* 1. EN-TÊTE DE PRESTIGE DUROCHE IMMOBILIER */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#b68d3d]">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-xl font-bold tracking-tight text-[#b68d3d]">
              Duroche
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-[#333D4B]">
              Immobilier
            </span>
          </div>
          <span className="text-[8px] uppercase tracking-widest font-semibold text-gray-500 mt-0.5">
            Expert de l'immobilier • Vaucluse Nord
          </span>
        </div>

        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-bold text-[#333D4B]">
            Thomas DUBREUCQ &amp; Sylvie ROCHE
          </span>
          <div className="flex items-center gap-3 text-[9px] text-gray-600 mt-0.5">
            <span className="font-semibold text-[#b68d3d]">07 56 87 47 88</span>
            <span>•</span>
            <span>contact@duroche.fr</span>
            <span>•</span>
            <span className="font-medium">www.duroche.fr</span>
          </div>
        </div>
      </div>

      {/* 2. TITRE DU BIEN + MANDAT + PRIX */}
      <div className="flex items-start justify-between bg-[#FBF9F5] border border-[#E9E2D5] rounded-md px-3 py-1.5 mb-2">
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="bg-[#b68d3d] text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
              {property.type}
            </span>
            <span className="text-[9px] font-medium text-gray-500">
              Réf / Mandat :{' '}
              <strong className="text-gray-800">
                {property.reference || property._id}
              </strong>
            </span>
          </div>
          <h1 className="font-heading text-[13pt] font-bold text-[#333D4B] leading-tight">
            {property.type} à {property.location}
          </h1>
        </div>

        <div className="text-right shrink-0">
          <div className="font-heading text-[14pt] font-extrabold text-[#b68d3d] leading-none">
            {formattedPrice}
          </div>
          <div className="text-[8px] text-gray-500 mt-0.5">
            {formattedPricePerSqM && <span>{formattedPricePerSqM} • </span>}
            <span>Honoraires inclus</span>
          </div>
        </div>
      </div>

      {/* 3. GALERIE PHOTOS QUALITÉ FLYER (1 grande + 2 petites ou adaptatif) */}
      <div className="mb-2">
        {img1 && img2 && img3 ? (
          <div className="grid grid-cols-12 gap-1.5 h-[62mm]">
            <div className="col-span-8 h-full rounded overflow-hidden border border-gray-200">
              <img
                src={img1}
                alt="Vue principale"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="col-span-4 h-full flex flex-col gap-1.5">
              <div className="h-[29.5mm] rounded overflow-hidden border border-gray-200">
                <img
                  src={img2}
                  alt="Vue 2"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="h-[29.5mm] rounded overflow-hidden border border-gray-200">
                <img
                  src={img3}
                  alt="Vue 3"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        ) : img1 && img2 ? (
          <div className="grid grid-cols-2 gap-1.5 h-[58mm]">
            <div className="h-full rounded overflow-hidden border border-gray-200">
              <img
                src={img1}
                alt="Vue 1"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="h-full rounded overflow-hidden border border-gray-200">
              <img
                src={img2}
                alt="Vue 2"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        ) : img1 ? (
          <div className="w-full h-[58mm] rounded overflow-hidden border border-gray-200">
            <img
              src={img1}
              alt="Vue principale"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        ) : null}
      </div>

      {/* 4. BANDEAU DES CHIFFRES CLÉS (METRICS) */}
      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        <div className="bg-[#F8F9FA] border border-gray-200 rounded px-2 py-1 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-semibold">
            Habitable
          </span>
          <span className="font-heading text-[12pt] font-bold text-gray-900 leading-none">
            {property.area > 0 ? `${property.area} m²` : '-'}
          </span>
        </div>

        <div className="bg-[#F8F9FA] border border-gray-200 rounded px-2 py-1 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-semibold">
            Chambres
          </span>
          <span className="font-heading text-[12pt] font-bold text-gray-900 leading-none">
            {property.bedrooms > 0 ? property.bedrooms : '-'}
          </span>
        </div>

        <div className="bg-[#F8F9FA] border border-gray-200 rounded px-2 py-1 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-semibold">
            Pièces
          </span>
          <span className="font-heading text-[12pt] font-bold text-gray-900 leading-none">
            {property.rooms > 0 ? property.rooms : '-'}
          </span>
        </div>

        <div className="bg-[#F8F9FA] border border-gray-200 rounded px-2 py-1 text-center">
          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-semibold">
            Terrain / Cour
          </span>
          <span className="font-heading text-[12pt] font-bold text-gray-900 leading-none">
            {property.landArea > 0 ? `${property.landArea} m²` : '-'}
          </span>
        </div>
      </div>

      {/* 5. CORPS EN 2 COLONNES RIGOUROUSEMENT ÉQUILIBRÉ */}
      <div className="grid grid-cols-12 gap-3 mb-2">
        {/* COLONNE GAUCHE (7/12) : DESCRIPTION ET POINTS FORTS */}
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-[#b68d3d]/50 pb-1 mb-1.5">
              <span className="w-1.5 h-3 bg-[#b68d3d] rounded-xs"></span>
              <h2 className="font-heading text-[10pt] font-bold uppercase tracking-wider text-gray-800">
                Descriptif du bien
              </h2>
            </div>

            {/* Conteneur avec limitation de hauteur et typographie compacte pour 1 page A4 */}
            <div className="text-[8pt] text-gray-700 leading-snug space-y-1.5 max-h-[88mm] overflow-hidden pr-1">
              {paragraphs.length > 0 ? (
                paragraphs.slice(0, 4).map((p, idx) => (
                  <div key={idx} className="space-y-0.5">
                    {p.title && (
                      <h3 className="font-bold text-gray-900 text-[8.5pt]">
                        {p.title}
                      </h3>
                    )}
                    <p className="whitespace-pre-line text-justify">{p.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-justify">
                  {typeof property.description === 'string'
                    ? property.description
                    : 'Charmant bien immobilier proposé par Duroche Immobilier.'}
                </p>
              )}
            </div>
          </div>

          {/* Points forts / équipements remarquables */}
          {highlights.length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-gray-200">
              <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                Points forts &amp; Atouts :
              </span>
              <div className="flex flex-wrap gap-1">
                {highlights.slice(0, 8).map((h, i) => (
                  <span
                    key={i}
                    className="inline-block bg-[#F4EFE6] text-gray-800 text-[7.5pt] font-medium px-1.5 py-0.5 rounded border border-[#E5DAC6]"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE (5/12) : DÉTAILS TECHNIQUES + DPE + QR CODE */}
        <div className="col-span-5 flex flex-col justify-between space-y-2">
          {/* Détails techniques */}
          <div className="bg-[#F8F9FA] border border-gray-200 rounded p-2">
            <div className="flex items-center gap-1.5 border-b border-gray-300 pb-1 mb-1.5">
              <span className="w-1.5 h-3 bg-[#333D4B] rounded-xs"></span>
              <h3 className="font-heading text-[9pt] font-bold uppercase tracking-wider text-gray-800">
                Caractéristiques
              </h3>
            </div>
            <div className="space-y-1 text-[8pt]">
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-500">Ville :</span>
                <span className="font-semibold text-gray-800">{city}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-500">Type de bien :</span>
                <span className="font-semibold text-gray-800">{property.type}</span>
              </div>
              {property.details?.heating && (
                <div className="flex justify-between border-b border-gray-100 pb-0.5">
                  <span className="text-gray-500">Chauffage :</span>
                  <span className="font-semibold text-gray-800 text-right">
                    {Array.isArray(property.details.heating)
                      ? property.details.heating.join(', ')
                      : property.details.heating}
                  </span>
                </div>
              )}
              {property.details?.condition && (
                <div className="flex justify-between border-b border-gray-100 pb-0.5">
                  <span className="text-gray-500">État :</span>
                  <span className="font-semibold text-gray-800">
                    {property.details.condition}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Disponibilité :</span>
                <span className="font-semibold text-emerald-700">Immédiate</span>
              </div>
            </div>
          </div>

          {/* Diagnostics Énergétiques DPE & GES */}
          <div className="bg-[#F8F9FA] border border-gray-200 rounded p-2">
            <div className="flex items-center gap-1.5 border-b border-gray-300 pb-1 mb-1.5">
              <span className="w-1.5 h-3 bg-[#b68d3d] rounded-xs"></span>
              <h3 className="font-heading text-[9pt] font-bold uppercase tracking-wider text-gray-800">
                Performances Énergétiques
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                {renderDpeBar(property.dpe?.class, property.dpe?.value, false)}
                <div className="text-[7.5pt] text-gray-500 text-right mt-0.5">
                  Consommation :{' '}
                  <strong className="text-gray-800">
                    {property.dpe?.value ? `${property.dpe.value} kWh/m²/an` : 'Vierge / En cours'}
                  </strong>
                </div>
              </div>
              <div>
                {renderDpeBar(property.ges?.class, property.ges?.value, true)}
                <div className="text-[7.5pt] text-gray-500 text-right mt-0.5">
                  Émissions GES :{' '}
                  <strong className="text-gray-800">
                    {property.ges?.value ? `${property.ges.value} kgCO2/m²/an` : 'Vierge / En cours'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code et lien vers visite virtuelle / annonce complète */}
          <div className="bg-[#FBF9F5] border border-[#E9E2D5] rounded p-2 flex items-center gap-2.5">
            <div className="w-13 h-13 shrink-0 bg-white p-0.5 border border-gray-300 rounded shadow-xs">
              <img
                src={qrCodeUrl}
                alt="QR Code Annonce"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1 text-[7.5pt] leading-tight text-gray-600">
              <span className="font-bold text-[#b68d3d] block text-[8pt]">
                Fiche complète &amp; Visite 360°
              </span>
              <span>Scannez le QR code avec votre smartphone pour voir toutes les photos HD.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PIED DE PAGE RÉGLEMENTAIRE ET MENTIONS LÉGALES */}
      <div className="pt-1.5 mt-auto border-t border-gray-300 flex items-center justify-between text-[6.5pt] text-gray-500 leading-tight">
        <div className="max-w-[78%]">
          <p>
            <strong>Mentions légales &amp; Mandat :</strong> Annonce rédigée et publiée par Sylvie Roche (RSAC Avignon 750 573 529) et Thomas Dubreucq (RSAC Avignon 934 239 732), agents commerciaux indépendants du Réseau EXPERTIMO — Carte pro CPI 8401 2018 000 024 015 CCI Vaucluse. Document informatif non contractuel.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold text-gray-700">Duroche Immobilier</p>
          <p>www.duroche.fr</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyPrintSheet;
