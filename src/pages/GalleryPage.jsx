import React from 'react'
import Gallery from '../components/Gallery'
import HoneycombShowcase from '../components/HoneycombShowcase'
import { useLocation } from 'react-router-dom'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

export default function GalleryPage(){
  return (
    <div className="min-h-screen flex flex-col">    
      <main className="flex-1 container mx-auto px-4 py-8">
        <GalleryPageInner />
      </main>
    </div>
  )
}

function GalleryPageInner(){
  const q = useQuery()
  const category = q.get('category')
  const categoryId = q.get('categoryId')
  console.log('GalleryPageInner category:', category, 'categoryId:', categoryId)
  const hasCategory = Boolean(categoryId)
  const heading = hasCategory ? (category || 'Service Projects') : 'Service Gallery'
  const subheading = hasCategory
    ? 'Tap a project card to explore images, design notes, and craftsmanship details.'
    : 'Browse highlights from across our services. Select any card to dive into its full project story.'

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">{heading}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-300">{subheading}</p>
      </header>

      {hasCategory ? (
        <Gallery category={category} categoryId={categoryId} />
      ) : (
        <HoneycombShowcase />
      )}
    </div>
  )
}
