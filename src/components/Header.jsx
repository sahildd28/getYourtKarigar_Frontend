import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../contexts/useAuth'
import GoogleSignIn from './GoogleSignIn'

export default function Header(){
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth();
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/gallery', label: 'Services' },
    { to: '/projects', label: 'Our Projects' },
    { to: '/contact', label: 'Contact' },
    { to: '/my-leads', label: 'My Projects', authOnly: true }
  ]

  const isActive = (path) => location.pathname === path
  const linkClasses = (path) =>
    `${isActive(path) ? 'text-gold font-semibold' : 'text-gray-300 hover:text-gold'} transition-colors duration-150`

  const renderAccountControls = (context) => {
    if (user) {
      return (
        <div className="flex items-center justify-between gap-3 text-sm text-gray-200">
          <span className="truncate max-w-[10rem]" title={user.name}>{user.name}</span>
          <button onClick={() => signOut()} className="text-sm underline-offset-4 hover:underline">Sign out</button>
        </div>
      )
    }
    return <GoogleSignIn elementId={`google-signin-${context}`} />
  }

  return (
    <header className="relative z-50 bg-[color:var(--bg-800)] shadow-sm">
      <div className="container relative mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <Link to="/home" className="text-xl font-bold text-gold">Saraswati Contractors</Link>

        <div className="flex items-center gap-3 md:hidden">
          {user && <span className="text-sm text-gray-200" title={user.name}>{user.name.split(' ')[0]}</span>}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="rounded-full p-2 text-gray-200 hover:bg-white/10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.filter(link => !link.authOnly || user).map(link => (
            <Link key={link.to} to={link.to} className={linkClasses(link.to)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-3">
          {renderAccountControls('desktop')}
        </div>

        <div
          className={`${open ? 'grid' : 'hidden'} absolute left-4 right-4 top-full z-40 mt-3 gap-3 rounded-2xl border border-white/10 bg-[color:var(--bg-900)]/95 p-4 shadow-xl md:hidden`}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.filter(link => !link.authOnly || user).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkClasses(link.to)} rounded-lg px-3 py-2 text-base`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 pt-3">
            {renderAccountControls('mobile')}
          </div>
        </div>
      </div>
    </header>
  )
}
