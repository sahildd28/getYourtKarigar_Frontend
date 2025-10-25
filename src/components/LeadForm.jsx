import React, {useEffect, useState} from 'react'
import { submitLead } from '../services/leadsService'
import useAuth from '../contexts/useAuth'
import CustomSelect from './CustomSelect'
import { servicesByType, projectTypes, projectSizes } from '../constants/serviceOptions'
import SignInPromptModal from './SignInPromptModal'

export default function LeadForm(){
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    name:'',
    phone:'',
    email:'',
    projectType: '',
    projectSize: '',
    location:'',
    address:'',
    service: '',
    notes:''
  })
  const [status, setStatus] = useState('')
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  useEffect(() => {
    if (token && showAuthPrompt) {
      setShowAuthPrompt(false)
    }
  }, [token, showAuthPrompt])

  const onChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}))

  const onProjectTypeChange = (v) => {
    // Clear dependent service selection so user must pick for the new type
    setForm(prev => ({...prev, projectType: v, service: ''}))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('Saving...')
    if(!token){
      setStatus('Please sign in to submit your request.')
      setShowAuthPrompt(true)
      return
    }
    try{
      // validate required picks
      if(!form.projectType) throw new Error('Please select project type')
      if(!form.projectSize) throw new Error('Please select project size')
      if(!form.service) throw new Error('Please select a service')
      if(!form.notes || !form.notes.trim()) throw new Error('Please provide a brief requirement')

      // include the selected service in the saved message so backend persists it
      const payload = {
        ...form,
        message: (form.service ? form.service + ' — ' : '') + (form.notes || ''),
        userId: user?.id || null,
        source: 'homepage-lead-form'
      }
      await submitLead(payload, token)
      setStatus('Saved — we will contact you soon')
      setForm({name:'', phone:'', email:'', projectType: '', projectSize: '', location:'', address:'', service: '', notes:''})
    }catch(err){
      setStatus('Error saving lead: ' + (err.message || err))
    }
  }

  const inputCls = 'w-full p-3 pl-10 rounded border border-transparent bg-[color:rgba(255,255,255,0.03)] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]'

  return (
    <>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
        <div className="relative">
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" className={inputCls} required />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">👤</div>
        </div>

        <div className="relative">
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone (required)" className={inputCls} required />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">�</div>
        </div>

        <div className="relative">
          <input name="email" value={form.email} onChange={onChange} placeholder="Email (optional)" className={inputCls} />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">✉️</div>
        </div>

        <div className="relative">
          <CustomSelect
            value={form.projectType}
            onChange={onProjectTypeChange}
            options={projectTypes}
            className=""
            placeholder="Select project type"
          />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">🏠</div>
        </div>

        <div className="relative">
          <CustomSelect
            value={form.projectSize}
            onChange={(v)=> setForm(prev=>({...prev, projectSize: v}))}
            options={projectSizes}
            className=""
            placeholder="Select project size"
          />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">�</div>
        </div>

        <div className="relative">
          <input name="location" value={form.location} onChange={onChange} placeholder="Location (city/area)" className={inputCls} />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">📍</div>
        </div>

        <div className="relative">
          <CustomSelect
            value={form.service}
            onChange={(v)=> setForm(prev=>({...prev, service: v}))}
            options={servicesByType[form.projectType] || []}
            className=""
            placeholder={form.projectType ? 'Select service' : 'Pick project type first'}
          />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">🧾</div>
        </div>

        <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Brief requirement (required)" required className="col-span-1 sm:col-span-2 w-full p-3 rounded border border-transparent bg-[color:rgba(255,255,255,0.03)] text-gray-100 placeholder-gray-400" />

        <textarea name="address" value={form.address} onChange={onChange} placeholder="Full address (optional)" className="col-span-1 sm:col-span-2 w-full p-3 rounded border border-transparent bg-[color:rgba(255,255,255,0.03)] text-gray-100 placeholder-gray-400" />

        <div className="col-span-1 sm:col-span-2 flex items-center gap-4">
          <button type="submit" className="btn-gold px-6 py-3 rounded font-semibold">Submit</button>
          <div className="text-sm text-gray-300">{status}</div>
        </div>
      </form>
  <SignInPromptModal open={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} elementId="google-signin-modal-home" />
    </>
  )
}
