'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bookmark, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: Bookmark,
}

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

const fieldClass = [
  'w-full border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-600 outline-none',
  'placeholder:text-[var(--slot4-muted-text)] transition-colors',
  'focus:border-[var(--slot4-page-text)]',
].join(' ')

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <div className="mx-auto max-w-[var(--editable-container)] grid min-h-[calc(100vh-4.25rem)] items-center gap-0 px-0 lg:grid-cols-2">

            {/* Dark side */}
            <div className="flex h-full min-h-72 items-center justify-center border-b border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] p-12 lg:border-b-0 lg:border-r">
              <div className="text-center text-[var(--slot4-dark-text)]">
                <Lock className="mx-auto h-16 w-16 text-[var(--slot4-accent)]" />
                <p className="mt-5 text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                  Sign in required
                </p>
                <h1
                  className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em]"
                  style={displayFont}
                >
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-5 text-sm leading-7 text-[var(--slot4-dark-text)]/60" style={bodyFont}>
                  {pagesContent.create.locked.description}
                </p>
              </div>
            </div>

            {/* CTA side */}
            <div className="flex flex-col items-center justify-center px-5 py-16 sm:px-8 lg:px-16">
              <div className="w-full max-w-md">
                <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                  {pagesContent.create.locked.badge}
                </p>
                <h2
                  className="mt-4 text-3xl font-900 uppercase leading-tight tracking-[-0.02em]"
                  style={displayFont}
                >
                  Get access to create
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]" style={bodyFont}>
                  Create an account or sign in to submit resources, guides, and tools for the hardware community.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 border border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] px-6 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-white transition-all hover:bg-transparent hover:text-[var(--slot4-page-text)]"
                    style={bodyFont}
                  >
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 border border-[var(--editable-border)] bg-white px-6 py-3 text-[11px] font-700 uppercase tracking-[0.16em] transition-all hover:border-[var(--slot4-page-text)]"
                    style={bodyFont}
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">

        {/* Header */}
        <div className="border-b border-[var(--editable-border)]">
          <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between px-5 py-8 sm:px-8 lg:px-12">
            <div>
              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                {pagesContent.create.hero.badge}
              </p>
              <h1 className="mt-2 text-2xl font-900 uppercase leading-tight tracking-[-0.02em]" style={displayFont}>
                {pagesContent.create.hero.title}
              </h1>
            </div>
            <span className="border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-[11px] font-700 uppercase tracking-[0.14em]" style={bodyFont}>
              {session.name}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-[var(--editable-container)] grid gap-0 px-0 lg:grid-cols-[320px_1fr]">

          {/* Task selector sidebar */}
          <div className="border-b border-[var(--editable-border)] p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]" style={bodyFont}>
              Content type
            </p>
            <div className="mt-5 grid gap-2">
              {enabledTasks.map((item) => {
                const Icon = taskIcon[item.key] || FileText
                const active = item.key === task
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTask(item.key)}
                    className={[
                      'flex items-center gap-3 border p-4 text-left transition-all',
                      active
                        ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                        : 'border-[var(--editable-border)] bg-white hover:border-[var(--slot4-page-text)]/40',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[11px] font-700 uppercase tracking-[0.14em]" style={bodyFont}>{item.label}</span>
                      <span className={`mt-0.5 block text-[11px] leading-5 ${active ? 'opacity-60' : 'text-[var(--slot4-muted-text)]'}`} style={bodyFont}>{item.description}</span>
                    </div>
                    {active ? <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" /> : null}
                  </button>
                )
              })}
            </div>

            {/* Helper note */}
            <div className="mt-8 border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
              <p className="text-[11px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-accent)]" style={bodyFont}>Tip</p>
              <p className="mt-2 text-[11px] leading-5 text-[var(--slot4-muted-text)]" style={bodyFont}>
                {pagesContent.create.hero.description}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-8 lg:p-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]" style={bodyFont}>
              Create {activeTask?.label || 'post'}
            </p>
            <h2 className="mt-2 text-2xl font-900 uppercase leading-tight tracking-[-0.02em]" style={displayFont}>
              {pagesContent.create.formTitle}
            </h2>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]" style={bodyFont}>Title *</label>
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource or post title" required style={bodyFont} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]" style={bodyFont}>Category</label>
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Processors, Tools" style={bodyFont} />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]" style={bodyFont}>Source URL</label>
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" style={bodyFont} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]" style={bodyFont}>Image URL</label>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL (optional)" style={bodyFont} />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]" style={bodyFont}>Summary *</label>
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short description of this resource" required style={bodyFont} />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]" style={bodyFont}>Body content *</label>
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full content, details, notes, or description" required style={bodyFont} />
              </div>

              {created ? (
                <div className="border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-700" style={bodyFont}>
                    <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-1 text-sm opacity-80" style={bodyFont}>{created.title}</p>
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-6 text-[11px] font-700 uppercase tracking-[0.18em] text-white transition-all hover:bg-transparent hover:text-[var(--slot4-accent)]"
                style={bodyFont}
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}
