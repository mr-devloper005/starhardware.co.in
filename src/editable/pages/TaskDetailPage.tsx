import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2,
  Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const relatedTask = task === 'profile' ? 'sbm' : task
  const related = (await fetchTaskPosts(relatedTask, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}

const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-600 uppercase tracking-[0.3em] text-[var(--tk-muted)]" style={bodyFont}>
      <span className="text-[var(--tk-accent)]">{theme.kicker}</span>
      <span className="h-1 w-1 bg-[var(--tk-accent)] opacity-50" />
      <span>{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 text-sm font-600 text-[var(--tk-muted)] transition-colors hover:text-[var(--tk-text)]"
      style={bodyFont}
    >
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

/* ── Article ─────────────────────────────────────────────────────────── */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20 sm:px-8">
        <BackLink task="article" />
        <p className="mt-10 text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--tk-accent)]" style={bodyFont}>{categoryOf(post, 'Article')}</p>
        <h1
          className="mt-5 text-balance text-[clamp(2.5rem,6vw,5rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em]"
          style={displayFont}
        >
          {post.title}
        </h1>
        <div className="mt-6 text-sm text-[var(--tk-muted)]" style={bodyFont}>
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full border border-[var(--tk-line)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>

      {/* Ad slot */}
      <div className="border-t border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
          <Ads slot="article-bottom" showLabel className="mx-auto w-full" />
        </div>
      </div>

      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ── Listing ─────────────────────────────────────────────────────────── */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <Kicker task="listing">Business listing</Kicker>
              <h1 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em]" style={displayFont}>{post.title}</h1>
            </div>
          </div>
          {leadText(post) ? <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]" style={bodyFont}>{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <Divider />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Gallery" />
        </article>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ── Classified ──────────────────────────────────────────────────────── */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:py-20 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
            <Kicker task="classified">Classified</Kicker>
            <h1 className="mt-4 text-2xl font-800 uppercase leading-tight tracking-[-0.01em]" style={displayFont}>{post.title}</h1>
            <p className="mt-6 text-4xl font-900 uppercase tracking-[-0.02em] text-[var(--tk-accent)]" style={displayFont}>{price || 'Open offer'}</p>
            <div className="mt-5 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-700 uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]" style={bodyFont}><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 border border-[var(--tk-line)] px-5 py-2.5 text-sm font-700 uppercase tracking-[0.12em] transition-all hover:border-[var(--tk-accent)]" style={bodyFont}><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ── Image ───────────────────────────────────────────────────────────── */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 border border-[var(--tk-line)] px-3.5 py-1.5 text-xs font-600 text-[var(--tk-muted)]" style={bodyFont}>
              <Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story
            </div>
            <h1 className="mt-6 text-[clamp(2rem,5vw,4rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em]" style={displayFont}>{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]" style={bodyFont}>{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ── Bookmark/SBM Detail — no images, rich premium layout ────────────── */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const category = categoryOf(post, 'Resource')
  const tags = Array.isArray(post.tags) ? post.tags.filter((t) => typeof t === 'string') : []
  const body = getBody(post)

  return (
    <>
      {/* Hero band — no image */}
      <div className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
          <BackLink task="sbm" />

          {/* Icon + category */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center border border-[var(--tk-line)] bg-[var(--tk-surface)] text-[var(--tk-accent)]">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--tk-accent)]" style={bodyFont}>{category}</p>
              {website ? (
                <p className="mt-0.5 text-sm font-500 text-[var(--tk-muted)]" style={bodyFont}>
                  {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </p>
              ) : null}
            </div>
          </div>

          {/* Title */}
          <h1
            className="mt-6 max-w-4xl text-[clamp(2.5rem,7vw,6rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em]"
            style={displayFont}
          >
            {post.title}
          </h1>

          {/* Lead / description */}
          {leadText(post) ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]" style={bodyFont}>
              {leadText(post)}
            </p>
          ) : null}

          {/* Tags */}
          {tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-600 uppercase tracking-[0.14em] text-[var(--tk-muted)]"
                  style={bodyFont}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* CTA */}
          {website ? (
            <div className="mt-8">
              <Link
                href={website}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-6 py-3 text-sm font-700 uppercase tracking-[0.14em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]"
                style={bodyFont}
              >
                Open resource <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Ad slot — sidebar variant */}
      <div className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-5 py-6 sm:px-8 lg:px-12">
          <Ads slot="in-feed" showLabel className="mx-auto" />
        </div>
      </div>

      {/* Body content */}
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16 sm:px-8">
        <div
          className="article-content text-[1.0625rem] leading-8 text-[var(--tk-text)]"
          dangerouslySetInnerHTML={{ __html: formatPlainText(body) }}
        />

        {/* Metadata grid */}
        <div className="mt-12 grid gap-4 border-t border-[var(--tk-line)] pt-8 sm:grid-cols-2">
          {category ? (
            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
              <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-muted)]" style={bodyFont}>Category</p>
              <p className="mt-2 font-700 uppercase text-[var(--tk-accent)]" style={displayFont}>{category}</p>
            </div>
          ) : null}
          <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
            <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-muted)]" style={bodyFont}>Published on</p>
            <p className="mt-2 font-600 text-[var(--tk-text)]" style={bodyFont}>{SITE_CONFIG.name}</p>
          </div>
        </div>

        {website ? (
          <div className="mt-6 border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-muted)]" style={bodyFont}>Resource link</p>
            <p className="mt-2 truncate text-sm font-500 text-[var(--tk-accent)]" style={bodyFont}>{website}</p>
            <Link
              href={website}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-2.5 text-[11px] font-700 uppercase tracking-[0.14em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]"
              style={bodyFont}
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </div>

      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ── PDF ─────────────────────────────────────────────────────────────── */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
      <BackLink task="pdf" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[var(--tk-line)] bg-[var(--tk-accent)]/10 text-[var(--tk-accent)]">
              <FileText className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="mt-3 text-3xl font-900 uppercase leading-tight tracking-[-0.02em]" style={displayFont}>{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-10 overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                <span className="text-sm font-700" style={bodyFont}>Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-4 py-2 text-xs font-700 uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]" style={bodyFont}>
                  Download <Download className="h-4 w-4" />
                </Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
            </div>
          ) : null}
        </article>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-muted)]" style={bodyFont}>Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]" style={bodyFont}>Download the full file.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-3 text-sm font-700 uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]" style={bodyFont}>
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ── Profile Detail — premium, not linked in UI ──────────────────────── */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone'])
  const location = getField(post, ['location', 'city', 'address'])
  const tags = Array.isArray(post.tags) ? post.tags.filter((t) => typeof t === 'string') : []

  return (
    <>
      {/* Hero */}
      <div className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--tk-accent)] bg-[var(--tk-raised)] sm:h-36 sm:w-36">
              {avatar ? (
                <img src={avatar} alt={post.title} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--tk-accent)]" style={bodyFont}>
                Profile
              </p>
              <h1
                className="mt-3 text-[clamp(2.5rem,7vw,6rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em]"
                style={displayFont}
              >
                {post.title}
              </h1>
              {role ? (
                <p className="mt-3 text-base font-600 uppercase tracking-[0.08em] text-[var(--tk-muted)]" style={bodyFont}>
                  {role}
                </p>
              ) : null}


              

              {/* Contact actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-700 uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]"
                    style={bodyFont}
                  >
                    <Globe2 className="h-4 w-4" /> Website
                  </Link>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 border border-[var(--tk-line)] px-5 py-2.5 text-sm font-700 uppercase tracking-[0.12em] transition-all hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                    style={bodyFont}
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 border border-[var(--tk-line)] px-5 py-2.5 text-sm font-700 uppercase tracking-[0.12em] transition-all hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                    style={bodyFont}
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                ) : null}


                
              </div>
            </div>
          </div>
        </div>
        
      </div>
      

      {/* Main content */}
      <div className="mx-auto max-w-[var(--editable-container)] grid gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12">

        {/* Body */}
        <article className="min-w-0">
          <BodyContent post={post} />
          {/* Gallery (exclude avatar) */}
          <ImageStrip images={images.slice(1)} label="Gallery" />
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Detail card */}
          <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-muted)]" style={bodyFont}>Details</p>
            <div className="mt-4 grid gap-3">
              {location ? (
                <div className="flex items-center gap-2.5 text-sm" style={bodyFont}>
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  <span className="text-[var(--tk-muted)]">{location}</span>
                </div>
              ) : null}
              {email ? (
                <div className="flex items-center gap-2.5 text-sm" style={bodyFont}>
                  <Mail className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  <a href={`mailto:${email}`} className="truncate text-[var(--tk-accent)] hover:underline">{email}</a>
                </div>
              ) : null}
              {website ? (
                <div className="flex items-center gap-2.5 text-sm" style={bodyFont}>
                  <Globe2 className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  <a href={website} target="_blank" rel="noreferrer" className="truncate text-[var(--tk-accent)] hover:underline">
                    {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </div>
              ) : null}
            </div>
            
          </div>

          {/* Tags */}
          {tags.length > 0 ? (
            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--tk-muted)]" style={bodyFont}>Tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--tk-line)] bg-[var(--tk-raised)] px-3 py-1 text-[11px] font-600 uppercase tracking-[0.14em] text-[var(--tk-muted)]"
                    style={bodyFont}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <RelatedPanel task="sbm" post={post} related={related} />
        </aside>
      </div>
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-6 sm:px-8 lg:px-12">
        <Ads slot="footer" showLabel className="mx-auto" />
      </div>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ── Shared building blocks ──────────────────────────────────────────── */
function Divider() {
  return <div className="my-10 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      style={bodyFont}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <div className="flex items-center gap-2 text-[10px] font-700 uppercase tracking-[0.14em] text-[var(--tk-muted)]" style={bodyFont}>
            <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="mt-2 break-words text-sm font-600" style={bodyFont}>{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--tk-muted)]" style={bodyFont}>{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] border border-[var(--tk-line)] object-cover" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-700" style={bodyFont}>
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-4 py-2.5 text-sm font-700 uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition-all hover:bg-transparent hover:text-[var(--tk-accent)]" style={bodyFont}>
          Website <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-[var(--tk-line)] px-4 py-2.5 text-sm font-700 uppercase tracking-[0.12em] transition-all hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]" style={bodyFont}>
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 border border-[var(--tk-line)] px-4 py-2.5 text-sm font-700 uppercase tracking-[0.12em] transition-all hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]" style={bodyFont}>
          <Mail className="h-4 w-4" /> Email
        </a>
      ) : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--tk-muted)]" style={bodyFont}>Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-600 uppercase tracking-[0.12em] text-[var(--tk-muted)]" style={bodyFont}>{label}</span>
      <span className="font-700" style={bodyFont}>{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post: _post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-5">
      <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--tk-muted)]" style={bodyFont}>About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]" style={bodyFont}>
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="max-w-full overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h2 className="text-lg font-800 uppercase tracking-[-0.01em]" style={displayFont}>More like this</h2>
            {task !== 'profile' ? <Link href={taskConfig?.route || '/'} className="text-[11px] font-700 uppercase tracking-[0.14em] text-[var(--tk-accent)]" style={bodyFont}>View all</Link> : null}
          </div>
          <div className="mt-5 grid min-w-0 gap-3 overflow-hidden">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-16 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-900 uppercase tracking-[-0.01em]" style={displayFont}>
            More {task === 'profile' ? 'resources' : (taskConfig?.label || 'posts').toLowerCase()}
          </h2>
          {task !== 'profile' ? (
            <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-700 uppercase tracking-[0.14em] text-[var(--tk-accent)]" style={bodyFont}>
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block min-w-0 max-w-full overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--tk-accent)]/40">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>
          )}
        </div>
        <div className="min-w-0 overflow-hidden p-5">
          <h3 className="line-clamp-2 break-words text-base font-800 uppercase leading-tight tracking-[-0.01em] [overflow-wrap:anywhere]" style={displayFont}>{post.title}</h3>
          <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[var(--tk-muted)] [overflow-wrap:anywhere]" style={bodyFont}>{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex min-w-0 max-w-full gap-3 overflow-hidden border border-[var(--tk-line)] p-3 transition-all hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" className="h-14 w-14 shrink-0 object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[var(--tk-raised)]">
          <FileText className="h-5 w-5 text-[var(--tk-muted)]" />
        </div>
      )}
      <div className="min-w-0 flex-1 overflow-hidden">
        <h3 className="line-clamp-2 break-words text-sm font-800 uppercase leading-tight [overflow-wrap:anywhere]" style={displayFont}>{post.title}</h3>
        <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-[var(--tk-muted)] [overflow-wrap:anywhere]" style={bodyFont}>{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
