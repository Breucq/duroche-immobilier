export default {
  name: 'sellingPageSettings',
  title: 'Page Vendre',
  type: 'document',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Titre (SEO)',
      type: 'string',
      description: 'Titre de l\'onglet et résultat Google (60-70 caractères)',
      initialValue: 'Vendre son bien immobilier à Orange & Haut-Vaucluse | Duroche Immobilier',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      description: 'Description sous le lien Google (150-160 caractères)',
      initialValue: 'Confiez la vente de votre maison ou appartement à Orange, Caderousse, Piolenc à Duroche Immobilier. Estimation juste, diffusion maximale, accompagnement de A à Z.',
    },
    {
      name: 'heroBadge',
      title: 'Badge d\'en-tête',
      type: 'string',
      initialValue: 'Expertise Immobilière • Orange & Haut-Vaucluse',
    },
    {
      name: 'heroTitle',
      title: 'Titre Principal H1 (Hero)',
      type: 'string',
      initialValue: 'Vendez votre bien au meilleur prix à Orange et ses environs',
    },
    {
      name: 'heroSubtitle',
      title: 'Sous-titre H1 (Hero)',
      type: 'text',
      rows: 3,
      initialValue: 'Valorisation sur-mesure, diffusion maximale sur +50 portails et négociation experte : nous mettons toute notre énergie au service de la réussite de votre projet de vente.',
    },
    {
      name: 'heroStats',
      title: 'Chiffres clés de réassurance (Hero)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Chiffre / Valeur (ex: 98%, 45j, +50)', type: 'string' },
            { name: 'label', title: 'Libellé (ex: Ventes au prix, Délai moyen)', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'pillarsTitle',
      title: 'Titre Section "Nos Atouts"',
      type: 'string',
      initialValue: 'Pourquoi confier votre vente à Duroche Immobilier ?',
    },
    {
      name: 'pillarsSubtitle',
      title: 'Sous-titre Section "Nos Atouts"',
      type: 'text',
      rows: 2,
      initialValue: 'Une méthodologie rigoureuse et des outils modernes pour valoriser votre patrimoine.',
    },
    {
      name: 'pillars',
      title: 'Piliers d\'expertise (Cartes Atouts)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titre de l\'atout', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'icon', title: 'Icône (chart, camera, globe, shield)', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'stepsTitle',
      title: 'Titre Section "Les Étapes"',
      type: 'string',
      initialValue: 'Votre vente en 4 étapes clés',
    },
    {
      name: 'stepsSubtitle',
      title: 'Sous-titre Section "Les Étapes"',
      type: 'text',
      rows: 2,
      initialValue: 'De la première estimation jusqu\'à la signature de l\'acte authentique chez le notaire.',
    },
    {
      name: 'steps',
      title: 'Les 4 Étapes de vente',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'stepNumber', title: 'Numéro (ex: 01)', type: 'string' },
            { name: 'title', title: 'Titre de l\'étape', type: 'string' },
            { name: 'description', title: 'Description détaillée', type: 'text', rows: 3 },
          ],
        },
      ],
    },
    {
      name: 'faqTitle',
      title: 'Titre Section FAQ',
      type: 'string',
      initialValue: 'Foire aux questions des vendeurs',
    },
    {
      name: 'faqSubtitle',
      title: 'Sous-titre Section FAQ',
      type: 'text',
      rows: 2,
      initialValue: 'Toutes les réponses à vos interrogations pour aborder la vente en toute confiance.',
    },
    {
      name: 'faq',
      title: 'Questions / Réponses FAQ (SEO)',
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
