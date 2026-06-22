'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Star, ExternalLink, GitBranch, Server, Code2, LogIn } from 'lucide-react'
import heroImage from '@/images/Img-one.png'

const FAQS = [
  { q: 'Can I use CodeItUp for free?', a: 'Yes. CodeItUp is completely free to use. Create an account and start running code in your browser instantly — no credit card required.' },
  { q: 'What programming languages are supported?', a: 'Currently 8 languages: Python, JavaScript, C++, Java, C, Rust, Ruby, and PHP. More languages may be added in future updates.' },
  { q: 'How does code execution work?', a: 'Code is submitted to Judge0, a battle-tested open-source sandboxed execution engine. Your code runs in an isolated container and results are returned within seconds.' },
  { q: 'Is my code saved automatically?', a: 'Yes. The editor auto-saves your code with a 2-second debounce. All projects and files are persisted in your account via Supabase.' },
  { q: 'Can I provide custom input (stdin)?', a: 'Yes. Toggle the Input panel in the editor to provide custom stdin before running your code.' },
  { q: 'Is CodeItUp open source?', a: 'Yes. This project is open source and built as a resume/portfolio project using Next.js, Supabase, Monaco Editor, and Judge0.' },
  { q: 'How do I get started?', a: 'Click "Get Started" to create a free account with email or Google. Once signed in, create a project, pick a language, and start coding.' },
]

const FEATURES = [
  'Open-source, fast online code execution',
  'Write, run and save code in your browser',
  'AI Assistant powered by GPT-4o mini',
  'Ask AI to explain, fix, or generate code',
  'Support for 16+ programming languages',
  'Sandboxed compilation and execution',
  'Custom stdin input support',
  'Multiple files per project',
  'Auto-save as you type',
  'GitHub authentication',
  'Works on any device with a browser',
]

const LANGUAGES = [
  { name: 'Python',     color: '#3b82f6' },
  { name: 'JavaScript', color: '#eab308' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Go',         color: '#00ADD8' },
  { name: 'C++',        color: '#a855f7' },
  { name: 'C#',         color: '#9b59b6' },
  { name: 'Java',       color: '#f97316' },
  { name: 'Kotlin',     color: '#7F52FF' },
  { name: 'Swift',      color: '#F05138' },
  { name: 'Rust',       color: '#f59e0b' },
  { name: 'Scala',      color: '#DC322F' },
  { name: 'Ruby',       color: '#ef4444' },
  { name: 'PHP',        color: '#8b5cf6' },
  { name: 'R',          color: '#276DC3' },
  { name: 'Bash',       color: '#4eaa25' },
  { name: 'C',          color: '#6b7280' },
]

const NAV_LINKS = ['Products', 'Pricing', 'Contact', 'Blog', 'FAQ', 'Support']

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.75s ease ${delay}ms, filter 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(10px)',
        transform: visible ? 'translateY(0px)' : 'translateY(28px)',
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg)', fontFamily: 'var(--font-stack)' }}>

      {/* ── PARALLAX BACKGROUND ORBS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(220,255,80,0.07) 0%, transparent 70%)',
            top: '5%', left: '10%',
            transform: `translateY(${scrollY * 0.18}px)`,
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            top: '40%', right: '5%',
            transform: `translateY(${-scrollY * 0.12}px)`,
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(220,255,80,0.05) 0%, transparent 70%)',
            bottom: '10%', left: '30%',
            transform: `translateY(${-scrollY * 0.08}px)`,
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)',
            top: '70%', left: '5%',
            transform: `translateY(${scrollY * 0.1}px)`,
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm" style={{ background: 'rgba(14,14,14,0.85)' }}>
        <div className="max-w-7xl mx-auto px-16 h-[60px] flex items-center justify-between gap-8">
          <Link href="/" className="font-bold text-[17px] tracking-[0.06em] shrink-0">CODEITUP</Link>
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map(item => (
              <Link key={item}
                href={item === 'FAQ' ? '#faq' : item === 'Contact' ? '#contact' : '#'}
                className="text-[11px] text-zinc-400 hover:text-white transition-colors tracking-[0.14em] font-medium whitespace-nowrap">
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2.5 text-[13px] text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 hover:border-zinc-500 transition-colors">
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
              <span className="flex items-center gap-1 text-zinc-500 border-l border-zinc-700 pl-2.5">
                3.5k <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            </Link>
            <Link href="/auth/login"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
              <LogIn className="w-4 h-4" />
            </Link>
            <Link href="/auth/register"
              className="text-sm font-bold px-4 py-2 rounded-md transition-colors"
              style={{ background: 'var(--accent)', color: '#0e0e0e' }}>
              Try for free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── ANNOUNCEMENT BANNER ── */}
      <div className="relative z-10 border-b border-white/10 px-16 py-3 flex items-center gap-3" style={{ background: '#1a1a0a' }}>
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'var(--accent)', color: '#0e0e0e' }}>New</span>
        <p className="text-sm text-white/60">
          CodeItUp now has a built-in AI Assistant (GPT-4o mini) + 16 languages with sandboxed execution.{' '}
          <Link href="/auth/register" className="underline" style={{ color: 'var(--accent)' }}>Start coding free →</Link>
        </p>
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-16 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">
            <FadeIn delay={0}>
              <h1 className="text-[clamp(3.5rem,7vw,6rem)] font-bold leading-[1.0] tracking-[-0.03em] mb-8">
                <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--accent)' }}>AI-powered</span>
                <br />
                <span style={{ color: 'var(--accent)' }}>code execution</span>
                <br />
                <span className="text-white">for every dev</span>
              </h1>
              <p className="text-zinc-400 text-lg leading-[1.7] mb-12 max-w-sm">
                Programmatically run code in isolated sandboxes for instant execution in your browser. Free forever.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link href="/auth/register"
                  className="inline-flex items-center gap-2 text-[15px] font-bold px-7 py-3.5 rounded-md transition-colors"
                  style={{ background: 'var(--accent)', color: '#0e0e0e' }}>
                  Start for free
                </Link>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-600 text-zinc-200 text-[15px] font-medium px-7 py-3.5 rounded-md hover:border-zinc-400 hover:text-white transition-colors">
                  View on GitHub <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { icon: GitBranch, label: 'Open Source' },
                  { icon: Server,    label: 'Self Hostable' },
                  { icon: Code2,     label: 'AI Assistant' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-[13px] text-zinc-400">
                    <Icon className="w-4 h-4 text-zinc-500" /> {label}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div
                className="rounded-lg overflow-hidden border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
                style={{ transform: `translateY(${scrollY * 0.06}px)` }}
              >
                <Image src={heroImage} alt="CodeItUp IDE" className="w-full h-auto" priority />
              </div>
            </FadeIn>
          </div>
        </div>

      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <FadeIn>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] mb-8" style={{ color: 'var(--accent)' }}>Platform</p>
            <h2 className="text-4xl font-bold leading-[1.12] tracking-[-0.02em] mb-8">
              Free and open-source<br />
              online code editor<br />
              <span className="text-zinc-600">for everyone</span>
            </h2>
            <p className="text-zinc-400 text-base leading-[1.7] mb-10 max-w-md">
              Perfect for developers, students, and educators who need a reliable coding environment accessible from any browser. No local setup required.
            </p>
            <ul className="space-y-4">
              {FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-zinc-300">
                  <span className="mt-1 text-sm shrink-0" style={{ color: 'var(--accent)' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          </FadeIn>

          <FadeIn delay={150}>
          <div className="rounded-lg overflow-hidden border border-white/10" style={{ background: '#1a1a1a' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: '#222' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-white/30 text-xs">terminal</span>
            </div>
            <div className="p-6 text-xs leading-7 font-mono">
              <div className="text-white/30">$ curl -X POST https://api.codeitup.dev/execute \</div>
              <div className="text-white/30 pl-4">-H &quot;Content-Type: application/json&quot; \</div>
              <div className="text-white/30 pl-4">{`-d '{"source_code": "print(42)", "language_id": 71}'`}</div>
              <div className="mt-2 text-white/20">{'{'}</div>
              <div className="pl-4"><span className="text-[#82aaff]">&quot;stdout&quot;</span><span className="text-white/40">: </span><span style={{ color: 'var(--accent)' }}>&quot;42\n&quot;</span><span className="text-white/40">,</span></div>
              <div className="pl-4"><span className="text-[#82aaff]">&quot;time&quot;</span><span className="text-white/40">: </span><span className="text-[#f78c6c]">&quot;0.045&quot;</span><span className="text-white/40">,</span></div>
              <div className="pl-4"><span className="text-[#82aaff]">&quot;status&quot;</span><span className="text-white/40">: {'{'} </span><span className="text-[#82aaff]">&quot;description&quot;</span><span className="text-white/40">: </span><span style={{ color: 'var(--accent)' }}>&quot;Accepted&quot;</span><span className="text-white/40"> {'}'}</span></div>
              <div className="text-white/20">{'}'}</div>
              <div className="mt-4 flex items-center gap-1 text-white/30">
                <span>&gt;</span><span className="cursor ml-1" style={{ color: 'var(--accent)' }}>█</span>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="relative z-10 border-b border-white/10" id="contact">
        <div className="max-w-7xl mx-auto px-16 py-24 text-center">
          <FadeIn>
          <h2 className="text-5xl font-bold mb-4 tracking-tight uppercase">Contact</h2>
          <div className="w-16 h-px mx-auto mb-8" style={{ background: 'var(--accent)' }} />
          <p className="text-zinc-400 text-sm mb-16 max-w-lg mx-auto leading-relaxed">
            Have a question about CodeItUp? Want to discuss the project? We&apos;re here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { icon: '✉', title: 'Email Support',      desc: 'Send your questions and get back to you within 24 hours.',      cta: '✉ Send Email',    href: 'mailto:sthitajoshi@gmail.com' },
              { icon: '💬', title: 'Schedule a Meeting', desc: 'Book a call to discuss the project and how CodeItUp can help.', cta: '💬 Book a Call →', href: '#' },
              { icon: '👥', title: 'Community',          desc: 'Join the GitHub community for peer support and discussions.',   cta: '👥 GitHub Issues', href: 'https://github.com' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center px-10 py-12">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-xl mb-6">{item.icon}</div>
                <h3 className="font-bold text-base mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{item.desc}</p>
                <Link href={item.href}
                  className="w-full text-sm py-3 font-bold transition-colors"
                  style={{ background: 'var(--accent)', color: '#0e0e0e' }}>
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 border-b border-white/10" id="faq">
        <div className="max-w-7xl mx-auto px-16 py-24">
          <FadeIn>
          <h2 className="text-5xl font-bold mb-4 tracking-tight text-center uppercase">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-px mx-auto mb-6" style={{ background: 'var(--accent)' }} />
          <p className="text-center text-zinc-400 text-sm mb-16 max-w-xl mx-auto">
            Everything you need to know about CodeItUp and how it can help power your coding workflow
          </p>
          <div className="max-w-4xl mx-auto border-t border-white/10">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-white/10">
                <button
                  className="w-full flex items-center justify-between px-4 py-5 text-left text-sm font-medium hover:text-white text-white/70 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="ml-4 text-base shrink-0" style={{ color: 'var(--accent)' }}>{openFaq === i ? '∧' : '∨'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-5 text-sm text-zinc-400 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 border-b border-white/10" style={{ background: '#111' }}>
        <div className="max-w-7xl mx-auto px-16 py-32 text-center">
          <FadeIn>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Join the future of<br />
            <span style={{ color: 'var(--accent)' }}>building</span>
          </h2>
          <p className="text-zinc-400 text-base mb-12 max-w-md mx-auto leading-relaxed">
            No installation. No configuration. Just open your browser and write code. Free forever.
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 text-base font-bold px-10 py-4 rounded-md transition-colors"
            style={{ background: 'var(--accent)', color: '#0e0e0e' }}>
            Start for free
          </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="font-bold text-xl tracking-tight mb-4">CODEITUP</div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                The open source cloud IDE powering code execution in the browser. Robust, fast, and free for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">Products</h4>
              <ul className="space-y-3">
                {['CodeItUp IDE', 'Code Execution API', 'Project Manager'].map(l => (
                  <li key={l}><Link href="/auth/register" className="text-zinc-500 hover:text-white text-xs transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">Resources</h4>
              <ul className="space-y-3">
                {[{ label: 'GitHub', href: 'https://github.com' }, { label: 'Documentation', href: '#' }, { label: 'Changelog', href: '#' }, { label: 'Judge0 Docs', href: 'https://judge0.com' }].map(l => (
                  <li key={l.label}><Link href={l.href} className="text-zinc-500 hover:text-white text-xs transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                {[{ label: 'Contact us', href: '#contact' }, { label: 'FAQ', href: '#faq' }, { label: 'Sign in', href: '/auth/login' }, { label: 'Get Started', href: '/auth/register' }].map(l => (
                  <li key={l.label}><Link href={l.href} className="text-zinc-500 hover:text-white text-xs transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-zinc-600 text-xs mb-1">© {new Date().getFullYear()} CodeItUp · Open Source · Free Forever</p>
            <p className="text-zinc-700 text-xs">Built with Next.js · Supabase · Monaco Editor · Judge0</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
