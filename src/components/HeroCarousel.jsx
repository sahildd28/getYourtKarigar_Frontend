import React, { useEffect, useState, useRef } from 'react'

export default function HeroCarousel({ images = [], interval = 4500 }){
  const [idx, setIdx] = useState(0)
  const [effective, setEffective] = useState(images.slice())
  const paused = useRef(false)
  const rafRef = useRef(null)
  useEffect(() => {
    let mounted = true
    const fallback = '/fallback-hero.svg'
    const promises = images.map((src, idx) => new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve({ idx, src })
      img.onerror = () => resolve({ idx, src: fallback })
      img.src = src
    }))
    Promise.all(promises).then(results => {
      if(!mounted) return
      const arr = results.sort((a,b) => a.idx - b.idx).map(r => r.src)
      setEffective(arr)
    })
    return () => { mounted = false }
  }, [images])

  useEffect(() => {
    let mounted = true
    let start = performance.now()
    let last = start

    function tick(now){
      if(!mounted) return
      if(paused.current){
        last = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const dt = now - last
      if(dt >= interval){
        setIdx(i => (i + 1) % images.length)
        last = now
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { mounted = false; cancelAnimationFrame(rafRef.current) }
  }, [images.length, interval])

  if(!images || images.length === 0) return null

  return (
    <section
      className="hero-carousel relative w-full h-full rounded-lg overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      aria-labelledby="hero-carousel-title"
    >
      <h2 id="hero-carousel-title" className="sr-only">Hero images</h2>
      {effective.map((src, i) => {
        const safeKey = src ? `${src.slice(0,80)}::${i}` : `slide_${i}`
        return (
        <div key={safeKey} className={`absolute inset-0 transition-opacity duration-1000 ease-linear ${i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} aria-hidden={i === idx ? 'false' : 'true'}>
          <img
            src={src}
            alt={`Slide ${i+1}`}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-hero.svg' }}
            className="w-full h-full object-cover"
          />
        </div>
        )
      })}

      {/* indicators */}
      <div className="absolute left-4 bottom-4 flex gap-2">
        {images.map((src, i) => {
          const dotKey = src ? `${src.slice(0,80)}::dot::${i}` : `dot_${i}`
          return (
            <button key={dotKey} onClick={() => setIdx(i)} onKeyDown={(e) => { if(e.key==='Enter' || e.key===' ') setIdx(i) }} aria-label={`Show slide ${i+1}`} className={`w-3 h-3 rounded-full ${i === idx ? 'bg-[color:var(--gold)]' : 'bg-white/30'}`} />
          )
        })}
      </div>
    </section>
  )
}

// PropTypes removed to avoid adding another dependency in this lightweight project
