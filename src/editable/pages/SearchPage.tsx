import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const HIDDEN_TASKS = new Set(['profile'])

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (HIDDEN_TASKS.has(derivedTask)) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskConfig = SITE_CONFIG.tasks.find((item) => item.key === task)
  const href = `${taskConfig?.route || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = taskConfig?.label || 'Resource'
  const isSbm = task === 'sbm'

  return (
    <Link
      href={href}
      className="group flex gap-4 border border-[var(--slot4-page-text)]/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      {image && !isSbm ? (
        <div className="h-20 w-20 shrink-0 overflow-hidden bg-[var(--slot4-panel-bg)]">
          <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-[var(--slot4-accent)]/20 bg-[var(--slot4-panel-bg)]">
          <span className="text-[10px] font-700 uppercase tracking-[0.14em] text-[var(--slot4-accent)]" style={bodyFont}>
            {taskLabel.slice(0, 3)}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-accent)]" style={bodyFont}>{taskLabel}</p>
        <h2 className="mt-1.5 line-clamp-2 text-lg font-900 uppercase leading-tight tracking-[-0.01em]" style={displayFont}>
          {post.title}
        </h2>
        {summary ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]" style={bodyFont}>
            {stripHtml(summary)}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-start pt-1">
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition-colors group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile').flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile')

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">

        {/* Hero search band */}
        <div className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:py-20 sm:px-8 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              (SEARCH)
            </p>
            <h1
              className="mt-4 text-[clamp(3rem,8vw,7rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em]"
              style={displayFont}
            >
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]" style={bodyFont}>
              {pagesContent.search.hero.description}
            </p>

            {/* Search form */}
            <form action="/search" className="mt-10 max-w-3xl">
              <input type="hidden" name="master" value="1" />
              <div className="flex gap-0 border border-[var(--slot4-page-text)]">
                <label className="flex flex-1 items-center gap-3 bg-white px-5 py-4">
                  <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-base font-600 outline-none placeholder:text-[var(--slot4-muted-text)]"
                    style={bodyFont}
                  />
                </label>
                <button
                  className="shrink-0 border-l border-[var(--slot4-page-text)] bg-[var(--slot4-accent)] px-8 py-4 text-[11px] font-700 uppercase tracking-[0.18em] text-white transition-all hover:bg-[var(--slot4-page-text)]"
                  type="submit"
                  style={bodyFont}
                >
                  Search
                </button>
              </div>

              {/* Filters row */}
              <div className="mt-3 flex flex-wrap gap-3">
                <select
                  name="task"
                  defaultValue={task}
                  className="border border-[var(--editable-border)] bg-white px-4 py-2.5 text-[11px] font-700 uppercase tracking-[0.14em] outline-none"
                  style={bodyFont}
                >
                  <option value="">All types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Filter by category"
                  className="border border-[var(--editable-border)] bg-white px-4 py-2.5 text-[11px] font-600 outline-none placeholder:text-[var(--slot4-muted-text)]"
                  style={bodyFont}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Ad slot — header size */}
        <div className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-5 sm:px-8 lg:px-12">
            <Ads slot="header" showLabel className="mx-auto" />
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto max-w-[var(--editable-container)] px-5 py-12 sm:py-16 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]" style={bodyFont}>
                {results.length} results
              </p>
              <h2 className="mt-1 text-2xl font-900 uppercase tracking-[-0.01em]" style={displayFont}>
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link
              href="/sbm"
              className="inline-flex items-center gap-2 border border-[var(--editable-border)] bg-white px-5 py-2.5 text-[11px] font-700 uppercase tracking-[0.14em] transition-all hover:border-[var(--slot4-accent)]"
              style={bodyFont}
            >
              Browse all resources <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-3">
              {results.map((post) => (
                <SearchResultCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-[var(--editable-border)] p-14 text-center">
              <p className="text-2xl font-900 uppercase tracking-[-0.02em]" style={displayFont}>No results found</p>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]" style={bodyFont}>
                Try different keywords, adjust your filters, or{' '}
                <Link href="/sbm" className="font-700 text-[var(--slot4-accent)] hover:underline">browse all resources</Link>.
              </p>
            </div>
          )}
        </div>
      </main>
    </EditableSiteShell>
  )
}
