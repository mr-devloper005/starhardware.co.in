'use client'

import { Bookmark, Mail, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const displayFont = { fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif" }
const bodyFont = { fontFamily: "'Barlow', 'Inter', sans-serif" }

const LANES = [
  {
    icon: Bookmark,
    title: 'Resource submissions',
    body: 'Submit new hardware resources, supplier guides, technical tools, or datasheets for review and inclusion.',
  },
  {
    icon: Mail,
    title: 'Partnerships & collaboration',
    body: 'Coordinate curation projects, content partnerships, and editorial programs with the starhardware team.',
  },
  {
    icon: Sparkles,
    title: 'Curator & community support',
    body: 'Questions about organizing collections, resource submissions, or community guidelines? We\'re here to help.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">

        {/* Hero */}
        <div className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:py-24 sm:px-8 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              (CONTACT)
            </p>
            <h1
              className="mt-5 max-w-3xl text-[clamp(3rem,9vw,8rem)] font-900 uppercase leading-[0.88] tracking-[-0.02em]"
              style={displayFont}
            >
              {pagesContent.contact.title}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]" style={bodyFont}>
              {pagesContent.contact.description}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="mx-auto max-w-[var(--editable-container)] grid gap-0 lg:grid-cols-[1fr_560px]">

          {/* Lanes sidebar */}
          <div className="border-b border-[var(--editable-border)] px-5 py-14 sm:px-8 lg:border-b-0 lg:border-r lg:py-20 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              How we can help
            </p>
            <div className="mt-8 grid gap-5">
              {LANES.map((lane, index) => (
                <div
                  key={lane.title}
                  className="border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition-colors hover:border-[var(--slot4-accent)]/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-700 uppercase tracking-[0.2em] text-[var(--slot4-accent)]" style={bodyFont}>
                      0{index + 1}
                    </span>
                    <lane.icon className="h-4 w-4 text-[var(--slot4-accent)]" />
                  </div>
                  <h2
                    className="mt-3 text-xl font-900 uppercase leading-tight tracking-[-0.01em]"
                    style={displayFont}
                  >
                    {lane.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]" style={bodyFont}>
                    {lane.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="px-5 py-14 sm:px-8 lg:py-20 lg:px-12">
            <p className="text-[11px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]" style={bodyFont}>
              Send a message
            </p>
            <h2
              className="mt-4 text-3xl font-900 uppercase leading-tight tracking-[-0.02em]"
              style={displayFont}
            >
              {pagesContent.contact.formTitle}
            </h2>

            <div className="mt-8 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
              <EditableContactLeadForm />
            </div>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}
