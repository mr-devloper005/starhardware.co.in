import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-muted-text)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2
        className="mt-6 text-2xl font-900 uppercase leading-tight tracking-[-0.01em]"
        style={displayFont}
      >
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]" style={bodyFont}>
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-7 inline-flex items-center gap-2 border border-[var(--editable-border)] bg-white px-5 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-page-text)] transition-all hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
        style={bodyFont}
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the master panel will appear here automatically. The page layout stays ready even when the feed is empty.`}
      actionLabel="Explore resources"
      actionHref="/sbm"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
