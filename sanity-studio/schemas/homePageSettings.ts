import {defineField, defineType} from 'sanity'
import {serviceIconOptions} from '../../components/ServiceIcons'

export default defineType({
  name: 'homePageSettings',
  title: "Paramètres de la Page d'Accueil",
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre du Hero',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sous-titre du Hero',
      type: 'text',
    }),
    defineField({
      name: 'heroButtonText',
      title: 'Texte du bouton du Hero',
      type: 'string',
    }),
    defineField({
      name: 'heroBackgroundImage',
      title: 'Image de fond du Hero',
      type: 'image',
    }),
    defineField({
      name: 'propertiesTitle',
      title: 'Titre de la section Biens',
      type: 'string',
    }),
    defineField({
      name: 'propertiesSubtitle',
      title: 'Sous-titre de la section Biens',
      type: 'text',
    }),
    defineField({
      name: 'servicesTitle',
      title: 'Titre de la section Services',
      type: 'string',
    }),
    defineField({
      name: 'servicesSubtitle',
      title: 'Sous-titre de la section Services',
      type: 'text',
    }),
    defineField({
      name: 'services',
      title: 'Liste des Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'icon', type: 'string', title: 'Icône', options: {list: serviceIconOptions.map(o => ({title: o.label, value: o.value}))}},
            {name: 'title', type: 'string', title: 'Titre'},
            {name: 'description', type: 'text', title: 'Description'},
          ],
        },
      ],
    }),
    defineField({
        name: 'zonesTitle',
        title: 'Titre de la section Zones',
        type: 'string',
      }),
      defineField({
        name: 'zonesSubtitle',
        title: 'Sous-titre de la section Zones',
        type: 'text',
      }),
      defineField({
        name: 'zones',
        title: 'Liste des Zones (une par ligne)',
        type: 'text',
      }),
      defineField({
        name: 'contactTitle',
        title: 'Titre de la section Contact',
        type: 'string',
      }),
      defineField({
        name: 'contactSubtitle',
        title: 'Sous-titre de la section Contact',
        type: 'text',
      }),
      defineField({
        name: 'estimationTitle',
        title: 'Titre de la section Estimation',
        type: 'string',
      }),
      defineField({
        name: 'estimationSubtitle',
        title: 'Sous-titre de la section Estimation',
        type: 'text',
      }),
      defineField({
        name: 'estimationButtonText',
        title: 'Texte du bouton de la section Estimation',
        type: 'string',
      }),
      defineField({
        name: 'estimationBackgroundImage',
        title: 'Image de fond de la section Estimation',
        type: 'image',
      }),
  ],
})
