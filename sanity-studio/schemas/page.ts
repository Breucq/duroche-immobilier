export default {
  name: 'page',
  title: 'Pages',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Titre de la Page',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'content',
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'text',
      rows: 3,
      description: "Une courte introduction ou slogan affiché sous le titre.",
      group: 'content',
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule: any) => Rule.required(),
      group: 'content',
    },
    {
        name: 'coverImage',
        title: 'Image de couverture',
        type: 'image',
        options: { hotspot: true },
        group: 'content',
    },
    {
      name: 'content',
      title: 'Contenu de la Page',
      type: 'array', 
      of: [
        {
            type: 'block',
            styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
                {title: 'Citation', value: 'blockquote'},
            ],
        },
        { type: 'image' }
      ],
      description: "Contenu riche de la page (texte, titres, images, listes).",
      group: 'content',
    },
    {
      name: 'showInHeader',
      title: 'Afficher dans le menu principal (Header)',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    },
    {
      name: 'showInFooter',
      title: 'Afficher dans le pied de page (Footer)',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    },
    // SEO Fields
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: "Titre pour les moteurs de recherche. Si vide, le titre de la page sera utilisé.",
      group: 'seo',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: "Description pour les moteurs de recherche.",
      group: 'seo',
    },
    {
      name: 'metaKeywords',
      title: 'Meta Keywords',
      type: 'string',
      description: "Mots-clés séparés par des virgules.",
      group: 'seo',
    },
  ],
}