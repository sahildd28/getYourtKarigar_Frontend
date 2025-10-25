import React, {useRef, useState, useEffect} from 'react'

export default function BeforeAfterSlider({beforeSrc, afterSrc, alt}){
  const [pos, setPos] = useState(50)
  const ref = useRef()

  useEffect(()=>{
    const el = ref.current
    if(!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.touches ? e.touches[0].clientX : e.clientX
      const p = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100))
      setPos(p)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('touchmove', onMove)
    return ()=>{
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('touchmove', onMove)
    }
  },[])

  return (
    <div ref={ref} className="relative w-full h-64 bg-gray-100 overflow-hidden rounded">
      <img src={afterSrc} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{width: `${pos}%`}}>
        <img src={beforeSrc} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div style={{left:`${pos}%`}} className="absolute top-0 bottom-0 w-0.5 bg-white opacity-80" />
    </div>
  )
}
