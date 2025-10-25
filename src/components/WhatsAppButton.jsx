import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function WhatsAppButton(){
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/contact')}
      className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--gold)] bg-[color:var(--bg-900)] text-[color:var(--gold)] shadow-lg transition hover:-translate-y-1 hover:bg-[color:var(--gold)] hover:text-black"
      aria-label="Contact us"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a.5.5 0 0 1-.82.38l-4.5-3.82H5.5A2.5 2.5 0 0 1 3 12.56V5.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
