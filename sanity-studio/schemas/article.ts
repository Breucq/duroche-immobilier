export default {
  name: 'article',
  title: 'Articles de Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Auteur',
      type: 'string',
      initialValue: 'Thomas Dubreucq',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date de Publication',
      type: 'date',
      initialValue: new Date().toISOString().split('T')[0],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image de Couverture',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Résumé',
      type: 'text',
      description: 'Un court résumé de l\'article pour la page de liste.',
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'content',
      title: 'Contenu',
      type: 'text',
      description: 'Contenu complet de l\'article.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
  },
}