import React from 'react'
import WhatsAppButton from './WhatsAppButton'
import HeroCarousel from './HeroCarousel'

export default function Hero(){
  const images = [
    'https://images.unsplash.com/photo-1611021061271-d13576f6bc34?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1634141737347-4069b3c19ee9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1561297331-a9c00b9c2c44?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1611021061271-d13576f6bc34?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1590880795696-20c7dfadacde?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]

  return (
    <section className="relative rounded-lg my-6 overflow-hidden min-h-[56vh] md:min-h-[60vh]">
      <HeroCarousel images={images} interval={5000} />
      <div className="absolute inset-0 bg-[color:rgba(0,0,0,0.45)] p-8 flex items-center z-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-gold">Any Furniture Repair, Carpentry & Interiors</h1>
            <p className="text-gray-300 mb-4">Datta Dhamnaskar — Manager</p>
            <div className="space-x-3">
              <button
                onClick={() => {
                  const el = document.getElementById('contact')
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    history.replaceState(null, '', '#contact')
                  } else {
                    window.location.hash = '#contact'
                  }
                }}
                className="btn-gold px-6 py-3 rounded-md font-semibold"
              >Get a Quote</button>
            </div>
          </div>
          <div className="w-full md:w-1/2 hidden md:block">
            <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop" alt="workshop" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
      {/* Universal WhatsApp button (single instance) */}
      <WhatsAppButton />
    </section>
  )
}
