import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import ImportTool from './components/ImportTool'

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
    deskTool({
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
    visionTool(),
  ],

  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'import-tool',
        title: 'Importer un bien',
        component: ImportTool,
      },
    ]
  },

  schema: {
    types: schemaTypes,
  },
})