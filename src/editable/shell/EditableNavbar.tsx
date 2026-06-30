'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogIn, UserPlus, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const NAV_LINKS = [
  { label: 'Resources', href: '/sbm' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/96 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] w-full max-w-[var(--editable-container)] items-center gap-8 px-5 sm:px-8 lg:px-12">

        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-[var(--slot4-accent)]/30 bg-[var(--slot4-surface-bg)] transition-all duration-300 group-hover:border-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span
            className="boldway-section-label hidden text-[13px] font-700 tracking-[0.06em] text-[var(--slot4-page-text)] transition-colors group-hover:text-[var(--slot4-accent)] sm:block"
            style={{ fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-[11px] font-700 uppercase tracking-[0.18em] transition-colors duration-200 ${
                  active
                    ? 'text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
                style={{ fontFamily: "'Barlow', 'Inter', sans-serif", fontWeight: 700 }}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 bottom-0 h-[2px] bg-[var(--slot4-accent)]" />
                ) : null}
              </Link>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Auth actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-5 py-2 text-[11px] font-700 uppercase tracking-[0.16em] text-white transition-all duration-200 hover:bg-transparent hover:text-[var(--slot4-accent)]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
              >
                <PlusCircle className="h-3.5 w-3.5" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
              >
                <LogIn className="h-3.5 w-3.5" /> Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-5 py-2 text-[11px] font-700 uppercase tracking-[0.16em] text-white transition-all duration-200 hover:bg-transparent hover:text-[var(--slot4-accent)]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-5 pb-6 pt-4 lg:hidden">
          <div className="grid gap-1">
            {[
              { label: 'Home', href: '/' },
              ...NAV_LINKS,
              ...(session
                ? [{ label: 'Submit', href: '/create' }]
                : [{ label: 'Sign In', href: '/login' }, { label: 'Sign Up', href: '/signup' }]),
            ].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-[11px] font-700 uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? 'border-[var(--slot4-accent)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:text-[var(--slot4-page-text)]'
                  }`}
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false) }}
                className="border-l-2 border-transparent px-4 py-3 text-left text-[11px] font-700 uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
