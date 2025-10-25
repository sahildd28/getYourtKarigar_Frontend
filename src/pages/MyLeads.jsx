import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '../contexts/useAuth';
import { Link } from 'react-router-dom';
import { fetchMyLeads } from '../services/leadsService';

const statusStyles = {
  new: 'bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/40',
  contacted: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
  working: 'bg-blue-500/10 text-blue-300 border border-blue-500/40',
  closed: 'bg-purple-500/10 text-purple-300 border border-purple-500/40',
  default: 'bg-slate-500/10 text-slate-200 border border-slate-500/40'
};

const statusDescriptions = {
  new: 'New: Your enquiry is registered and queued for review.',
  contacted: 'Contacted: A project specialist has been assigned and will reach out via call or message.',
  working: 'Working: Crafting is underway for your request.',
  closed: 'Closed: This request has been completed.'
};

function LeadCard({ lead }) {
  const createdAt = lead.createdAt ? new Date(lead.createdAt) : null;
  const statusKey = lead.status ? lead.status.toLowerCase() : 'default';
  const badgeClass = statusStyles[statusKey] || statusStyles.default;
  const badgeTitle = statusDescriptions[statusKey] || 'Status updates the progress of your project.';

  return (
    <li className="rounded-2xl border border-white/5 bg-[color:rgba(17,18,21,0.85)]/80 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm">
      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] font-semibold">
            {(lead.name || '??').slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="text-lg font-semibold text-white">{lead.name || 'Unnamed request'}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
              {lead.phone && <span>📞 {lead.phone}</span>}
              {lead.email && <span>✉️ {lead.email}</span>}
              {lead.location && <span>📍 {lead.location}</span>}
            </div>
          </div>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
            title={badgeTitle}
          >
            {lead.status || 'Pending'}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-gray-200">
            <div className="text-[0.75rem] uppercase tracking-wide text-gray-400">Project Type</div>
            <div>{lead.projectType || 'N/A'}</div>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-gray-200">
            <div className="text-[0.75rem] uppercase tracking-wide text-gray-400">Project Size</div>
            <div>{lead.projectSize || 'N/A'}</div>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-gray-200">
            <div className="text-[0.75rem] uppercase tracking-wide text-gray-400">Created</div>
            <div>{createdAt ? createdAt.toLocaleString() : 'N/A'}</div>
          </div>
        </div>

        {lead.status && (
          <div className="rounded-xl border border-white/5 bg-[color:var(--bg-900)]/60 p-4 text-sm text-gray-200">
            <div className="mb-1 text-[0.75rem] uppercase tracking-wide text-gray-400">Latest update</div>
            <div className="leading-relaxed">
              {lead.status?.toLowerCase() === 'new'
                ? 'We are reviewing your requirement and will connect shortly.'
                : lead.status?.toLowerCase() === 'contacted'
                ? 'We have reached out and are coordinating the details with you.'
                : lead.status?.toLowerCase() === 'working'
                ? 'Our crew is on-site and construction is progressing as planned.'
                : lead.status?.toLowerCase() === 'closed'
                ? 'Your project has wrapped up. A concierge will share the next milestone soon.'
                : 'Our team is progressing your request. Reach out anytime for updates.'}
            </div>
          </div>
        )}

        {lead.message && (
          <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-sm text-gray-200">
            <div className="mb-1 text-[0.75rem] uppercase tracking-wide text-gray-400">Brief</div>
            <p className="leading-relaxed">{lead.message}</p>
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProjectTracker() {
  const { token, user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;
  const userName = user?.name || 'there';

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchMyLeads(token, userId)
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token, userId]);

  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus = leads.reduce((acc, lead) => {
      const key = (lead.status || 'unknown').toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return { total, byStatus };
  }, [leads]);

  if (!token) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center text-gray-200">
        <h2 className="text-3xl font-semibold text-[color:var(--gold)]">Project Tracker</h2>
        <p className="mt-4 text-lg text-gray-300">Sign in to follow the progress of your project requests.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center text-gray-200">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[color:var(--gold)]/60 border-t-transparent"></div>
        <p className="mt-4 text-sm uppercase tracking-wide text-gray-400">Fetching your project requests…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-900)] text-gray-100">
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[color:var(--bg-800)] to-black/40 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--gold)]/80">Dashboard</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Welcome back, {userName.split(' ')[0]}.</h1>
          <p className="mt-4 max-w-2xl text-gray-300">
            Keep an eye on every enquiry you have shared with us. Our concierge team updates these statuses as your project moves forward.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Requests</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
          </div>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="rounded-2xl border border-white/5 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-gray-400">{status.replace(/_/g, ' ')}</p>
              <p className="mt-2 text-3xl font-bold text-white">{count}</p>
            </div>
          ))}
        </div>

        {leads.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-[color:var(--bg-800)]/40 px-6 py-16 text-center text-gray-300">
            <p className="text-xl font-medium text-white">No project requests yet.</p>
            <p className="mt-2 text-sm text-gray-400">As soon as you share the details of a project, it will appear right here.</p>
            <Link
              to="/contact"
              className="mt-4 inline-block rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-semibold text-black shadow hover:bg-[color:var(--gold)]/80"
            >
              Start a project
            </Link>
          </div>
        ) : (
          <ul className="space-y-5">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
