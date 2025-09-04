

import {defineConfig} from 'sanity'
import {structureTool, StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'


export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('İçerik Yönetimi')
    .items([
      // Sayfa İçerikleri Grubu
      S.listItem()
        .title('Sayfa İçerikleri')
        .child(
          S.list()
            .title('Sayfa İçerikleri')
            .items([
              S.listItem()
                .title('Ana Sayfa')
                .child(
                  S.document()
                    .schemaType('hero')
                    .documentId('hero')
                ),
              S.listItem()
                .title('Hakkımızda')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                ),
              S.listItem()
                .title('Danışmanlarımız')
                .child(
                  S.document()
                    .schemaType('teamPage')
                    .documentId('teamPage')
                ),
              S.listItem()
                .title('İletişim')
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                ),
              S.listItem()
                .title('Portföy')
                .child(
                  S.document()
                    .schemaType('portfolioPage')
                    .documentId('portfolioPage')
                ),
            ])
        ),
      
      S.divider(),
      
      // Emlak İçerikleri Grubu
      S.listItem()
        .title('Emlak İçerikleri')
        .child(
          S.list()
            .title('Emlak İçerikleri')
            .items([
              S.listItem()
                .title('Emlak İlanları')
                .child(S.documentTypeList('property')),
              S.listItem()
                .title('Danışmanlar')
                .child(S.documentTypeList('agent')),
            ])
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