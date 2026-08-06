import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cityGuide',
  title: 'Pages Villes (SEO / GEO)',
  type: 'document',
  fields: [
    defineField({
      name: 'cityName',
      title: 'Nom de la Ville (tel qu\'affiché dans les biens)',
      type: 'string',
      description: 'Exemple: Camaret-sur-Aigues, Orange, Sérignan-du-Comtat',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: {
        source: 'cityName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Code Postal',
      type: 'string',
      description: 'Ex: 84850',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Titre SEO (Meta Title)',
      type: 'string',
      description: 'Titre spécifique pour Google et la balise <title>',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description SEO (Meta Description)',
      type: 'text',
      rows: 3,
      description: 'Résumé pour les moteurs de recherche (150-160 caractères)',
    }),
    defineField({
      name: 'title',
      title: 'Titre de la présentation',
      type: 'string',
      description: 'Ex: Vivre et investir à Camaret-sur-Aigues',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture de la ville',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'intro',
      title: 'Introduction synthétique',
      type: 'text',
      rows: 4,
      description: 'Court texte de présentation affiché en avant-première',
    }),
    defineField({
      name: 'content',
      title: 'Contenu détaillé de présentation',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Présentation du marché immobilier local, cadre de vie, commodités, transports, etc.',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Points forts de la ville',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: "Accès rapide autoroute A7", "Écoles et commerces à proximité", "Cadre provençal préservé"',
    }),
    defineField({
      name: 'faqs',
      title: 'Foire Aux Questions (FAQ SEO / GEO)',
      type: 'array',
      description: 'Questions/Réponses structurées pour enrichir le référencement et les moteurs IA (GEO)',
      of: [
        {
          type: 'object',
          title: 'Question / Réponse',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Réponse', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'cityName',
      subtitle: 'title',
      media: 'coverImage',
    },
  },
})
