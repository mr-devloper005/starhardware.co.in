import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">

        {/* Hero */}
        <div className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:py-24 sm:px-8 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              (ABOUT)
            </p>
            <h1
              className="mt-5 max-w-4xl text-[clamp(3rem,9vw,8rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em]"
              style={displayFont}
            >
              About {SITE_CONFIG.name}
              <span className="text-[var(--slot4-accent)]">.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]" style={bodyFont}>
              {pagesContent.about.description}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="mx-auto max-w-[var(--editable-container)] grid gap-0 px-0 lg:grid-cols-[1fr_400px]">

          {/* Story */}
          <div className="border-b border-[var(--editable-border)] px-5 py-14 sm:px-8 lg:border-b-0 lg:border-r lg:py-20 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              Our story
            </p>
            <div className="mt-8 space-y-6">
              {pagesContent.about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-8 text-[var(--slot4-muted-text)]" style={bodyFont}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Dark CTA band */}
            <div className="mt-14 border border-[var(--slot4-dark-bg)] bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-dark-text)]">
              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                Get started
              </p>
              <h2 className="mt-4 text-3xl font-900 uppercase leading-tight tracking-[-0.02em]" style={displayFont}>
                Join the hardware community
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-dark-text)]/70" style={bodyFont}>
                Sign up to submit resources, curate collections, and connect with engineers who build with hardware.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-6 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-white transition-all hover:bg-transparent"
                  style={bodyFont}
                >
                  Create account <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-[var(--slot4-dark-text)]/30 px-6 py-3 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-dark-text)] transition-all hover:border-[var(--slot4-dark-text)]"
                  style={bodyFont}
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>

          {/* Values sidebar */}
          <div className="px-5 py-14 sm:px-8 lg:py-20 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              What we stand for
            </p>
            <div className="mt-8 grid gap-5">
              {pagesContent.about.values.map((value, index) => (
                <div
                  key={value.title}
                  className="border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition-colors hover:border-[var(--slot4-accent)]/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-accent)]" style={bodyFont}>
                      0{index + 1}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" />
                  </div>
                  <h2
                    className="mt-3 text-xl font-900 uppercase leading-tight tracking-[-0.01em]"
                    style={displayFont}
                  >
                    {value.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]" style={bodyFont}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
              <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
                The numbers
              </p>
              <div className="mt-5 grid grid-cols-2 gap-5">
                {[
                  { value: '2,500+', label: 'Resources' },
                  { value: '180+', label: 'Categories' },
                  { value: '50+', label: 'Suppliers' },
                  { value: '10K+', label: 'Engineers' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-[2rem] font-900 uppercase leading-none tracking-[-0.03em] text-[var(--slot4-page-text)]"
                      style={displayFont}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] font-600 uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]" style={bodyFont}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}
