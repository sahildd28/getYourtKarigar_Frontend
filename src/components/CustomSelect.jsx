import React, {useState, useRef, useEffect} from 'react'

export default function CustomSelect({value, onChange, options, className, placeholder}){
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(()=>{
    function onDoc(e){
      if(ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return ()=> document.removeEventListener('mousedown', onDoc)
  },[])

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      <button type="button" onClick={()=>setOpen(v=>!v)} className="w-full text-left p-3 pl-10 rounded bg-[color:var(--bg-800)] text-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]">
        <span className="inline-block truncate">{value || placeholder || '-- Please select --'}</span>
      </button>
      <div className={`absolute z-40 mt-1 w-full bg-[color:var(--bg-900)] border border-[color:rgba(255,255,255,0.04)] rounded shadow ${open ? 'block' : 'hidden'}`}>
        {options.map(opt => (
          <button key={opt} onClick={()=>{ onChange(opt); setOpen(false) }} className="w-full text-left px-3 py-2 text-gray-200 hover:bg-[color:var(--bg-800)]">{opt}</button>
        ))}
      </div>
    </div>
  )
}
