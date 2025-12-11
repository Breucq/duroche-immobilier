import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemas'
import ImportTool from './components/ImportTool'
import PropertyManager from './components/PropertyManager'
import {HomeIcon, UlistIcon, DownloadIcon} from '@sanity/icons'

// Helper function to create singleton document structure
const singletonListItem = (S: any, typeName: string, title: string) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName))

export default defineConfig({
  name: 'default',
  title: 'Duroche Immobilier - Administration',

  projectId: 'jvrtf17r',
  dataset: 'production',

  plugins: [
    structureTool({
      title: 'Contenu',
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            // Singleton documents
            singletonListItem(S, 'siteSettings', 'Paramètres du Site'),
            singletonListItem(S, 'homePageSettings', "Page d'Accueil"),
            singletonListItem(S, 'footerSettings', 'Pied de Page'),
            singletonListItem(S, 'estimationPageSettings', 'Page Estimation'),
            S.divider(),
            // Regular document types
            S.documentTypeListItem('property').title('Biens Immobiliers'),
            S.documentTypeListItem('article').title('Articles de Blog'),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    media(), // Plugin Médiathèque pour upload multiple
    visionTool(),
  ],

  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'property-manager',
        title: 'Gestion des Biens',
        icon: UlistIcon,
        component: PropertyManager,
      },
      {
        name: 'import-tool',
        title: 'Importer (CSV/URL)',
        icon: DownloadIcon,
        component: ImportTool,
      },
    ]
  },

  schema: {
    types: schemaTypes,
  },
})