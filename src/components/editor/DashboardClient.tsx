'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, LogOut, Clock, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LANGUAGES } from '@/lib/languages'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import type { Project } from '@/types'
import { v4 as uuidv4 } from 'uuid'

function LangIcon({ name }: { name: string }) {
  switch (name) {
    case 'Python':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4C14 4 11 7 11 11v3h9v1.5H9C5 15.5 3 19 3 24s2.5 7 6.5 7H12v-4c0-4 3-6 8-6h8c5 0 8-3 8-7.5V11C36 6.5 29 4 20 4zm-2 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="#4B8BBE"/>
          <path d="M20 36c6 0 9-3 9-7v-3H20v-1.5h12c4 0 6-3.5 6-8s-2.5-7-6.5-7H29v4c0 4-3 6-8 6h-8c-5 0-8 3-8 7.5V31c0 3.5 7 5 15 5zm2-4.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#FFD43B"/>
        </svg>
      )
    case 'JavaScript':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" fill="#F7DF1E"/>
          <path d="M23 28.5c.6 1 1.4 1.7 2.8 1.7 1.2 0 2-.6 2-1.4 0-1-.7-1.3-2-2l-.7-.3c-2.1-.9-3.5-2-3.5-4.3 0-2.1 1.6-3.7 4.2-3.7 1.8 0 3.1.6 4 2.3l-2.2 1.4c-.5-.9-1-1.3-1.8-1.3-.8 0-1.4.5-1.4 1.3 0 .9.5 1.2 1.8 1.8l.7.3c2.4 1 3.8 2.1 3.8 4.5 0 2.5-2 4-5 4-2.6 0-4.3-1.3-5.1-3L23 28.5zM11.5 28.8c.5.8 1 1.4 1.9 1.4.9 0 1.4-.4 1.4-1.6V18h2.8v10.7c0 2.5-1.5 3.6-3.6 3.6-2 0-3.1-1-3.6-2.2l2.1-1.3z" fill="#323330"/>
        </svg>
      )
    case 'TypeScript':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" fill="#3178C6"/>
          <path d="M7 15h11v2.5H14v11.5h-3V17.5H7V15zM20 22.2c0-1.1.9-1.9 2.1-1.9 1.1 0 1.9.7 2.2 1.8l2.5-1.5c-.9-1.9-2.6-2.8-4.7-2.8-3 0-5 1.8-5 4.6 0 5.4 6.8 4 6.8 6.7 0 1-.8 1.7-1.9 1.7-1.5 0-2.2-.8-2.7-1.9l-2.6 1.5c.9 2 2.8 3.1 5.3 3.1 3.1 0 5.3-1.7 5.3-4.6 0-5.5-6.8-4.1-6.8-6.7z" fill="white"/>
        </svg>
      )
    case 'Java':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4s1 2 1 5-3 4-3 7 2 4 2 4h8s-2-2-2-5 3-4 3-7-2-4-2-4h-7z" fill="#E76F00"/>
          <path d="M14 22h12v1.5c0 4.5-3 8-6 8s-6-3.5-6-8V22z" fill="#5382A1"/>
          <rect x="13" y="20" width="14" height="3" rx="1" fill="#407BB6"/>
          <path d="M26 22.5h3c1 0 1.5-.7 1.5-1.5v-1c0-.8-.5-1.5-1.5-1.5h-3v4z" fill="#5382A1"/>
        </svg>
      )
    case 'C++':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L4 11v18l16 9 16-9V11L20 2z" fill="#00599C"/>
          <path d="M20 2L4 11v18l16 9 16-9V11L20 2z" fill="none" stroke="#00427A" strokeWidth="1"/>
          <text x="20" y="26" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="12" fill="white">C++</text>
        </svg>
      )
    case 'Go':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#00ACD7"/>
          <ellipse cx="14" cy="18" rx="4" ry="4.5" fill="white"/>
          <ellipse cx="26" cy="18" rx="4" ry="4.5" fill="white"/>
          <circle cx="13.5" cy="18" r="2" fill="#00ACD7"/>
          <circle cx="25.5" cy="18" r="2" fill="#00ACD7"/>
          <circle cx="14" cy="18" r="1" fill="#222"/>
          <circle cx="26" cy="18" r="1" fill="#222"/>
          <ellipse cx="20" cy="23" rx="3.5" ry="2" fill="#CE8861"/>
          <text x="20" y="35" textAnchor="middle" fontFamily="Arial Black" fontSize="7" fontWeight="900" fill="white">Go</text>
        </svg>
      )
    case 'C#':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L4 11v18l16 9 16-9V11L20 2z" fill="#9B4F96"/>
          <text x="20" y="26" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="14" fill="white">C#</text>
        </svg>
      )
    case 'Kotlin':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="kt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E44857"/>
              <stop offset="50%" stopColor="#C711E1"/>
              <stop offset="100%" stopColor="#7F52FF"/>
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="4" fill="url(#kt)"/>
          <path d="M5 5h15L5 21V5zM5 21L20 5h15L5 35V21zM5 35l15-14h15L20 35H5z" fill="white" opacity="0.92"/>
        </svg>
      )
    case 'Swift':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#F05138"/>
          <path d="M34 24c0-7.5-6.5-13.5-14-13-2.5.2-5 1.2-7 2.8 4.5-1.5 9.5.5 13 4-4-2.5-9-3.5-13-1.5-2.5 1-4.5 3-6 5.5 0 0 2-3.5 4.5-4.5-2.5 4-3 8.5-1 12 2.5 4.5 7.5 6.5 12.5 5.5 6.5-1.5 11-7 11-13.8z" fill="white"/>
        </svg>
      )
    case 'Rust':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#1C1C1C"/>
          <circle cx="20" cy="20" r="9" fill="none" stroke="#CE422B" strokeWidth="2.5"/>
          <circle cx="20" cy="20" r="3.5" fill="#CE422B"/>
          <rect x="19" y="9" width="2" height="4" rx="1" fill="#CE422B"/>
          <rect x="19" y="27" width="2" height="4" rx="1" fill="#CE422B"/>
          <rect x="9" y="19" width="4" height="2" rx="1" fill="#CE422B"/>
          <rect x="27" y="19" width="4" height="2" rx="1" fill="#CE422B"/>
          <rect x="12.5" y="11.5" width="4" height="2" rx="1" transform="rotate(-45 12.5 11.5)" fill="#CE422B"/>
          <rect x="25.5" y="26.5" width="4" height="2" rx="1" transform="rotate(-45 25.5 26.5)" fill="#CE422B"/>
          <rect x="12.5" y="26.5" width="4" height="2" rx="1" transform="rotate(45 12.5 26.5)" fill="#CE422B"/>
          <rect x="25.5" y="11.5" width="4" height="2" rx="1" transform="rotate(45 25.5 11.5)" fill="#CE422B"/>
        </svg>
      )
    case 'Scala':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#DC322F"/>
          <rect x="8" y="11" width="24" height="4.5" rx="0.5" fill="white" opacity="0.85"/>
          <rect x="8" y="17.5" width="24" height="4.5" rx="0.5" fill="white" opacity="0.85"/>
          <rect x="8" y="24" width="24" height="4.5" rx="0.5" fill="white" opacity="0.85"/>
        </svg>
      )
    case 'C':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L4 11v18l16 9 16-9V11L20 2z" fill="#6B8FBF"/>
          <text x="20" y="27" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="20" fill="white">C</text>
        </svg>
      )
    case 'PHP':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#4F5B93"/>
          <ellipse cx="20" cy="20" rx="16" ry="8" fill="#8892BF"/>
          <text x="20" y="24" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="white">php</text>
        </svg>
      )
    case 'Ruby':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#CC342D"/>
          <path d="M20 7l11 9-11 17-11-17 11-9z" fill="white" opacity="0.15"/>
          <path d="M20 7l11 9H9L20 7z" fill="white" opacity="0.5"/>
          <path d="M9 16h22L20 33 9 16z" fill="white" opacity="0.12"/>
          <path d="M20 7l-11 9 11 17L20 7z" fill="white" opacity="0.08"/>
          <path d="M20 7l11 9-11 17-11-17 11-9z" fill="none" stroke="white" strokeWidth="1.2" opacity="0.5"/>
        </svg>
      )
    case 'R':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#276DC3"/>
          <text x="21" y="31" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="26" fill="white">R</text>
        </svg>
      )
    case 'Bash':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#1E2D1E"/>
          <text x="7" y="27" fontFamily="Courier New,monospace" fontSize="15" fontWeight="bold" fill="#4EAA25">{'>'}_ </text>
        </svg>
      )
    default:
      return null
  }
}

const LANG_FILTERS = ['All', 'Popular', 'Programming', 'Web']

const LANG_PICKER = [
  { name: 'Python',     tag: 'popular'     },
  { name: 'JavaScript', tag: 'popular'     },
  { name: 'TypeScript', tag: 'popular'     },
  { name: 'Java',       tag: 'popular'     },
  { name: 'C++',        tag: 'popular'     },
  { name: 'Go',         tag: 'popular'     },
  { name: 'C#',         tag: 'programming' },
  { name: 'Kotlin',     tag: 'programming' },
  { name: 'Swift',      tag: 'programming' },
  { name: 'Rust',       tag: 'programming' },
  { name: 'Scala',      tag: 'programming' },
  { name: 'C',          tag: 'programming' },
  { name: 'PHP',        tag: 'web'         },
  { name: 'Ruby',       tag: 'web'         },
  { name: 'R',          tag: 'programming' },
  { name: 'Bash',       tag: 'programming' },
]

const LANG_COLORS: Record<string, string> = {
  Python:     '#3b82f6',
  JavaScript: '#eab308',
  TypeScript: '#3178c6',
  Go:         '#00ADD8',
  'C++':      '#a855f7',
  'C#':       '#9b59b6',
  Java:       '#f97316',
  Kotlin:     '#7F52FF',
  Swift:      '#F05138',
  Scala:      '#DC322F',
  C:          '#6b7280',
  Rust:       '#f59e0b',
  Ruby:       '#ef4444',
  PHP:        '#8b5cf6',
  R:          '#276DC3',
  Bash:       '#4eaa25',
}

export default function DashboardClient({ user, projects }: { user: User; projects: Project[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLang, setNewLang] = useState('Python')
  const [creating, setCreating] = useState(false)
  const [langSearch, setLangSearch] = useState('')
  const [langFilter, setLangFilter] = useState('All')

  const name = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Coder'

  useEffect(() => {
    const createLang = searchParams.get('create')
    if (createLang) {
      const matched = LANGUAGES.find(l => l.name.toLowerCase() === createLang.toLowerCase())
      if (matched) setNewLang(matched.name)
      setShowNew(true)
    }
  }, [searchParams])

  function pickLanguage(langName: string) {
    setNewLang(langName)
    setNewName('')
    setShowNew(true)
    setTimeout(() => document.getElementById('new-project-name')?.focus(), 50)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const supabase = createClient()
    const lang = LANGUAGES.find(l => l.name === newLang)!
    const { data, error } = await supabase.from('projects').insert({
      id: uuidv4(),
      name: newName.trim(),
      language: newLang,
      user_id: user.id,
    }).select().single()
    if (error) { toast.error(error.message); setCreating(false); return }
    await supabase.from('project_files').insert({
      project_id: data.id,
      name: `main.${lang.extension}`,
      content: lang.template,
    })
    toast.success('Project created!')
    router.push(`/project/${data.id}`)
  }

  async function deleteProject(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Project deleted')
    router.refresh()
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg)', fontFamily: 'var(--font-stack)' }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-white/10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-16 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/40">&gt;_</span>
            <span className="font-bold text-[17px] tracking-[0.06em]">CODEITUP</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-white/30 text-xs">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors border border-white/10 px-3 py-1.5 hover:border-white/30"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-16 py-14">

        {/* ── GREETING ── */}
        <div className="mb-12 border-b border-white/10 pb-12">
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3">Dashboard</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Hey, {name}
          </h1>
          <p className="text-white/40 text-sm">Your projects workspace</p>
        </div>

        {/* ── LANGUAGE PICKER ── */}
        <div className="mb-14">
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-5">Start a new project</p>

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
              <input
                type="text"
                placeholder="Search language..."
                value={langSearch}
                onChange={e => setLangSearch(e.target.value)}
                className="w-full bg-transparent border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              {LANG_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setLangFilter(f)}
                  className="text-[11px] font-semibold px-4 py-2 border transition-colors"
                  style={
                    langFilter === f
                      ? { background: 'var(--accent)', color: '#0e0e0e', borderColor: 'var(--accent)' }
                      : { background: 'transparent', color: '#52525b', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {(() => {
            const filtered = LANG_PICKER.filter(l => {
              const matchSearch = l.name.toLowerCase().includes(langSearch.toLowerCase())
              const matchFilter = langFilter === 'All' || l.tag === langFilter.toLowerCase()
              return matchSearch && matchFilter
            })
            return filtered.length === 0 ? (
              <p className="text-white/20 text-xs py-6">No languages match &quot;{langSearch}&quot;</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {filtered.map(lang => (
                  <button
                    key={lang.name}
                    onClick={() => pickLanguage(lang.name)}
                    className="group flex flex-col items-center gap-2.5 border border-white/10 p-4 hover:border-white/30 transition-all hover:bg-white/[0.03]"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden transition-transform group-hover:scale-110 shrink-0">
                      <LangIcon name={lang.name} />
                    </div>
                    <span className="text-[11px] text-white/40 group-hover:text-white/80 transition-colors font-medium">
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>
            )
          })()}
        </div>

        {/* ── PROJECTS HEADER ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">
              Projects
            </h2>
            <span className="text-xs text-white/20 border border-white/10 px-2 py-0.5">
              {projects.length}
            </span>
          </div>
          <button
            onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-md transition-colors"
            style={{ background: 'var(--accent)', color: '#0e0e0e' }}
          >
            <Plus className="w-3.5 h-3.5" /> New Project
          </button>
        </div>

        {/* ── NEW PROJECT FORM ── */}
        {showNew && (
          <form onSubmit={createProject} className="border border-white/10 p-6 mb-8 bg-[#0a0a0a]">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-5">New Project</p>
            <div className="flex gap-3 mb-4">
              <input
                id="new-project-name"
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Project name"
                autoFocus
                required
                className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors"
              />
              <select
                value={newLang}
                onChange={e => setNewLang(e.target.value)}
                className="bg-black border border-white/20 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/50 transition-colors"
              >
                {LANGUAGES.map(l => (
                  <option key={l.name} value={l.name} className="bg-black">{l.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="text-xs font-bold px-6 py-2.5 rounded-md transition-colors disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#0e0e0e' }}
              >
                {creating ? 'Creating...' : 'Create Project →'}
              </button>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="text-white/40 hover:text-white text-xs px-6 py-2.5 border border-white/10 hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── PROJECTS GRID ── */}
        {projects.length === 0 ? (
          <div className="border border-white/10 p-20 text-center">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-4">&gt;_ no projects yet</p>
            <p className="text-white font-bold text-xl mb-2">Start your first project</p>
            <p className="text-white/40 text-sm mb-8">Create a project and start coding in your browser</p>
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 text-xs font-bold px-6 py-3 rounded-md transition-colors"
              style={{ background: 'var(--accent)', color: '#0e0e0e' }}
            >
              <Plus className="w-3.5 h-3.5" /> Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => router.push(`/project/${project.id}`)}
                className="border border-white/10 p-5 cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-all group"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: LANG_COLORS[project.language] || '#6b7280' }}
                    />
                    <span className="text-xs text-white/50">{project.language}</span>
                  </div>
                  <button
                    onClick={e => deleteProject(project.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name */}
                <h3 className="font-bold text-base text-white mb-3 truncate">{project.name}</h3>

                {/* Date + arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/20 text-xs">
                    <Clock className="w-3 h-3" />
                    {format(new Date(project.updated_at), 'MMM d, yyyy')}
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 text-xs transition-colors">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
