export default {
  name: 'review',
  title: 'Avis Clients',
  type: 'document',
  fields: [
    {
      name: 'author',
      title: 'Nom du client',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Détail de la transaction / Rôle',
      type: 'string',
      description: 'Ex: "Acheteur d\'une maison à Orange" ou "Propriétaire vendeur"',
    },
    {
      name: 'rating',
      title: 'Note',
      type: 'number',
      initialValue: 5,
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Texte de l\'avis',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date de publication',
      type: 'date',
    },
    {
      name: 'isGoogleReview',
      title: 'Avis Google',
      type: 'boolean',
      initialValue: true,
    }
  ]
}