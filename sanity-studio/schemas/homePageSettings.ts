export default {
  name: 'homePageSettings',
  title: "Paramètres de la Page d'Accueil",
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Titre du Hero',
      type: 'string',
    },
    {
      name: 'heroSubtitle',
      title: 'Sous-titre du Hero',
      type: 'text',
    },
    {
      name: 'heroButtonText',
      title: 'Texte du bouton du Hero',
      type: 'string',
    },
    {
      name: 'heroBackgroundImage',
      title: 'Image de fond du Hero',
      type: 'image',
    },
    {
      name: 'propertiesTitle',
      title: 'Titre de la section Biens',
      type: 'string',
    },
    {
      name: 'propertiesSubtitle',
      title: 'Sous-titre de la section Biens',
      type: 'text',
    },
    {
      name: 'servicesTitle',
      title: 'Titre de la section Services',
      type: 'string',
    },
    {
      name: 'servicesSubtitle',
      title: 'Sous-titre de la section Services',
      type: 'text',
    },
    {
      name: 'services',
      title: 'Liste des Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
                name: 'icon', 
                type: 'image', 
                title: 'Icône / Image',
                description: "Uploadez une icône (SVG recommandé) ou une image pour illustrer ce service."
            },
            {name: 'title', type: 'string', title: 'Titre'},
            {name: 'description', type: 'text', title: 'Description'},
          ],
        },
      ],
    },
    {
        name: 'zonesTitle',
        title: 'Titre de la section Zones',
        type: 'string',
      },
      {
        name: 'zonesSubtitle',
        title: 'Sous-titre de la section Zones',
        type: 'text',
      },
      {
        name: 'zones',
        title: 'Liste des Zones (une par ligne)',
        type: 'text',
      },
      {
        name: 'contactTitle',
        title: 'Titre de la section Contact',
        type: 'string',
      },
      {
        name: 'contactSubtitle',
        title: 'Sous-titre de la section Contact',
        type: 'text',
      },
      {
        name: 'estimationTitle',
        title: 'Titre de la section Estimation',
        type: 'string',
      },
      {
        name: 'estimationSubtitle',
        title: 'Sous-titre de la section Estimation',
        type: 'text',
      },
      {
        name: 'estimationButtonText',
        title: 'Texte du bouton de la section Estimation',
        type: 'string',
      },
      {
        name: 'estimationBackgroundImage',
        title: 'Image de fond de la section Estimation',
        type: 'image',
      },
  ],
}