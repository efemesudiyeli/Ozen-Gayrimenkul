

import {defineConfig} from 'sanity'
import {structureTool, StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('İçerikler')
    .items([
      S.listItem()
        .title('Hakkımızda Sayfası')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !['aboutPage'].includes(listItem.getId()!)
      ),
    ])

export default defineConfig({
  name: 'default',
  title: 'ozengayrimenkul',
  projectId: 'jy06mayv',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: myStructure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})