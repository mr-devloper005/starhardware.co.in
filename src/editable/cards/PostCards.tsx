import Link from 'next/link'
import { ArrowUpRight, Bookmark, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ── Feature card — dark overlay with large title ─────────────────────── */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group relative block min-w-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(0,0,0,0.16)]"
    >
      <div className="relative min-h-[520px] bg-[var(--slot4-dark-bg)] lg:min-h-[620px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Accent line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--slot4-accent)]" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <span
            className="text-[10px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]"
            style={bodyFont}
          >
            {label}
          </span>
          <h3
            className="mt-4 max-w-3xl text-[clamp(2rem,5vw,4.5rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-white"
            style={displayFont}
          >
            {post.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65" style={bodyFont}>
            {getEditableExcerpt(post, 190)}
          </p>
          <span
            className="mt-8 inline-flex w-fit items-center gap-2 border border-white/30 bg-white/10 px-5 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-white backdrop-blur transition-all group-hover:bg-white group-hover:text-black"
            style={bodyFont}
          >
            Read more <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ── Rail card — image + category + title (vertical) ─────────────────── */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group block min-w-0 overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-panel-bg)]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="absolute left-3 top-3 border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-700 uppercase tracking-[0.18em] text-white backdrop-blur-sm"
          style={bodyFont}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-accent)]" style={bodyFont}>
          {getEditableCategory(post)}
        </p>
        <h3
          className="mt-2 line-clamp-3 text-xl font-900 uppercase leading-tight tracking-[-0.01em]"
          style={displayFont}
        >
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]" style={bodyFont}>
          {getEditableExcerpt(post, 120)}
        </p>
        <span
          className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.14em] text-[var(--slot4-muted-text)] transition-colors group-hover:text-[var(--slot4-accent)]"
          style={bodyFont}
        >
          View <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/* ── Compact index card — numbered, horizontal ───────────────────────── */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 gap-4 border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-4 transition-all duration-200 hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
        <span className="text-[12px] font-700 text-[var(--slot4-accent)]" style={bodyFont}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-accent)]" style={bodyFont}>
          {getEditableCategory(post)}
        </p>
        <h3
          className="mt-1.5 line-clamp-2 text-lg font-900 uppercase leading-tight tracking-[-0.01em]"
          style={displayFont}
        >
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]" style={bodyFont}>
          {getEditableExcerpt(post, 100)}
        </p>
      </div>
      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

/* ── Article list card — wide with left image ────────────────────────── */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] sm:grid-cols-[240px_minmax(0,1fr)]"
    >
      <div className="relative aspect-[16/12] overflow-hidden bg-[var(--slot4-panel-bg)] sm:aspect-auto sm:min-h-[200px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 p-6">
        <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-accent)]" style={bodyFont}>
          Read {String(index + 1).padStart(2, '0')}
        </p>
        <h2
          className="mt-3 line-clamp-3 text-2xl font-900 uppercase leading-tight tracking-[-0.01em] sm:text-3xl"
          style={displayFont}
        >
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]" style={bodyFont}>
          {getEditableExcerpt(post, 180)}
        </p>
        <span
          className="mt-5 inline-flex items-center gap-2 text-[11px] font-700 uppercase tracking-[0.14em] text-[var(--slot4-muted-text)] transition-colors group-hover:text-[var(--slot4-accent)]"
          style={bodyFont}
        >
          Open article <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* ── Bookmark card — no image, typographic style ─────────────────────── */
export function BookmarkCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const website = typeof content.website === 'string' ? content.website : typeof content.url === 'string' ? content.url : ''
  const domain = website ? website.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : ''

  return (
    <Link
      href={href}
      className="group flex min-w-0 flex-col gap-4 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-accent)]">
          <Bookmark className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-accent)]" style={bodyFont}>
          {String(index + 1).padStart(2, '0')} — {getEditableCategory(post)}
        </span>
      </div>

      <h3
        className="line-clamp-2 text-xl font-900 uppercase leading-tight tracking-[-0.01em]"
        style={displayFont}
      >
        {post.title}
      </h3>

      <p className="line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" style={bodyFont}>
        {getEditableExcerpt(post, 120)}
      </p>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--editable-border)] pt-3">
        <span className="truncate text-[11px] font-500 text-[var(--slot4-muted-text)]" style={bodyFont}>
          {domain || 'View resource'}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition-colors group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

/* ── Generic fallback card ───────────────────────────────────────────── */
export function GenericCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-center gap-4 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 transition-all duration-200 hover:border-[var(--slot4-accent)]/40"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
        <FileText className="h-5 w-5 text-[var(--slot4-muted-text)]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="line-clamp-2 text-base font-900 uppercase leading-tight tracking-[-0.01em]"
          style={displayFont}
        >
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-[var(--slot4-muted-text)]" style={bodyFont}>
          {getEditableExcerpt(post, 80)}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}
