import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Projects from './pages/OurProjects' // adjust import name/path if different
import GalleryPage from './pages/GalleryPage' // if you have it
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import MyLeads from './pages/MyLeads'

function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/my-leads" element={<MyLeads />} />
            {/* add other routes here */}
            {/* catch-all unknown routes -> /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
    </BrowserRouter>
  )
}

export default App
