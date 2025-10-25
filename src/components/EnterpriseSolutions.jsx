import React from 'react'

export default function EnterpriseSolutions(){
  return (
    <section className="my-6 bg-[color:var(--bg-800)] border border-[color:var(--gold)]/8 rounded p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gold">Enterprise Solutions</h3>
          <p className="text-gray-300 mt-2">Custom furniture and fit-outs for large spaces — we handle planning, fabrication, and installation for:</p>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
            <li className="flex items-center gap-2"><span className="text-amber-400">🏨</span> Hotels & Resorts</li>
            <li className="flex items-center gap-2"><span className="text-amber-400">🍽️</span> Restaurants & Cafés</li>
            <li className="flex items-center gap-2"><span className="text-amber-400">🎉</span> Wedding Halls & Banquets</li>
            <li className="flex items-center gap-2"><span className="text-amber-400">🏢</span> Corporate Offices</li>
            <li className="flex items-center gap-2"><span className="text-amber-400">🛍️</span> Retail & Showrooms</li>
          </ul>
          <p className="mt-3 text-sm text-gray-300">Want to see examples? <a href="/projects" className="text-gold font-semibold">Check out our projects here</a>.</p>
        </div>

        <div className="flex-shrink-0">
          <a href="/contact" className="inline-block btn-gold px-4 py-2 rounded-md">Enterprise Enquiry</a>
        </div>
      </div>
    </section>
  )
}
