import React from 'react'
import GoogleSignIn from './GoogleSignIn'

export default function SignInPromptModal({ open, onClose, elementId = 'google-signin-modal' }){
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={event => {
        if (event.target === event.currentTarget && onClose) onClose()
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[color:var(--bg-800)] p-6 text-gray-200 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in prompt"
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gold">Sign in to continue</h2>
        <p className="mt-2 text-sm text-gray-300">
          Sign in with Google so we can save your project requests and you can track their progress anytime.
        </p>
        <div className="mt-6 flex justify-center">
          <GoogleSignIn elementId={elementId} />
        </div>
        <p className="mt-4 text-xs text-gray-400">We never share your personal details. Signing in helps us keep your enquiries organized.</p>
      </div>
    </div>
  )
}
