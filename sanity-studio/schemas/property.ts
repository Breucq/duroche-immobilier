import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'property',
  title: 'Biens Immobiliers',
  type: 'document',
  fields: [
    defineField({
      name: 'publicationDate',
      title: 'Date de Publication',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reference',
      title: 'Référence',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image Principale',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images Supplémentaires',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'type',
      title: 'Type de bien',
      type: 'string',
      options: {
        list: ['Maison', 'Appartement', 'Terrain', 'Autre'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'location',
      title: 'Localisation',
      type: 'string',
      description: 'Ex: "Caderousse, 84860"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Surface (m²)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'rooms',
      title: 'Nombre de pièces',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'bedrooms',
      title: 'Nombre de chambres',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Nombre de salles de bain',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'virtualTourUrl',
      title: 'URL de la Visite Virtuelle',
      type: 'url',
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
    }),
    defineField({
      name: 'isHidden',
      title: 'Cacher le bien du site public',
      type: 'boolean',
      initialValue: false,
    }),
    // ... other fields like details, dpe, ges, etc.
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
