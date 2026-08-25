export default {
  name: 'estimationPageSettings',
  title: 'Paramètres de la Page Estimation',
  type: 'document',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Titre (SEO)',
      type: 'string',
      description: 'Titre apparaissant dans les résultats Google',
      initialValue: 'Estimer votre bien immobilier à Orange | Duroche Immobilier',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      description: 'Description pour le référencement Google',
      initialValue: 'Obtenez une évaluation précise et personnalisée de votre maison ou appartement à Orange, Caderousse, Piolenc et Haut-Vaucluse.',
    },
    {
      name: 'title',
      title: 'Titre Principal (H1)',
      type: 'string',
      initialValue: 'Estimer votre bien immobilier à Orange et ses environs',
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'text',
      rows: 3,
      initialValue: 'Vous souhaitez connaître la valeur réelle de votre maison ou appartement à Orange, Caderousse, Piolenc, Courthézon ou dans le Haut-Vaucluse ? Obtenez une évaluation précise et personnalisée en 2 minutes.',
    },
    {
      name: 'reassuranceBadge',
      title: 'Badge de réassurance sous-titre',
      type: 'string',
      initialValue: '100% Gratuit • Confidentiel • Sans engagement • Réponse sous 48h',
    },
    {
      name: 'whyUsCards',
      title: 'Section "Pourquoi nous choisir" (Cartes de réassurance)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titre de la carte', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'icon', title: 'Nom de l\'icône (market, value, report)', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'steps',
      title: 'Section "Comment ça marche ?" (Étapes)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'stepNumber', title: 'Numéro (ex: 01)', type: 'string' },
            { name: 'title', title: 'Titre de l\'étape', type: 'string' },
            { name: 'description', title: 'Détail', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'faq',
      title: 'Section FAQ (Questions / Réponses SEO)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Réponse', type: 'text', rows: 3 },
          ],
        },
      ],
    },
  ],
}
