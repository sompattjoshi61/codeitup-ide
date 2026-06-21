import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { source_code, language_id, stdin } = await req.json()

  try {
    const JUDGE0_URL = 'https://ce.judge0.com'

    // Submit the code
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code, language_id, stdin: stdin || '' }),
    })

    if (!submitRes.ok) {
      const text = await submitRes.text()
      return NextResponse.json({ error: `Judge0 error: ${text}` }, { status: 500 })
    }

    const { token } = await submitRes.json()

    // Poll for result
    let result = null
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1000))
      const getRes = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`)
      result = await getRes.json()
      // status 1 = In Queue, 2 = Processing
      if (result.status?.id > 2) break
    }

    return NextResponse.json({
      stdout: result?.stdout || '',
      stderr: result?.stderr || '',
      compile_output: result?.compile_output || '',
      status: result?.status?.description || 'Unknown',
      time: result?.time,
      memory: result?.memory,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
