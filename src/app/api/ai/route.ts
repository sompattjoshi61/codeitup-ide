import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages, code, language } = await req.json()

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })

  const systemPrompt = `You are an expert coding assistant embedded inside CodeItUp, a cloud IDE.
The user is currently writing ${language} code.
When they ask you to fix, improve, or generate code — respond with the code block using markdown fences.
Be concise. Focus on the code. Don't over-explain unless asked.
Current code in editor:
\`\`\`${language}
${code}
\`\`\``

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.error?.message || 'OpenAI error' }, { status: res.status })
  }

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content || ''
  return NextResponse.json({ reply })
}
