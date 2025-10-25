import React, { useEffect, useMemo, useState } from 'react'
import { submitLead } from '../services/leadsService'
import useAuth from '../contexts/useAuth'
import { servicesByType, projectTypes, projectSizes } from '../constants/serviceOptions'
import SignInPromptModal from '../components/SignInPromptModal'

export default function Contact(){
  const { token, user } = useAuth();
  const [form, setForm] = useState({ name:'', contact:'', email:'', projectType:'', projectSize:'', location:'', address:'', service:'', message:'' })
  const [status, setStatus] = useState({ loading:false, ok:null, error:null })
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  useEffect(() => {
    if (token && showAuthPrompt) {
      setShowAuthPrompt(false)
    }
  }, [token, showAuthPrompt])

  const availableServices = useMemo(() => servicesByType[form.projectType] || [], [form.projectType])

  async function handleSubmit(e){
    e.preventDefault()
    if(!token){
      setStatus({ loading:false, ok:null, error:'Please sign in to submit your request.' })
      setShowAuthPrompt(true)
      return
    }
    setStatus({ loading:true, ok:null, error:null })
    try{
      if(!form.projectType) throw new Error('Please select a project type')
      if(!form.projectSize) throw new Error('Please select a project size')
      if(!form.service) throw new Error('Please select a service')
      await submitLead({
        name: form.name,
        contact: form.contact,
        email: form.email,
        projectType: form.projectType,
        projectSize: form.projectSize,
        location: form.location,
        address: form.address,
        service: form.service,
        message: form.message,
        source: 'contact-page',
        userId: user?.id || null
      }, token)
      setStatus({ loading:false, ok:'Message sent. We will contact you soon.', error:null })
      setForm({ name:'', contact:'', email:'', projectType:'', projectSize:'', location:'', address:'', service:'', message:'' })
    }catch(err){
      setStatus({ loading:false, ok:null, error: err?.message || 'Failed to send' })
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[color:var(--bg-900)] text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gold mb-4">Contact Us</h1>
        <p className="text-gray-300 mb-8">Have a project in mind? Tell us about the scale and service you need and our experts will reach out with tailored guidance.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-2 bg-[color:var(--bg-800)] p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Your name" className="w-full p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none" required />
              <input value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} placeholder="Phone number" className="w-full p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none" required />
              <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email (optional)" className="w-full p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none" />
              <select
                value={form.projectType}
                onChange={e=>setForm(prev=>({...prev, projectType:e.target.value, service:'' }))}
                className="w-full p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none"
                required
              >
                <option value="" disabled>Select project type</option>
                {projectTypes.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                value={form.projectSize}
                onChange={e=>setForm({...form, projectSize:e.target.value})}
                className="w-full p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none"
                required
              >
                <option value="" disabled>Select project size</option>
                {projectSizes.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Location (city or area)" className="w-full p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none" />
            </div>
            <select
              value={form.service}
              onChange={e=>setForm({...form, service:e.target.value})}
              className="w-full mt-4 p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none"
              required
              disabled={!availableServices.length}
            >
              <option value="" disabled>{form.projectType ? 'Select a service' : 'Choose project type first'}</option>
              {availableServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Full address (optional)" className="w-full mt-4 p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none" />
            <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Message / project details" className="w-full mt-4 p-3 rounded bg-[#0f1112] border border-transparent focus:border-[color:var(--gold)] outline-none h-32" />

            <div className="mt-4">
              <button type="submit" disabled={status.loading} className="btn-gold px-5 py-2 rounded">
                {status.loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            {status.ok && <div className="mt-3 text-green-400">{status.ok}</div>}
            {status.error && <div className="mt-3 text-red-400">{status.error}</div>}
          </form>

          <aside className="space-y-6">
            <div className="bg-[color:var(--bg-800)] p-6 rounded-lg">
              <h3 className="font-bold text-gold">Contact Details</h3>
              <p className="text-gray-300 mt-2">Phone: <a className="text-gold" href="tel:+7021226296">+7021226296</a></p>
              <p className="text-gray-300">Location: Mumbai, MH</p>
              <p className="text-gray-300 mt-2">Email: <a className="text-gold" href="mailto:info@saraswati-contractors.example">info@saraswati-contractors.example</a></p>
            </div>
          </aside>
        </div>
      </div>
      </div>
  <SignInPromptModal open={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} elementId="google-signin-modal-contact" />
    </>
  )
}
