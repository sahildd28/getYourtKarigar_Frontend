import React from 'react'
import Hero from '../components/Hero'
import CategoriesGrid from '../components/CategoriesGrid'
import LeadForm from '../components/LeadForm'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import EnterpriseSolutions from '../components/EnterpriseSolutions'

export default function Home(){
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
  <Hero />
  <WhyChooseUs />
  <EnterpriseSolutions />
  <CategoriesGrid />
        <section id="contact" className="my-12">
          <h2 className="text-2xl font-semibold mb-4">Get a Quote</h2>
          <LeadForm />
        </section>
        <Testimonials />
      </main>

    </div>
  )
}
