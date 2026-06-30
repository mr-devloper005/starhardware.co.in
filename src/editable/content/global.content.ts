import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Premium hardware resources & guides',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Hardware resources & guides',
    primaryLinks: [
      { label: 'Resources', href: '/sbm' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse Resources', href: '/sbm' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Tools, guides, and supplier resources for hardware professionals.',
    description: 'Your go-to platform for curated hardware resources, product guides, supplier directories, and industry insights — all in one place.',
    email: 'hello@starhardware.co.in',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Resources', href: '/sbm' },
          { label: 'Search', href: '/search' },
          { label: 'About', href: '/about' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Contact', href: '/contact' },
          { label: 'Submit', href: '/create' },
        ],
      },
    ],
    bottomNote: 'Built for hardware professionals and enthusiasts.',
  },
  commonLabels: {
    readMore: 'View resource',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
