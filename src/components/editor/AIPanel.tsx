'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, X, Clipboard, Check, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIPanelProps {
  code: string
  language: string
  onClose: () => void
  onInsertCode: (code: string) => void
}

const QUICK_PROMPTS = [
  'Explain this code',
  'Fix the bug',
  'Add comments',
  'Optimize this',
  'Add error handling',
  'Write a test',
]

function extractCodeBlock(text: string): string | null {
  const match = text.match(/```[\w]*\n?([\s\S]*?)```/)
  return match ? match[1].trim() : null
}

function MessageBubble({
  msg,
  onInsert,
}: {
  msg: Message
  onInsert: (code: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'
  const codeBlock = !isUser ? extractCodeBlock(msg.content) : null

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Render content: split by code fences
  const parts = msg.content.split(/(```[\w]*\n?[\s\S]*?```)/g)

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-[#DCFF50]/10 border border-[#DCFF50]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3 h-3" style={{ color: '#DCFF50' }} />
        </div>
      )}
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {parts.map((part, i) => {
          const codeMatch = part.match(/```([\w]*)\n?([\s\S]*?)```/)
          if (codeMatch) {
            const code = codeMatch[2].trim()
            return (
              <div key={i} className="w-full rounded-lg overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/[0.06]">
                  <span className="text-[10px] text-white/30 font-mono">{codeMatch[1] || 'code'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copy(code)}
                      className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/70 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Clipboard className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => onInsert(code)}
                      className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-semibold transition-colors"
                      style={{ background: '#DCFF50', color: '#0e0e0e' }}
                    >
                      Insert
                    </button>
                  </div>
                </div>
                <pre className="px-3 py-2.5 text-[11px] font-mono text-green-300 overflow-x-auto bg-[#080810] leading-relaxed">
                  {code}
                </pre>
              </div>
            )
          }
          const text = part.trim()
          if (!text) return null
          return (
            <div
              key={i}
              className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                isUser
                  ? 'text-black font-medium'
                  : 'bg-white/[0.05] text-white/80'
              }`}
              style={isUser ? { background: '#DCFF50' } : {}}
            >
              {text}
            </div>
          )
        })}
        {/* Insert full code if response has a code block */}
        {codeBlock && (
          <button
            onClick={() => onInsert(codeBlock)}
            className="text-[10px] px-3 py-1 rounded font-semibold transition-colors"
            style={{ background: '#DCFF50', color: '#0e0e0e' }}
          >
            ↑ Replace editor with this code
          </button>
        )}
      </div>
    </div>
  )
}

export default function AIPanel({ code, language, onClose, onInsertCode }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey! I'm your AI coding assistant. I can see your ${language} code.\n\nAsk me anything — I can explain, fix bugs, optimize, or generate new code for you.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(userMessage: string) {
    if (!userMessage.trim() || loading) return
    const userMsg: Message = { role: 'user', content: userMessage.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build history (exclude the greeting)
    const history = [...messages.slice(1), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, code, language }),
      })
      const data = await res.json()
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to AI. Check your API key.' }])
    }
    setLoading(false)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a11] border-l border-white/[0.06]" style={{ fontFamily: 'var(--font-stack)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: '#DCFF50' }} />
          <span className="text-sm font-bold text-white">AI Assistant</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: '#DCFF50', color: '#0e0e0e' }}>
            GPT-4o mini
          </span>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2.5 border-b border-white/[0.06] flex-shrink-0">
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={loading}
            className="text-[10px] px-2 py-1 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors rounded disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onInsert={onInsertCode} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <div className="w-6 h-6 rounded-full bg-[#DCFF50]/10 border border-[#DCFF50]/20 flex items-center justify-center">
              <Bot className="w-3 h-3" style={{ color: '#DCFF50' }} />
            </div>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
        <div className="flex items-end gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-white/20 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask AI anything about your code..."
            rows={1}
            className="flex-1 bg-transparent text-white text-xs placeholder-white/20 focus:outline-none resize-none leading-relaxed max-h-28 overflow-y-auto"
            style={{ fontFamily: 'var(--font-stack)' }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
            style={{ background: '#DCFF50' }}
          >
            <Send className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
