import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, Wrench, ChevronRight,
  FileText, Globe, Shield, Zap, Package, Search,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12'

/* ── CATEGORY DATA ─────────────────────────────────────────────────────── */
const hardwareCategories = [
  { icon: Globe, label: 'Supplier Directory', slug: 'business', desc: 'Vendors, distributors & retailers' },
  { icon: FileText, label: 'Product Guides', slug: 'shopping', desc: 'Buying guides, comparisons & specs' },
  { icon: Wrench, label: 'Tool Reviews', slug: 'home-improvement', desc: 'Hand tools, power tools & picks' },
  { icon: Shield, label: 'Safety Resources', slug: 'service', desc: 'PPE, standards & compliance' },
  { icon: Package, label: 'Material References', slug: 'industry-manufacturing', desc: 'Steel, timber, cement & hardware' },
  { icon: Zap, label: 'Technical Documents', slug: 'electric', desc: 'Datasheets, catalogues & manuals' },
]

/* ── HERO ────────────────────────────────────────────────────────────────── */
export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const totalPosts = posts.length

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 sm:py-20 lg:py-28`}>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

          {/* Left — Typographic hero */}
          <div>
            {/* Section label */}
            <p
              className="mb-4 text-[11px] font-600 uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]"
              style={bodyFont}
            >
              ( {pagesContent.home.hero.badge} )
            </p>

            {/* Huge hero text — Boldway-style */}
            <h1 style={displayFont}>
              <span
                className="block text-[clamp(4rem,14vw,13rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em] text-[var(--slot4-accent)] boldway-animate"
              >
                {pagesContent.home.hero.title[0]}
              </span>
              <span
                className="block text-[clamp(4rem,14vw,13rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em] text-[var(--slot4-page-text)] boldway-animate boldway-animate-delay-1"
              >
                {pagesContent.home.hero.title[1]}
              </span>
            </h1>

            {/* Description */}
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p
                className="max-w-md text-base leading-7 text-[var(--slot4-muted-text)] boldway-animate boldway-animate-delay-2"
                style={bodyFont}
              >
                {pagesContent.home.hero.description}
              </p>
              <div className="flex shrink-0 flex-wrap gap-3 boldway-animate boldway-animate-delay-3">
                <Link
                  href={primaryRoute}
                  className="inline-flex items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-6 py-3 text-[12px] font-700 uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-transparent hover:text-[var(--slot4-accent)]"
                  style={bodyFont}
                >
                  Browse Resources <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 border border-[var(--editable-border)] px-6 py-3 text-[12px] font-700 uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition-all duration-200 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  style={bodyFont}
                >
                  <Search className="h-4 w-4" /> Search
                </Link>
              </div>
            </div>
          </div>

          {/* Right — stats panel */}
          <div className="hidden w-[220px] shrink-0 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 lg:block">
            <p
              className="text-[10px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]"
              style={bodyFont}
            >
              At a glance
            </p>
            <div className="mt-5 grid gap-5">
              <div>
                <p
                  className="text-3xl font-900 leading-none text-[var(--slot4-page-text)]"
                  style={displayFont}
                >
                  {totalPosts > 0 ? `${totalPosts}+` : '100+'}
                </p>
                <p className="mt-1 text-xs text-[var(--slot4-muted-text)]" style={bodyFont}>
                  Curated resources
                </p>
              </div>
              <div className="h-px bg-[var(--editable-border)]" />
              <div>
                <p
                  className="text-3xl font-900 leading-none text-[var(--slot4-page-text)]"
                  style={displayFont}
                >
                  6+
                </p>
                <p className="mt-1 text-xs text-[var(--slot4-muted-text)]" style={bodyFont}>
                  Categories
                </p>
              </div>
              <div className="h-px bg-[var(--editable-border)]" />
              <div>
                <p
                  className="text-3xl font-900 leading-none text-[var(--slot4-page-text)]"
                  style={displayFont}
                >
                  ∞
                </p>
                <p className="mt-1 text-xs text-[var(--slot4-muted-text)]" style={bodyFont}>
                  Updated daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar strip */}
      <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
        <div className={`${container} py-4`}>
          <form action="/search" className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3 border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 transition-colors focus-within:border-[var(--slot4-accent)]">
              <Search className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
              <input
                name="q"
                type="search"
                placeholder={pagesContent.home.hero.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm font-500 outline-none placeholder:text-[var(--slot4-muted-text)]"
                style={bodyFont}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-6 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-white transition-all hover:bg-transparent hover:text-[var(--slot4-accent)]"
              style={bodyFont}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ── CATEGORY STRIP (Boldway services style) ─────────────────────────── */
export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
      <div className={`${container} py-16 sm:py-20`}>
        {/* Section label */}
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <p
              className="mb-3 text-[11px] font-600 text-[var(--slot4-muted-text)] uppercase tracking-[0.2em]"
              style={bodyFont}
            >
              ( Categories )
            </p>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-[var(--slot4-page-text)]"
              style={displayFont}
            >
              What We <span className="text-[var(--slot4-accent)]">Cover.</span>
            </h2>
          </div>
          <Link
            href={primaryRoute}
            className="hidden items-center gap-2 border border-[var(--editable-border)] px-5 py-2.5 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-page-text)] transition-all hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
            style={bodyFont}
          >
            All Resources <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Category list — Boldway services style */}
        <div className="divide-y divide-[var(--editable-border)]">
          {hardwareCategories.map((cat, index) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.label}
                href={`${primaryRoute}?category=${cat.slug}`}
                className="group flex items-center justify-between gap-6 py-5 transition-colors duration-200 hover:text-[var(--slot4-accent)]"
              >
                <div className="flex items-center gap-5">
                  <span
                    className="text-[11px] font-500 text-[var(--slot4-muted-text)] tabular-nums"
                    style={bodyFont}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="text-[clamp(1.4rem,3.5vw,2.8rem)] font-800 uppercase leading-none tracking-[-0.01em] text-[var(--slot4-page-text)] transition-colors group-hover:text-[var(--slot4-accent)]"
                    style={displayFont}
                  >
                    {cat.label}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className="hidden text-sm text-[var(--slot4-muted-text)] sm:block"
                    style={bodyFont}
                  >
                    {cat.desc}
                  </p>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition-all group-hover:border-[var(--slot4-accent)] group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── FEATURED POSTS (dark section, Boldway Insights style) ──────────── */
function FeaturedCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post) || 'Resource'
  const image = getEditablePostImage(post)
  const excerpt = getExcerpt(post, 120)

  return (
    <Link
      href={href}
      className="group flex flex-col border-b border-white/10 py-6 transition-colors last:border-0 hover:border-[var(--slot4-accent)]/30 sm:border-b sm:py-7"
    >
      <div className="flex items-start gap-5">
        {image && !image.includes('placeholder') ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden sm:h-24 sm:w-24">
            <img
              src={image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-white/5 sm:h-24 sm:w-24">
            <Bookmark className="h-7 w-7 text-[var(--slot4-accent)]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-accent)]"
              style={bodyFont}
            >
              {category}
            </span>
            <span className="text-[10px] text-white/40" style={bodyFont}>
              No. {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3
            className="mt-2 text-xl font-700 uppercase leading-tight tracking-[-0.01em] text-white transition-colors group-hover:text-[var(--slot4-accent)] sm:text-2xl"
            style={displayFont}
          >
            {post.title}
          </h3>
          {excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55" style={bodyFont}>
              {excerpt}
            </p>
          ) : null}
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-all group-hover:text-[var(--slot4-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 6)
  if (!pool.length) return null

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-dark-bg)]">
      <div className={`${container} py-16 sm:py-20`}>
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p
              className="mb-3 text-[11px] font-600 uppercase tracking-[0.2em] text-white/50"
              style={bodyFont}
            >
              ( Latest Resources )
            </p>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-white"
              style={displayFont}
            >
              Top <span className="text-[var(--slot4-accent)]">Picks.</span>
            </h2>
          </div>
          <Link
            href={primaryRoute}
            className="hidden items-center gap-2 border border-white/20 px-5 py-2.5 text-[11px] font-700 uppercase tracking-[0.16em] text-white/70 transition-all hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
            style={bodyFont}
          >
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Featured post list */}
        <div>
          {pool.map((post, index) => (
            <FeaturedCard
              key={post.id || post.slug}
              post={post}
              href={postHref(primaryTask, post, primaryRoute)}
              index={index}
            />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 sm:hidden">
          <Link
            href={primaryRoute}
            className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-white/70 transition-all hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            style={bodyFont}
          >
            View All Resources <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── TIME-BASED DISCOVERY ────────────────────────────────────────────── */
function ResourceCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post) || 'Resource'
  const excerpt = getExcerpt(post, 110)
  const image = getEditablePostImage(post)
  const hasImage = image && !image.includes('placeholder')

  return (
    <Link
      href={href}
      className="group flex flex-col border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]"
    >
      {hasImage ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img
            src={image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 border border-white/20 bg-white/90 px-2.5 py-1 text-[10px] font-700 uppercase tracking-[0.18em] text-[var(--slot4-page-text)]" style={bodyFont}>
            {category}
          </span>
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-[var(--slot4-warm)]">
          <Bookmark className="h-8 w-8 text-[var(--slot4-accent)]/40" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {!hasImage ? (
          <span
            className="mb-2 text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-accent)]"
            style={bodyFont}
          >
            {category}
          </span>
        ) : null}
        <h3
          className="text-lg font-700 uppercase leading-tight tracking-[-0.01em] text-[var(--slot4-page-text)] transition-colors group-hover:text-[var(--slot4-accent)]"
          style={displayFont}
        >
          {post.title}
        </h3>
        {excerpt ? (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" style={bodyFont}>
            {excerpt}
          </p>
        ) : null}
        <span
          className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-accent)]"
          style={bodyFont}
        >
          View resource <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string; red: string }> = {
  spotlight: { eyebrow: 'This week', title: 'New', red: 'Additions.' },
  browse: { eyebrow: 'Trending', title: 'Popular', red: 'Now.' },
  index: { eyebrow: 'Archive', title: 'From the', red: 'Collection.' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, i) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More', red: 'Resources.' }
        const dark = i % 2 !== 0
        return (
          <section
            key={section.key}
            className="border-b border-[var(--editable-border)]"
            style={{ background: dark ? 'var(--slot4-warm)' : 'var(--slot4-surface-bg)' }}
          >
            <div className={`${container} py-16 sm:py-20`}>
              {/* Section header */}
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p
                    className="mb-3 text-[11px] font-600 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]"
                    style={bodyFont}
                  >
                    ( {copy.eyebrow} )
                  </p>
                  <h2
                    className="text-[clamp(2rem,5vw,4.5rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-[var(--slot4-page-text)]"
                    style={displayFont}
                  >
                    {copy.title} <span className="text-[var(--slot4-accent)]">{copy.red}</span>
                  </h2>
                </div>
                <Link
                  href={section.href || primaryRoute}
                  className="hidden items-center gap-2 border border-[var(--editable-border)] px-5 py-2.5 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition-all hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
                  style={bodyFont}
                >
                  See all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post) => (
                  <ResourceCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ── CTA BAND ─────────────────────────────────────────────────────────── */
export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-accent)]">
      <div className={`${container} py-16 sm:py-20`}>
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="mb-3 text-[11px] font-600 uppercase tracking-[0.2em] text-white/70"
              style={bodyFont}
            >
              ( Get Involved )
            </p>
            <h2
              className="max-w-2xl text-[clamp(2.5rem,6vw,5rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-white"
              style={displayFont}
            >
              Know a great hardware resource?
            </h2>
            <p className="mt-4 max-w-lg text-base text-white/80" style={bodyFont}>
              Submit supplier links, product guides, and hardware resources to share with the professional community.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 border border-white bg-white px-7 py-3.5 text-[12px] font-700 uppercase tracking-[0.14em] text-[var(--slot4-accent)] transition-all duration-200 hover:bg-transparent hover:text-white"
              style={bodyFont}
            >
              Submit Resource <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/50 px-7 py-3.5 text-[12px] font-700 uppercase tracking-[0.14em] text-white transition-all duration-200 hover:border-white hover:bg-white/10"
              style={bodyFont}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
