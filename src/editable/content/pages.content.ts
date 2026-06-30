import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Hardware Resources, Guides & Supplier Directory',
      description: 'Discover curated hardware resources, product guides, tools, and supplier links for professionals and enthusiasts.',
      openGraphTitle: 'Hardware Resources, Guides & Supplier Directory',
      openGraphDescription: 'Your go-to platform for hardware resources, product guides, tool reviews, and supplier directories in India.',
      keywords: ['hardware resources', 'tools guide', 'supplier directory', 'hardware products india', 'construction materials'],
    },
    hero: {
      badge: 'Curated Hardware Resources',
      title: ['HARDWARE', 'RESOURCES.'],
      description: 'Discover curated tools, supplier guides, product reviews, and professional resources for the hardware industry — all in one place.',
      primaryCta: { label: 'Browse Resources', href: '/sbm' },
      secondaryCta: { label: 'Get in Touch', href: '/contact' },
      searchPlaceholder: 'Search tools, suppliers, guides…',
      focusLabel: 'Discover',
      featureCardBadge: 'latest resources',
      featureCardTitle: 'Curated hardware resources updated regularly.',
      featureCardDescription: 'Expert-curated links to suppliers, product guides, and professional tools.',
    },
    intro: {
      badge: 'About the platform',
      title: 'The definitive resource hub for hardware professionals.',
      paragraphs: [
        'Star Hardware brings together supplier directories, product guides, tool reviews, and industry resources so professionals can find what they need faster.',
        'Whether you are sourcing materials, comparing suppliers, or researching the best tools for the job — this platform keeps everything connected and easy to navigate.',
        'Built for contractors, builders, hardware retailers, and DIY enthusiasts who demand quality information and trusted supplier connections.',
      ],
      sideBadge: 'What we cover',
      sidePoints: [
        'Curated links to trusted hardware suppliers and distributors.',
        'Product guides for hand tools, power tools, and construction materials.',
        'Safety equipment resources and compliance guides.',
        'Electrical, plumbing, and building material references.',
      ],
      primaryLink: { label: 'Browse Resources', href: '/sbm' },
      secondaryLink: { label: 'Contact Us', href: '/contact' },
    },
    cta: {
      badge: 'Get Started',
      title: 'Find the hardware resources you need — right here.',
      description: 'Browse our curated collection of supplier links, product guides, and professional resources for every hardware category.',
      primaryCta: { label: 'Browse Resources', href: '/sbm' },
      secondaryCta: { label: 'Submit a Resource', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest entries in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'Your trusted partner for hardware knowledge.',
    description: `${slot4BrandConfig.siteName} is India's curated platform for hardware resources — connecting professionals with trusted suppliers, product guides, and industry knowledge.`,
    paragraphs: [
      'We built this platform because finding reliable hardware information in India was harder than it needed to be. Too many scattered sources, outdated supplier lists, and generic product descriptions.',
      'Star Hardware changes that by curating only the best resources — vetted supplier directories, detailed product guides, safety compliance references, and expert tool reviews — all in one accessible place.',
      'Whether you are a contractor, a hardware retailer, a builder, or a passionate DIY enthusiast, this is your go-to resource hub for everything hardware.',
    ],
    values: [
      {
        title: 'Quality over quantity',
        description: 'Every resource on this platform is curated for relevance and quality. We prioritize depth and accuracy over breadth and noise.',
      },
      {
        title: 'Professionals first',
        description: 'Built for contractors, builders, and hardware professionals who need accurate supplier information and product knowledge to do their jobs well.',
      },
      {
        title: 'Trusted & updated',
        description: 'We continuously review and update our resource collection so you always have access to current, reliable hardware information.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Let\'s talk hardware.',
    description: 'Have a supplier to recommend? A resource to share? Or need help finding something specific? Reach out and we will get back to you promptly.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search Hardware Resources',
      description: 'Search our curated collection of hardware resources, supplier guides, product reviews, and industry references.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find hardware resources fast.',
      description: 'Search by keyword, category, or resource type across our entire curated hardware knowledge base.',
      placeholder: 'Search tools, suppliers, materials, guides…',
    },
    resultsTitle: 'Latest hardware resources',
  },
  create: {
    metadata: {
      title: 'Submit a Resource',
      description: 'Submit a hardware resource, supplier link, or guide to our curated platform.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Login to submit resources.',
      description: 'Create an account to submit hardware resources, supplier links, and guides to our platform.',
    },
    hero: {
      badge: 'Resource submission',
      title: 'Share a hardware resource.',
      description: 'Submit supplier links, product guides, tool reviews, and hardware references for our editorial team to review.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Submit resource',
    successTitle: 'Resource submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login to your Star Hardware account.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Login to your account to submit resources, save favourites, and manage your contributions.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create your Star Hardware account.',
      badge: 'Join the platform',
      title: 'Create your account.',
      description: 'Join Star Hardware to submit resources, save your favourite guides, and connect with the hardware community.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'More resources',
      fallbackDescription: 'Profile details will appear here.',
      visitButton: 'Visit Website',
    },
  },
} as const
