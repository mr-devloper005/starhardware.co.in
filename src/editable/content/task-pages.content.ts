import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Articles & guides',
    headline: 'In-depth hardware guides and industry articles.',
    description: 'Detailed product guides, how-to articles, comparison reviews, and expert insights for hardware professionals and enthusiasts.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'Authoritative hardware content written for professionals.',
    chips: ['Product guides', 'How-to articles', 'Industry insights'],
  },
  classified: {
    eyebrow: 'Classifieds',
    headline: 'Hardware listings, offers, and trade notices.',
    description: 'Find hardware deals, trade offers, surplus stock, and time-sensitive notices from suppliers and retailers.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Scan fast, act on the best hardware deals.',
    chips: ['Trade offers', 'Stock clearance', 'Supplier notices'],
  },
  sbm: {
    eyebrow: 'Curated resources',
    headline: 'The best hardware resources, links, and references.',
    description: 'A curated library of supplier directories, product pages, technical references, safety guides, and professional tools for the hardware industry.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Vetted resources for hardware professionals.',
    chips: ['Supplier links', 'Product references', 'Technical guides'],
  },
  profile: {
    eyebrow: 'Profiles',
    headline: 'Suppliers, brands, and hardware professionals.',
    description: 'Discover trusted suppliers, hardware brands, and industry professionals with detailed profiles and contact information.',
    filterLabel: 'Filter by type',
    secondaryNote: 'Verified hardware industry profiles.',
    chips: ['Suppliers', 'Brands', 'Professionals'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Technical documents, specs, and reference guides.',
    description: 'Download technical specifications, product catalogues, safety data sheets, and industry reference documents.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Downloadable technical reference material.',
    chips: ['Spec sheets', 'Catalogues', 'Safety guides'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Hardware suppliers and retailers near you.',
    description: 'Find and compare hardware suppliers, distributors, and retailers with ratings, contact details, and business information.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Verified hardware business directory.',
    chips: ['Suppliers', 'Distributors', 'Retailers'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Hardware products and project inspiration.',
    description: 'Browse product images, installation guides, project photos, and visual references for hardware and construction.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Visual hardware content and inspiration.',
    chips: ['Products', 'Projects', 'Installation guides'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
