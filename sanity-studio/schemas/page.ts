import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la Page',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Contenu de la Page',
      type: 'text', // Simple text for now, can be upgraded to block content
    }),
    defineField({
      name: 'showInHeader',
      title: 'Afficher dans le menu principal (Header)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showInFooter',
      title: 'Afficher dans le pied de page (Footer)',
      type: 'boolean',
      initialValue: true,
    }),
    // SEO Fields
  ],
})
