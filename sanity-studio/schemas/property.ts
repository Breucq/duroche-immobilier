export default {
  name: 'property',
  title: 'Biens Immobiliers',
  type: 'document',
  groups: [
    {name: 'main', title: 'Infos Principales', default: true},
    {name: 'media', title: 'Photos & Visite'},
    {name: 'advanced', title: 'Détails & Diagnostics'},
    {name: 'legal', title: 'Finances & Légal'},
  ],
  fields: [
    // --- Ligne 1 : Identification rapide ---
    {
      name: 'reference',
      title: 'Référence',
      type: 'string',
      group: 'main',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Statut du mandat',
      type: 'string',
      options: {
        list: ['Disponible', 'Nouveautés', 'Sous offre', 'Vendu'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'Disponible',
      validation: (Rule: any) => Rule.required(),
      group: 'main',
    },
    {
      name: 'isHidden',
      title: 'Cacher le bien (Brouillon)',
      description: "Si coché, le bien ne sera pas visible sur le site public.",
      type: 'boolean',
      initialValue: false,
      group: 'main',
    },

    // --- Ligne 2 : Caractéristiques clés ---
    {
      name: 'type',
      title: 'Type de bien',
      type: 'string',
      options: {
        list: ['Maison', 'Appartement', 'Terrain', 'Autre'],
      },
      validation: (Rule: any) => Rule.required(),
      group: 'main',
    },
    {
      name: 'price',
      title: 'Prix (€)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
      group: 'main',
    },
    {
      name: 'location',
      title: 'Localisation (Ville)',
      type: 'string',
      description: 'Ex: "Orange", "Caderousse, 84860"',
      validation: (Rule: any) => Rule.required(),
      group: 'main',
    },

    // --- Ligne 3 : Surfaces ---
    {
      name: 'area',
      title: 'Surface Habitable (m²)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      group: 'main',
    },
    {
      name: 'landArea',
      title: 'Surface Terrain (m²)',
      description: "Pour les maisons et terrains. Laisser vide pour les appartements sans jardin.",
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
      group: 'main',
    },
    {
      name: 'rooms',
      title: 'Pièces',
      type: 'number',
      group: 'main',
    },
    {
      name: 'bedrooms',
      title: 'Chambres',
      type: 'number',
      group: 'main',
    },
    {
      name: 'bathrooms',
      title: 'Salles de bain',
      type: 'number',
      group: 'main',
    },

    // --- Description ---
    {
      name: 'description',
      title: 'Description commerciale',
      type: 'array', 
      of: [{type: 'block'}], // Permet le texte riche (Gras, Italique, Listes)
      description: "Utilisez les outils de formatage pour mettre du texte en gras ou créer des paragraphes.",
      validation: (Rule: any) => Rule.required(),
      group: 'main',
    },

    // --- MEDIA GROUP ---
    {
      name: 'image',
      title: 'Photo de couverture (Principale)',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule: any) => Rule.required(),
      group: 'media',
    },
    {
      name: 'images',
      title: 'Galerie photos',
      type: 'array',
      description:
        "Astuce : Cliquez sur 'Select' pour ouvrir la médiathèque et sélectionner PLUSIEURS images d'un coup (Ctrl+Click ou Cmd+Click). Vous pouvez aussi glisser-déposer vos fichiers ici.",
      options: {
        layout: 'grid',
      },
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'media',
    },
    {
      name: 'virtualTourUrl',
      title: 'Lien Visite Virtuelle (Matterport, etc.)',
      type: 'url',
      group: 'media',
    },


    // --- Advanced Details ---
    {
      name: 'details',
      title: 'Détails techniques',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'yearBuilt', title: 'Année de construction', type: 'number'},
        {
          name: 'condition',
          title: 'État',
          type: 'string',
          options: {list: ['À rénover', 'Bon état', 'Excellent état', 'Neuf']},
        },
        {
          name: 'heating',
          title: 'Chauffage / Climatisation',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Pompe à chaleur', value: 'Pompe à chaleur'},
              {title: 'Climatisation', value: 'Climatisation'},
              {title: 'Électrique', value: 'Électrique'},
              {title: 'Gaz', value: 'Gaz'},
              {title: 'Fioul', value: 'Fioul'},
              {title: 'Bois / Granulés', value: 'Bois'},
              {title: 'Solaire', value: 'Solaire'},
              {title: 'Aucun', value: 'Aucun'}
            ]
          },
        },
        {name: 'levels', title: 'Niveaux', type: 'number'},
        {
          name: 'availability',
          title: 'Disponibilité',
          type: 'string',
        },
      ],
    },

    {
      name: 'dpe',
      title: 'Performance Énergétique (DPE)',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: true},
      fields: [
        {
          name: 'class',
          title: 'Classe DPE',
          type: 'string',
          options: {list: ['A', 'B', 'C', 'D', 'E', 'F', 'G']},
        },
        {name: 'value', title: 'Valeur (kWh/m²/an)', type: 'number'},
      ],
    },

    {
      name: 'ges',
      title: 'Gaz à Effet de Serre (GES)',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: true},
      fields: [
        {
          name: 'class',
          title: 'Classe GES',
          type: 'string',
          options: {list: ['A', 'B', 'C', 'D', 'E', 'F', 'G']},
        },
        {name: 'value', title: 'Valeur (kgCO2/m²/an)', type: 'number'},
      ],
    },

    {
      name: 'characteristics',
      title: 'Caractéristiques (Tags)',
      type: 'object',
      group: 'advanced',
      description: "Appuyez sur Entrée après chaque caractéristique.",
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'general', title: 'Général', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'interior', title: 'Intérieur', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'exterior', title: 'Extérieur', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'equipment', title: 'Équipements', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'commercial', title: 'Local Commercial', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'land', title: 'Terrain', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
      ],
    },

    // --- Financials & Legal ---
    {
      name: 'financials',
      title: 'Informations Financières',
      type: 'object',
      group: 'legal',
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'propertyTax', title: 'Taxe foncière (€/an)', type: 'number'},
        {name: 'condoFees', title: 'Charges de copropriété (€/mois)', type: 'number'},
        {
          name: 'agencyFees',
          title: 'Honoraires',
          type: 'string',
          initialValue: 'À la charge du vendeur',
        },
      ],
    },

    {
      name: 'coOwnership',
      title: 'Copropriété',
      type: 'object',
      group: 'legal',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'isCoOwnership', title: 'Le bien est en copropriété', type: 'boolean', initialValue: false},
        {
          name: 'numberOfLots',
          title: 'Nombre de lots',
          type: 'number',
          hidden: ({parent}: any) => !parent?.isCoOwnership,
        },
        {
          name: 'proceedings',
          title: 'Procédure en cours',
          type: 'string',
          options: {list: ['Oui', 'Non', 'Non applicable']},
          hidden: ({parent}: any) => !parent?.isCoOwnership,
        },
      ],
    },

    {
      name: 'risks',
      title: 'Mentions Légales Risques',
      type: 'text',
      group: 'legal',
      initialValue: 'Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr',
    },
  ],
  preview: {
    select: {
      title: 'type',
      location: 'location',
      price: 'price',
      media: 'image',
      status: 'status',
      isHidden: 'isHidden',
      ref: 'reference',
    },
    prepare({title, location, price, media, status, isHidden, ref}: any) {
      const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(price)

      let statusEmoji = '🟢' // Disponible
      if (status === 'Vendu') statusEmoji = '🔴'
      if (status === 'Sous offre') statusEmoji = '🟠'
      if (isHidden) statusEmoji = '👻' // Caché

      return {
        title: `${statusEmoji} ${title} à ${location}`,
        subtitle: `${formattedPrice} [Réf: ${ref || '?'}]`,
        media,
      }
    },
  },
}