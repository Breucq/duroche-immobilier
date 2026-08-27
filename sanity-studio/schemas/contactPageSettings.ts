export default {
  name: 'contactPageSettings',
  title: 'Paramètres de la Page Contact',
  type: 'document',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Titre (SEO)',
      type: 'string',
      description: 'Titre apparaissant dans l\'onglet du navigateur et les résultats Google',
      initialValue: 'Contact Duroche Immobilier | Conseillers Immobiliers Orange & Haut-Vaucluse',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      description: 'Description pour le référencement Google',
      initialValue: 'Besoin d\'un conseil ou d\'une estimation ? Contactez Sylvie Roche & Thomas Dubreucq (Duroche Immobilier). Accompagnement sur mesure à Orange, Caderousse et leurs environs.',
    },
    {
      name: 'title',
      title: 'Titre Principal (H1)',
      type: 'string',
      initialValue: 'Contactez votre Duo Immobilier dans le Haut-Vaucluse',
    },
    {
      name: 'introText',
      title: 'Texte d\'introduction (Riche en mots-clés)',
      type: 'text',
      rows: 4,
      initialValue: 'Vous avez un projet d\'achat, de vente ou besoin d\'un conseil technique sur votre bien ? Sylvie Roche et Thomas Dubreucq vous accompagnent à Orange, Caderousse, Piolenc, Courthézon et dans l\'ensemble du secteur du Haut-Vaucluse, ainsi qu\'à distance pour vos projets en Corse ou à Paris.\n\nRemplissez le formulaire ci-dessous ou contactez-nous directement par téléphone pour échanger sur vos besoins.',
    },
    {
      name: 'googleBusinessUrl',
      title: 'Lien vers la fiche Google Business Profile',
      type: 'url',
      description: 'Lien direct vers votre fiche Google (ex: pour voir les avis ou l\'itinéraire)',
      initialValue: 'https://maps.google.com/?q=Duroche+Immobilier+Orange',
    },
    {
      name: 'phone',
      title: 'Numéro de téléphone direct (Ligne agence / contact)',
      type: 'string',
      initialValue: '07 60 31 37 55',
    },
    {
      name: 'advisors',
      title: 'Vos Conseillers (Duo Immobilier)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nom & Prénom', type: 'string' },
            { name: 'role', title: 'Spécialité / Rôle', type: 'string' },
            { name: 'email', title: 'E-mail (optionnel)', type: 'string' },
          ],
        },
      ],
      initialValue: [
        {
          name: 'Sylvie Roche',
          role: 'Expertise Bâtiment & Technique',
          email: 'sylvie.roche@duroche.fr',
        },
        {
          name: 'Thomas Dubreucq',
          role: 'Marketing & Commercialisation',
          email: 'thomas.dubreucq@duroche.fr',
        },
      ],
    },
    {
      name: 'generalEmail',
      title: 'E-mail général de contact',
      type: 'string',
      initialValue: 'contact@duroche.fr',
    },
    {
      name: 'address',
      title: 'Adresse administrative / Siège',
      type: 'string',
      initialValue: 'Orange, 84100 (Haut-Vaucluse)',
    },
    {
      name: 'reassuranceBlocks',
      title: 'Blocs d\'accès rapide & réassurance (Bas de page)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titre du bloc', type: 'string' },
            { name: 'text', title: 'Texte / Description', type: 'text', rows: 2 },
            { name: 'linkText', title: 'Texte du lien CTA (optionnel)', type: 'string' },
            { name: 'linkUrl', title: 'URL du lien (optionnel)', type: 'string' },
            { name: 'badge', title: 'Petit badge / label (optionnel)', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'interventionZones',
      title: 'Communes d\'intervention (SEO Footprint)',
      type: 'string',
      description: 'Liste des communes desservies',
      initialValue: 'Orange (84100), Caderousse (84860), Piolenc (84850), Courthézon (84350), Jonquières, Camaret-sur-Aigues, Uchaux, Mornas, Sérignan-du-Comtat, Châteauneuf-du-Pape.',
    },
  ],
}
