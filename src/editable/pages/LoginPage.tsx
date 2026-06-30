import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-[calc(100vh-4.25rem)] bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <div className="mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-[var(--editable-container)] lg:grid-cols-2">

          {/* Left panel — brand messaging */}
          <div className="hidden border-r border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] p-12 lg:flex lg:flex-col lg:justify-between">
            <Link
              href="/"
              className="text-[13px] font-700 uppercase tracking-[0.08em] text-[var(--slot4-dark-text)]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              {SITE_CONFIG.name}
            </Link>

            <div>
              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                {pagesContent.auth.login.badge}
              </p>
              <h1
                className="mt-5 text-[clamp(2.5rem,5vw,5rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em] text-[var(--slot4-dark-text)]"
                style={displayFont}
              >
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 text-base leading-8 text-[var(--slot4-dark-text)]/60" style={bodyFont}>
                {pagesContent.auth.login.description}
              </p>

              {/* Feature list */}
              <div className="mt-10 space-y-3">
                {[
                  'Curated hardware resources',
                  'Supplier discovery tools',
                  'Technical specification guides',
                  'Community curation',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[var(--slot4-dark-text)]/70" style={bodyFont}>
                    <span className="h-1.5 w-1.5 shrink-0 bg-[var(--slot4-accent)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[var(--slot4-dark-text)]/30" style={bodyFont}>
              © {SITE_CONFIG.name}
            </p>
          </div>

          {/* Right panel — form */}
          <div className="flex flex-col items-center justify-center px-5 py-16 sm:px-8 lg:px-16">
            <div className="w-full max-w-md">
              {/* Mobile brand */}
              <Link
                href="/"
                className="mb-10 block text-[13px] font-700 uppercase tracking-[0.08em] lg:hidden"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
                {SITE_CONFIG.name}
              </Link>

              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                Welcome back
              </p>
              <h2
                className="mt-3 text-3xl font-900 uppercase leading-tight tracking-[-0.02em]"
                style={displayFont}
              >
                {pagesContent.auth.login.formTitle}
              </h2>

              <div className="mt-8 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
                <EditableLocalLoginForm />
              </div>

              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]" style={bodyFont}>
                New here?{' '}
                <Link
                  href="/signup"
                  className="font-700 text-[var(--slot4-accent)] underline-offset-4 hover:underline"
                >
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}
