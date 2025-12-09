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
    // Choix du format
    {
      name: 'format',
      title: 'Format du contenu',
      type: 'string',
      options: {
        list: [
          {title: 'Éditeur Visuel (Recommandé)', value: 'richText'},
          {title: 'Code HTML Brut', value: 'html'}
        ],
        layout: 'radio',
        direction: 'horizontal'
      },
      initialValue: 'richText',
      description: "Choisissez 'Éditeur Visuel' pour écrire normalement, ou 'Code HTML' si vous importez du code depuis un autre outil."
    },
    // Champ pour le Texte Riche (Portable Text)
    {
      name: 'content',
      title: 'Contenu (Éditeur Visuel)',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}}
      ],
      hidden: ({document}: any) => document?.format === 'html',
      description: 'Utilisez cet éditeur pour rédiger votre article avec mise en forme.',
    },
    // Champ pour le HTML brut
    {
      name: 'contentHtml',
      title: 'Contenu (Code HTML)',
      type: 'text',
      rows: 15,
      hidden: ({document}: any) => document?.format !== 'html',
      description: 'Collez votre code HTML ici (balises <p>, <h1>, <ul>, etc.).',
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