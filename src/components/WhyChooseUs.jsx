import React from 'react'

const items = [
  '20+ years experience',
  'Custom designs',
  'Affordable pricing',
  'Quick service in Mumbai & Navi Mumbai'
]

export default function WhyChooseUs(){
  return (
    <section className="my-8 bg-[color:var(--bg-800)] border border-[color:var(--gold)]/6 rounded p-6">
      <h3 className="text-xl font-semibold text-gold mb-4">Why Choose Us?</h3>
      <ul className="space-y-2 text-gray-300">
        {items.map(i => (
          <li key={i} className="flex items-start gap-2"><span className="text-amber-400">✅</span><span>{i}</span></li>
        ))}
      </ul>
    </section>
  )
}
