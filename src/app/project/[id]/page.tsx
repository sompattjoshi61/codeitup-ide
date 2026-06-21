import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CodeEditor from '@/components/editor/CodeEditor'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!project) notFound()

  const { data: files } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', id)
    .order('name')

  return <CodeEditor project={project} files={files || []} user={user} />
}
