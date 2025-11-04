import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'estimationPageSettings',
  title: 'Paramètres de la Page Estimation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la Page',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre de la Page',
      type: 'text',
    }),
  ],
})
