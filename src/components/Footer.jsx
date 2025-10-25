import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-8 bg-[color:var(--bg-800)] border-t border-[color:var(--gold)]/6">
      <div className="container mx-auto px-4 py-8 text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-gold">Saraswati Contractors</h3>
            <div className="text-sm text-gray-400 mt-2">Phone: <a href="tel:+7021226296" className="text-gray-200">+91 70212 26296</a></div>
            <div className="mt-2 text-sm text-gray-400">Locations: All Over Maharashtra</div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-gray-400">
              <li><button type="button" onClick={() => { const el = document.getElementById('services'); if (el) { el.scrollIntoView({behavior:'smooth', block:'start'}); history.replaceState(null,'','#services') } else { window.location.hash = '#services' } }} className="text-gray-300">Services</button></li>
              <li><a href="/gallery" className="text-gray-300">Gallery</a></li>
              <li><a href="/contact" className="text-gray-300">Get a Quote</a></li>
              <li><a href="/projects" className="text-gray-300">Our Projects</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200">About</h4>
            <p className="text-sm text-gray-400 mt-2">Crafting furniture with perfection since 1980.</p>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Saraswati Contractors</div>
      </div>
    </footer>
  )
}
