import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop(){
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    // if there's a hash, try to scroll to that element smoothly
    if(hash){
      const id = hash.replace('#','')
      const el = document.getElementById(id)
      if(el){
        // small timeout to allow page content to render
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
        return
      }
    }

    // default: scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname, hash, key])

  return null
}
