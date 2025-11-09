import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'property',
  title: 'Biens Immobiliers',
  type: 'document',
  groups: [
    {name: 'main', title: 'Informations Principales', default: true},
    {name: 'advanced', title: 'Détails & Diagnostics'},
    {name: 'legal', title: 'Finances & Légal'},
  ],
  fields: [
    defineField({
      name: 'publicationDate',
      title: 'Date de Publication',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'reference',
      title: 'Référence',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'image',
      title: 'Image Principale',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'images',
      title: 'Images Supplémentaires',
      type: 'array',
      description:
        "Vous pouvez glisser-déposer plusieurs images à la fois, ou en sélectionner plusieurs lors de l'upload.",
      options: {
        layout: 'grid',
      },
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'main',
    }),
    defineField({
      name: 'type',
      title: 'Type de bien',
      type: 'string',
      options: {
        list: ['Maison', 'Appartement', 'Terrain', 'Autre'],
      },
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      group: 'main',
    }),
    defineField({
      name: 'location',
      title: 'Localisation',
      type: 'string',
      description: 'Ex: "Caderousse, 84860"',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'area',
      title: 'Surface (m²)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      group: 'main',
    }),
    defineField({
      name: 'rooms',
      title: 'Nombre de pièces',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
      group: 'main',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Nombre de chambres',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
      group: 'main',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Nombre de salles de bain',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'virtualTourUrl',
      title: 'URL de la Visite Virtuelle',
      type: 'url',
      group: 'main',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: ['Disponible', 'Nouveautés', 'Sous offre', 'Vendu'],
        layout: 'radio',
      },
      initialValue: 'Disponible',
      group: 'main',
    }),
    defineField({
      name: 'isHidden',
      title: 'Cacher le bien du site public',
      type: 'boolean',
      initialValue: false,
      group: 'main',
    }),

    // --- Advanced Details & Diagnostics ---
    defineField({
      name: 'details',
      title: 'Détails du bien',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'yearBuilt', title: 'Année de construction', type: 'number', validation: (Rule) => Rule.integer()},
        {
          name: 'condition',
          title: 'État',
          type: 'string',
          options: {list: ['À rénover', 'Bon état', 'Excellent état', 'Neuf']},
        },
        {
          name: 'heating',
          title: 'Chauffage',
          type: 'string',
          options: {list: ['Gaz', 'Électrique', 'Fioul', 'Pompe à chaleur', 'Aucun']},
        },
        {name: 'levels', title: 'Nombre de niveaux', type: 'number', validation: (Rule) => Rule.integer()},
        {
          name: 'availability',
          title: 'Disponibilité',
          type: 'string',
          description: 'Ex: "Immédiate", "Loué", "À partir du JJ/MM/AAAA"',
        },
      ],
    }),

    defineField({
      name: 'dpe',
      title: 'DPE (Diagnostic de Performance Énergétique)',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: false},
      fields: [
        {
          name: 'class',
          title: 'Classe',
          type: 'string',
          options: {list: ['A', 'B', 'C', 'D', 'E', 'F', 'G']},
        },
        {name: 'value', title: 'Valeur (kWh/m²/an)', type: 'number'},
      ],
    }),

    defineField({
      name: 'ges',
      title: 'GES (Gaz à Effet de Serre)',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: false},
      fields: [
        {
          name: 'class',
          title: 'Classe',
          type: 'string',
          options: {list: ['A', 'B', 'C', 'D', 'E', 'F', 'G']},
        },
        {name: 'value', title: 'Valeur (kgCO2/m²/an)', type: 'number'},
      ],
    }),

    defineField({
      name: 'characteristics',
      title: 'Caractéristiques',
      type: 'object',
      group: 'advanced',
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'general', title: 'Général', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'interior', title: 'Intérieur', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'exterior', title: 'Extérieur', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'equipment', title: 'Équipements', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'commercial', title: 'Local Commercial', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
        {name: 'land', title: 'Terrain', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}},
      ],
    }),

    // --- Financials & Legal ---
    defineField({
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
          description: 'Ex: "À la charge du vendeur"',
        },
      ],
    }),

    defineField({
      name: 'coOwnership',
      title: 'Copropriété',
      type: 'object',
      group: 'legal',
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'isCoOwnership', title: 'Le bien est en copropriété', type: 'boolean', initialValue: false},
        {
          name: 'numberOfLots',
          title: 'Nombre de lots',
          type: 'number',
          hidden: ({parent}) => !parent?.isCoOwnership,
        },
        {
          name: 'proceedings',
          title: 'Procédure en cours',
          type: 'string',
          options: {list: ['Oui', 'Non', 'Non applicable']},
          hidden: ({parent}) => !parent?.isCoOwnership,
        },
      ],
    }),

    defineField({
      name: 'risks',
      title: 'Informations sur les risques',
      type: 'text',
      group: 'legal',
      description:
        'Ex: "Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr"',
    }),
  ],
  preview: {
    select: {
      title: 'location',
      subtitle: 'price',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(subtitle)
      return {
        title: title || 'Bien non localisé',
        subtitle: formattedPrice || 'Prix non défini',
        media,
      }
    },
  },
})