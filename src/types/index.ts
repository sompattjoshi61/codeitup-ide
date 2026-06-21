export interface Project {
  id: string
  name: string
  description?: string
  language: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  name: string
  content: string
  created_at: string
  updated_at: string
}

export type Language = {
  id: number
  name: string
  extension: string
  monacoLang: string
  template: string
}
