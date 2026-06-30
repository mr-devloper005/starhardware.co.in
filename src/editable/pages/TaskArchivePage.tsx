import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase = 'group block border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--tk-accent)]/40 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]'

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">

        {/* Archive header */}
        <header className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:py-20 sm:px-8 lg:px-12">
            <p
              className="text-[11px] font-600 uppercase tracking-[0.28em] text-[var(--tk-muted)]"
              style={bodyFont}
            >
              ( {theme.kicker} )
            </p>
            <h1
              className="mt-5 max-w-4xl text-[clamp(2.5rem,7vw,6rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-[var(--tk-text)]"
              style={displayFont}
            >
              {voice?.headline?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-[var(--tk-accent)]">
                {voice?.headline?.split(' ').slice(-1).join('')}
              </span>
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-7 text-[var(--tk-muted)]"
              style={bodyFont}
            >
              {voice?.description || theme.note}
            </p>

            {voice?.chips?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {voice.chips.map((chip) => (
                  <span
                    key={chip}
                    className="border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-600 uppercase tracking-[0.14em] text-[var(--tk-muted)]"
                    style={bodyFont}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Filter bar */}
            <div className="mt-10 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--tk-muted)]" style={bodyFont}>
                <span className="font-700 text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'result' : 'results'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-3">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-10 appearance-none border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-10 text-sm font-600 text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                    style={bodyFont}
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button
                  className="inline-flex h-10 items-center border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 text-[11px] font-700 uppercase tracking-[0.14em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]"
                  style={bodyFont}
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Ad slot — in-feed, one per archive page */}
        <div className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-6 sm:px-8 lg:px-12">
            <Ads slot="in-feed" showLabel className="mx-auto w-full" />
          </div>
        </div>

        {/* Results */}
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-16 sm:px-8 lg:px-12">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2
                className="mt-5 text-2xl font-800 uppercase tracking-[-0.01em]"
                style={displayFont}
              >
                Nothing here yet
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>
                Try another category, or check back after new {label.toLowerCase()} are published.
              </p>
            </div>
          )}

          {/* Pagination */}
          {posts.length ? (
            <nav className="mt-14 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="border border-[var(--tk-line)] px-5 py-2.5 font-600 transition-all hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                  style={bodyFont}
                >
                  Previous
                </Link>
              ) : null}
              <span
                className="border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-600 text-[var(--tk-muted)]"
                style={bodyFont}
              >
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="border border-[var(--tk-line)] px-5 py-2.5 font-600 transition-all hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                  style={bodyFont}
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--tk-accent)]" style={bodyFont}>
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-accent)]" style={bodyFont}>{category}</span>
          <span className="text-[10px] text-[var(--tk-muted)]" style={bodyFont}>· {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2
          className="mt-3 text-2xl font-800 uppercase leading-tight tracking-[-0.01em]"
          style={displayFont}
        >
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>{getSummary(post)}</p>
        <CardArrow label="Read article" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-8 w-8 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-800 uppercase tracking-[-0.01em]" style={displayFont}>{post.title}</h2>
        <p className="mt-2 line-clamp-1 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-500 text-[var(--tk-muted)]" style={bodyFont}>
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition-colors group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <span className="text-3xl font-900 uppercase tracking-[-0.02em] text-[var(--tk-accent)]" style={displayFont}>{price || 'Open offer'}</span>
        {condition ? (
          <span className="border border-[var(--tk-line)] bg-[var(--tk-accent)]/5 px-3 py-1 text-[10px] font-700 uppercase tracking-[0.14em] text-[var(--tk-accent)]" style={bodyFont}>{condition}</span>
        ) : null}
      </div>
      <h2 className="mt-4 text-xl font-800 uppercase leading-tight tracking-[-0.01em]" style={displayFont}>{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>{getSummary(post)}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-500 text-[var(--tk-muted)]" style={bodyFont}>
        <span className="inline-flex items-center gap-1.5">
          {location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-all duration-300 hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.78))] opacity-80 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="line-clamp-2 text-lg font-800 uppercase leading-tight text-white" style={displayFont}>{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-[0.16em] text-white/70" style={bodyFont}>View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

/* Premium bookmark card — no images, clean resource-focused layout */
function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const category = getCategory(post, 'Resource')
  const summary = getSummary(post)

  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      {/* Top: number + category */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--tk-line)] bg-[var(--tk-raised)] text-[13px] font-800 text-[var(--tk-muted)]" style={displayFont}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <span
          className="border border-[var(--tk-accent)]/20 bg-[var(--tk-accent)]/5 px-3 py-1 text-[10px] font-700 uppercase tracking-[0.18em] text-[var(--tk-accent)]"
          style={bodyFont}
        >
          {category}
        </span>
      </div>

      {/* Title */}
      <h2
        className="mt-4 text-xl font-800 uppercase leading-tight tracking-[-0.01em] text-[var(--tk-text)] transition-colors group-hover:text-[var(--tk-accent)]"
        style={displayFont}
      >
        {post.title}
      </h2>

      {/* Summary */}
      {summary ? (
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>
          {summary}
        </p>
      ) : <div className="flex-1" />}

      {/* Domain + CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-[var(--tk-line)] pt-4">
        {website ? (
          <span className="truncate text-xs font-600 text-[var(--tk-accent)]" style={bodyFont}>
            {cleanDomain(website)}
          </span>
        ) : (
          <span className="text-xs text-[var(--tk-muted)]" style={bodyFont}>View resource</span>
        )}
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--tk-muted)] transition-all group-hover:text-[var(--tk-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center bg-[var(--tk-accent)]/10 text-[var(--tk-accent)]">
          <FileText className="h-6 w-6" />
        </div>
        <span className="border border-[var(--tk-line)] px-3 py-1 text-[10px] font-700 uppercase tracking-[0.14em] text-[var(--tk-muted)]" style={bodyFont}>{category}</span>
      </div>
      <h2 className="mt-5 text-xl font-800 uppercase leading-tight tracking-[-0.01em]" style={displayFont}>{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>{getSummary(post)}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--tk-accent)]" style={bodyFont}>
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const location = getField(post, ['location', 'city', 'address'])
  const summary = getSummary(post)

  return (
    <Link href={href} className={`${cardBase} flex min-h-full flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <FileText className="h-8 w-8 text-[var(--tk-muted)]" />
        )}
      </div>
      <h2 className="mt-5 text-xl font-800 uppercase leading-tight tracking-[-0.01em]" style={displayFont}>{post.title}</h2>
      {role ? <p className="mt-2 text-[10px] font-700 uppercase tracking-[0.16em] text-[var(--tk-accent)]" style={bodyFont}>{role}</p> : null}
      {location && location !== role ? <p className="mt-1 text-xs text-[var(--tk-muted)]" style={bodyFont}>{location}</p> : null}
      {summary ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>{summary}</p> : null}
    </Link>
  )
}