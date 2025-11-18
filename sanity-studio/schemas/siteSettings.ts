export default {
  name: 'siteSettings',
  title: 'Paramètres du Site',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nom du Site',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description par défaut (pour le SEO)',
      type: 'text',
    },
    {
      name: 'logo',
      title: 'Logo (Header)',
      type: 'image',
    },
    {
      name: 'footerLogo',
      title: 'Logo (Footer)',
      type: 'image',
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    },
    {
      name: 'maintenanceMode',
      title: 'Activer le mode maintenance',
      description: 'Si activé, le site affichera une page de maintenance à tous les visiteurs.',
      type: 'boolean',
      initialValue: false,
    },
  ],
}