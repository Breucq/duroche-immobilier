export default {
  name: 'footerSettings',
  title: 'Paramètres du Pied de Page',
  type: 'document',
  fields: [
    {name: 'description', title: 'Description courte', type: 'text'},
    {name: 'email', title: 'E-mail de contact', type: 'string'},
    {name: 'phone', title: 'Téléphone', type: 'string'},
    {name: 'address', title: 'Adresse', type: 'text'},
    {name: 'facebookUrl', title: 'URL Facebook', type: 'url'},
    {name: 'linkedinUrl', title: 'URL LinkedIn', type: 'url'},
    {name: 'instagramUrl', title: 'URL Instagram', type: 'url'},
    {name: 'twitterUrl', title: 'URL Twitter/X', type: 'url'},
    {name: 'youtubeUrl', title: 'URL YouTube', type: 'url'},
    {name: 'copyright', title: 'Texte du Copyright', type: 'string', description: "Ex: 'Duroche Immobilier. Tous droits réservés.'"},
    {name: 'professionalCardLogo', title: 'Logo de la carte professionnelle', type: 'image'},
    {name: 'professionalCardNumber', title: 'Numéro de carte professionnelle', type: 'string'},
  ],
}