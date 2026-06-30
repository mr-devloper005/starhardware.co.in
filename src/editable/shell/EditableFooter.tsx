'use client'

import Link from 'next/link'
import { Mail, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)]">
      {/* Accent line */}
      <div className="h-[3px] bg-[var(--slot4-accent)]" />

      {/* Main footer content */}
      <div className="mx-auto max-w-[var(--editable-container)] px-5 pt-12 pb-0 sm:px-8 lg:px-12">

        {/* Large brand name — Boldway style */}
        <div className="border-b border-[var(--editable-border)] pb-10">
          <h2
            className="text-[clamp(3rem,10vw,9rem)] font-900 uppercase leading-[0.9] tracking-[-0.02em] text-[var(--slot4-page-text)]"
            style={{ fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif", fontWeight: 900 }}
          >
            {SITE_CONFIG.name}
            <span className="text-[var(--slot4-accent)]">.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
            {globalContent.footer?.description}
          </p>
        </div>

        {/* Link columns + contact */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Description column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p
              className="text-[10px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
            >
              {globalContent.footer?.tagline}
            </p>
            
          </div>

          {/* Explore column */}
          <div>
            <h3
              className="text-[10px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
            >
              Explore
            </h3>
            <nav className="mt-5 grid gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Resources', href: '/sbm' },
                { label: 'Search', href: '/search' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-sm text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {item.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Company column */}
          <div>
            <h3
              className="text-[10px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
            >
              Company
            </h3>
            <nav className="mt-5 grid gap-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                ...(session
                  ? [{ label: 'Submit Resource', href: '/create' }]
                  : [{ label: 'Sign In', href: '/login' }, { label: 'Sign Up', href: '/signup' }]),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-sm text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {item.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
              {session ? (
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-sm text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  Logout
                </button>
              ) : null}
            </nav>
          </div>

          {/* CTA column */}
          <div>
            <h3
              className="text-[10px] font-700 uppercase tracking-[0.28em] text-[var(--slot4-accent)]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
            >
              Get Started
            </h3>
            <div className="mt-5">
              <p className="text-sm leading-6 text-[var(--slot4-muted-text)]">
                Have a resource to share with the hardware community?
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-5 py-2.5 text-[11px] font-700 uppercase tracking-[0.16em] text-white transition-all duration-200 hover:bg-transparent hover:text-[var(--slot4-accent)]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
              >
                Submit Resource <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-warm)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-12">
          <p
            className="text-[11px] font-500 text-[var(--slot4-muted-text)]"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p
            className="text-[11px] font-500 text-[var(--slot4-muted-text)]"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            {globalContent.footer?.bottomNote}
          </p>
        </div>
      </div>
    </footer>
  )
}
