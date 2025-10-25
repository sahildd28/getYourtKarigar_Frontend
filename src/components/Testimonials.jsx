import React, {useRef, useEffect, useState} from 'react'
import { fetchTestimonials } from '../services/testimonialsService'

const fallbackTestimonials = [
  {
    name: 'Ravi Kumar',
    location: 'Khar',
    photo: 'https://via.placeholder.com/80?text=R',
    text: 'We needed a bespoke dining table fitted into a tricky alcove. The team measured precisely, suggested a strong plywood core with teak veneer, and the finish is superb. Installation was quick and the final fitting was perfect. Highly recommended.'
  },
  {
    name: 'Meera Shah',
    location: 'Bandra',
    photo: 'https://via.placeholder.com/80?text=M',
  text: 'Ordered a modular kitchen and the results exceeded expectations - excellent storage solutions, soft-close drawers and a durable finish. The team communicated well and respected timelines.'
  },
  {
    name: 'Amit Patel',
    location: 'Kharghar',
    photo: 'https://via.placeholder.com/80?text=A',
  text: 'Custom wardrobe with sliding doors - very happy with the design suggestions and the finishing. Materials used felt premium and the polish lasted well after a month.'
  },
  {
    name: 'Priya Nair',
    location: 'Chembur',
    photo: 'https://via.placeholder.com/80?text=P',
    text: 'The chair restoration service gave our old family chairs a new life. Excellent craftsmanship and attention to detail.'
  },
  {
    name: 'Siddharth Rao',
    location: 'Lonavla',
    photo: 'https://via.placeholder.com/80?text=S',
    text: 'We requested a custom TV unit with hidden cable channels and pull-out shelves. The carpentry team delivered a very neat solution and even suggested storage ideas to maximize space.'
  },
  {
    name: 'Anjali Verma',
    location: 'Ghathkopar',
    photo: 'https://via.placeholder.com/80?text=An',
    text: 'Excellent attention to finish and edges. Ordered side tables and wardrobes and the finishes were consistent and exactly as discussed.'
  },
  {
    name: 'Rohan Desai',
    location: 'Andheri',
    photo: 'https://via.placeholder.com/80?text=Rr',
    text: 'Fast turnaround and the team was very professional. They even suggested a durable laminate that has held up well.'
  },
  {
    name: 'Sunita Kapoor',
    location: 'Santacruz',
    photo: 'https://via.placeholder.com/80?text=Su',
    text: 'We loved the modular kitchen installation; the ergonomics and worktop finish are excellent. Post-install support was prompt.'
  }
]

function getInitials(name) {
  if (!name) return '??'
  const trimmed = name.trim()
  if (!trimmed) return '??'
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function Testimonials(){
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const trackRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [items, setItems] = useState(fallbackTestimonials)
  const pausedRef = useRef(false)
  const offsetRef = useRef(0)
  const lastRef = useRef(null)
  const widthRef = useRef(0)

  useEffect(() => {
    let ignore = false

    async function loadTestimonials() {
      try {      
        const response = await fetchTestimonials()
        if (!Array.isArray(response) || response.length === 0 || ignore) {
          return
        }

        const sanitized = response
          .filter(Boolean)
          .map((item, index) => ({
            id: item.id ?? `remote-${index}`,
            name: item.name || item.customerName || 'Valued Client',
            location: item.location || '',
            text: item.text || '',
            photo: item.photo || '',
          }))
          .filter((item) => item.text)

        if (sanitized.length && !ignore) {
          setItems(sanitized)
        }
      } catch (err) {
        console.error('Failed to load testimonials', err)
      }
    }

    loadTestimonials()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(()=>{
    let rafId
    const speed = 40 // px per second

    const step = (ts) => {
      if (!lastRef.current) lastRef.current = ts
      // update last even while paused to avoid large dt on resume
      const dt = ts - lastRef.current
      lastRef.current = ts

      if (!pausedRef.current && trackRef.current && listRef.current) {
        // accumulate offset
        offsetRef.current += speed * (dt / 1000)
        // Measure total width by summing each child's rendered width + flex gap
        const children = Array.from(listRef.current.children)
        const style = window.getComputedStyle(listRef.current)
        const gap = parseFloat(style.columnGap || style.gap || '0') || 0
        let total = 0
        for (const child of children) {
          const cRect = child.getBoundingClientRect()
          total += Math.round(cRect.width)
        }
        total += Math.round(gap * Math.max(0, children.length - 1))
        // use exact total width (sum of child widths + gaps) and duplicate it
        const totalWidth = total
        if (totalWidth > 0) {
          const trackWidth = totalWidth * 2
          if (widthRef.current !== trackWidth) {
            widthRef.current = trackWidth
            trackRef.current.style.width = `${trackWidth}px`
          }
          offsetRef.current = offsetRef.current % totalWidth
          const rounded = Math.round(offsetRef.current)
          trackRef.current.style.transform = `translate3d(-${rounded}px, 0, 0)`
        }
      }
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)

    const onResize = () => {
      // reset measurements so we recalc width next frame
      widthRef.current = 0
      lastRef.current = null
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    offsetRef.current = 0
    widthRef.current = 0
    lastRef.current = null
    if (trackRef.current) {
      trackRef.current.style.transform = 'translate3d(0, 0, 0)'
    }
  }, [items])

  return (
    <section id="testimonials" className="my-12">
  <h2 className="text-2xl font-semibold mb-4 text-gold">Testimonials</h2>
  <section
    ref={containerRef}
    className="relative w-full overflow-hidden"
  onMouseEnter={() => { setPaused(true); pausedRef.current = true }}
  onMouseLeave={() => { setPaused(false); pausedRef.current = false }}
  aria-label="Client testimonials carousel - auto scrolling, pauses on hover"
  >
        {/* accessible control for keyboard users to pause/resume */}
        <button
          className="sr-only"
          aria-controls="testimonials-track"
          onFocus={() => { setPaused(true); pausedRef.current = true }}
          onBlur={() => { setPaused(false); pausedRef.current = false }}
        >
          {paused ? 'Resume testimonials' : 'Pause testimonials'}
        </button>
        {/* track contains two inline lists to enable seamless loop */}
  <div id="testimonials-track" ref={trackRef} className="flex items-stretch gap-6 will-change-transform flex-nowrap whitespace-nowrap" style={{transform: 'translateX(0)'}}>
          <div ref={listRef} className="inline-flex items-stretch gap-6 whitespace-nowrap">
            {items.map((t, i) => {
              const key = t.id != null ? `testimonial-${t.id}` : `testimonial-${i}`
              const initials = getInitials(t.name || t.photo)
              return (
                <article key={key} className="inline-block min-w-[420px] max-w-md flex-shrink-0 align-top bg-[color:var(--bg-800)] border border-[color:var(--gold)]/8 rounded shadow p-6 whitespace-normal">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-semibold uppercase">
                      {initials}
                    </span>
                    <div>
                      <div className="font-semibold text-gold">{t.name}</div>
                      {t.location && <div className="text-xs text-gray-400">{t.location}</div>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{t.text}</p>
                </article>
              )
            })}
          </div>

          {/* second copy for seamless looping */}
          <div aria-hidden="true" className="inline-flex items-stretch gap-6 whitespace-nowrap">
            {items.map((t, i) => {
              const key = t.id != null ? `testimonial-copy-${t.id}` : `testimonial-copy-${i}`
              const initials = getInitials(t.name || t.photo)
              return (
                <article key={key} className="inline-block min-w-[420px] max-w-md flex-shrink-0 align-top bg-[color:var(--bg-800)] border border-[color:var(--gold)]/8 rounded shadow p-6 whitespace-normal">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-semibold uppercase">
                      {initials}
                    </span>
                    <div>
                      <div className="font-semibold text-gold">{t.name}</div>
                      {t.location && <div className="text-xs text-gray-400">{t.location}</div>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{t.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </section>
  )
}
