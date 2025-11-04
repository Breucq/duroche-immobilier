import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footerSettings',
  title: 'Paramètres du Pied de Page',
  type: 'document',
  fields: [
    defineField({name: 'description', title: 'Description courte', type: 'text'}),
    defineField({name: 'email', title: 'E-mail de contact', type: 'string'}),
    defineField({name: 'phone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'address', title: 'Adresse', type: 'text'}),
    defineField({name: 'facebookUrl', title: 'URL Facebook', type: 'url'}),
    defineField({name: 'linkedinUrl', title: 'URL LinkedIn', type: 'url'}),
    defineField({name: 'instagramUrl', title: 'URL Instagram', type: 'url'}),
    defineField({name: 'twitterUrl', title: 'URL Twitter/X', type: 'url'}),
    defineField({name: 'youtubeUrl', title: 'URL YouTube', type: 'url'}),
    defineField({name: 'copyright', title: 'Texte du Copyright', type: 'string', description: "Ex: 'Duroche Immobilier. Tous droits réservés.'"}),
    defineField({name: 'professionalCardLogo', title: 'Logo de la carte professionnelle', type: 'image'}),
    defineField({name: 'professionalCardNumber', title: 'Numéro de carte professionnelle', type: 'string'}),
  ],
})
