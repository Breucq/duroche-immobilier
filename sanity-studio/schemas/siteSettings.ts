import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du Site',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du Site',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description par défaut (pour le SEO)',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'Logo (Header)',
      type: 'image',
    }),
    defineField({
      name: 'footerLogo',
      title: 'Logo (Footer)',
      type: 'image',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'maintenanceMode',
      title: 'Activer le mode maintenance',
      description: 'Si activé, le site affichera une page de maintenance à tous les visiteurs.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})