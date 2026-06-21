'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import {
  Play, Save, Plus, Trash2, Code2, ChevronLeft,
  Loader2, FileCode, Terminal, X, Check
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LANGUAGES, getLanguageByName } from '@/lib/languages'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import type { Project, ProjectFile } from '@/types'
import { v4 as uuidv4 } from 'uuid'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface ExecuteResult {
  stdout?: string
  stderr?: string
  compile_output?: string
  status?: string
  time?: string
  memory?: number
  error?: string
}

export default function CodeEditor({
  project, files: initialFiles, user
}: {
  project: Project
  files: ProjectFile[]
  user: User
}) {
  const router = useRouter()
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles)
  const [activeFileId, setActiveFileId] = useState<string>(initialFiles[0]?.id || '')
  const [content, setContent] = useState<string>(initialFiles[0]?.content || '')
  const [running, setRunning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [output, setOutput] = useState<ExecuteResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const [stdin, setStdin] = useState('')
  const [showStdin, setShowStdin] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [showNewFile, setShowNewFile] = useState(false)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)

  const lang = getLanguageByName(project.language)
  const activeFile = files.find(f => f.id === activeFileId)

  function switchFile(file: ProjectFile) {
    setActiveFileId(file.id)
    setContent(file.content)
  }

  function handleEditorChange(value: string | undefined) {
    const val = value || ''
    setContent(val)
    // Auto-save after 2s inactivity
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => autoSave(val), 2000)
  }

  async function autoSave(val: string) {
    if (!activeFileId) return
    const supabase = createClient()
    await supabase.from('project_files')
      .update({ content: val, updated_at: new Date().toISOString() })
      .eq('id', activeFileId)
    // update local state
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: val } : f))
  }

  async function saveFile() {
    if (!activeFileId) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('project_files')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', activeFileId)
    if (error) toast.error('Save failed')
    else {
      setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content } : f))
      toast.success('Saved!', { duration: 1500 })
    }
    setSaving(false)
  }

  async function runCode() {
    setRunning(true)
    setShowOutput(true)
    setOutput(null)
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: content,
          language_id: lang.id,
          stdin,
        }),
      })
      const data = await res.json()
      setOutput(data)
    } catch {
      setOutput({ error: 'Failed to connect to execution engine' })
    }
    setRunning(false)
  }

  async function addFile(e: React.FormEvent) {
    e.preventDefault()
    if (!newFileName.trim()) return
    const supabase = createClient()
    const { data, error } = await supabase.from('project_files').insert({
      project_id: project.id,
      name: newFileName.trim(),
      content: `# ${newFileName}\n`,
    }).select().single()
    if (error) { toast.error(error.message); return }
    setFiles(prev => [...prev, data])
    switchFile(data)
    setNewFileName('')
    setShowNewFile(false)
    toast.success('File created')
  }

  async function deleteFile(file: ProjectFile) {
    if (files.length === 1) { toast.error("Can't delete the only file"); return }
    const supabase = createClient()
    await supabase.from('project_files').delete().eq('id', file.id)
    const remaining = files.filter(f => f.id !== file.id)
    setFiles(remaining)
    if (activeFileId === file.id) switchFile(remaining[0])
    toast.success('File deleted')
  }

  const outputText = output?.stdout || output?.compile_output || output?.stderr || output?.error || ''
  const isError = !output?.stdout && (!!output?.stderr || !!output?.compile_output || !!output?.error)

  return (
    <div className="h-screen bg-[#0d0d14] flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0a11] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-sm">{project.name}</span>
            <span className="text-xs bg-blue-500/15 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md font-mono">{project.language}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowStdin(!showStdin)}
            className="text-xs text-white/40 hover:text-white/80 px-3 py-1.5 rounded-lg glass hover:bg-white/8 transition-all flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Input
          </button>
          <button onClick={saveFile} disabled={saving}
            className="flex items-center gap-1.5 text-sm glass hover:bg-white/8 text-white/70 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </button>
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg font-medium transition-all disabled:opacity-60"
            style={{boxShadow:'0 0 15px rgba(34,197,94,0.3)'}}>
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            {running ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Sidebar */}
        <div className="w-48 flex-shrink-0 border-r border-white/[0.06] bg-[#0a0a11] flex flex-col">
          <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06]">
            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Files</span>
            <button onClick={() => setShowNewFile(!showNewFile)}
              className="text-white/40 hover:text-white transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showNewFile && (
            <form onSubmit={addFile} className="p-2 border-b border-white/[0.06]">
              <input
                type="text"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                placeholder="filename.py"
                autoFocus
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-blue-500/60"
              />
            </form>
          )}

          <div className="flex-1 overflow-y-auto py-1">
            {files.map(file => (
              <div key={file.id}
                onClick={() => switchFile(file)}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer group transition-all ${
                  file.id === activeFileId
                    ? 'bg-blue-500/10 border-l-2 border-blue-500 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                }`}>
                <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs truncate flex-1">{file.name}</span>
                {files.length > 1 && (
                  <button onClick={e => { e.stopPropagation(); deleteFile(file) }}
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stdin input */}
          {showStdin && (
            <div className="border-b border-white/[0.06] bg-[#0a0a11] px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/40">Standard Input (stdin)</span>
              </div>
              <textarea
                value={stdin}
                onChange={e => setStdin(e.target.value)}
                placeholder="Enter program input here..."
                rows={2}
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 resize-none font-mono"
              />
            </div>
          )}

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={lang.monacoLang}
              value={content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                formatOnPaste: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Output Panel */}
          {showOutput && (
            <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#080810]" style={{height:'220px'}}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-xs text-white/40 font-medium">Output</span>
                  {output?.status && (
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      output.status === 'Accepted' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {output.status}
                    </span>
                  )}
                  {output?.time && <span className="text-xs text-white/25">{output.time}s</span>}
                </div>
                <button onClick={() => setShowOutput(false)} className="text-white/30 hover:text-white/70 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-full overflow-y-auto px-4 py-3">
                {running ? (
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing...
                  </div>
                ) : outputText ? (
                  <pre className={`text-sm font-mono whitespace-pre-wrap leading-relaxed output-text ${isError ? 'text-red-400' : 'text-green-400'}`}>
                    {outputText}
                  </pre>
                ) : (
                  <p className="text-white/25 text-sm">No output</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
