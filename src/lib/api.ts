import { supabase, type Workflow, type WorkflowInsert } from './supabase'

export const categories = [
  { id: 'productivity', name: 'Productivity', icon: '📊' },
  { id: 'communication', name: 'Communication', icon: '💬' },
  { id: 'automation', name: 'Automation', icon: '⚡' },
  { id: 'devtools', name: 'DevTools', icon: '🛠️' },
  { id: 'other', name: 'Other', icon: '📦' },
] as const

export async function getWorkflows(options?: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<Workflow[]> {
  let query = supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured) {
    query = query.eq('featured', true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching workflows:', error)
    return []
  }

  return data || []
}

export async function getWorkflowBySlug(slug: string): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching workflow:', error)
    return null
  }

  return data
}

export async function searchWorkflows(query: string): Promise<Workflow[]> {
  if (!query.trim()) {
    return getWorkflows()
  }

  // Use full-text search
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .textSearch('fts', query, { type: 'websearch' })
    .order('downloads', { ascending: false })

  if (error) {
    console.error('Error searching workflows:', error)
    // Fallback to simple ILIKE search
    const { data: fallbackData } = await supabase
      .from('workflows')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('downloads', { ascending: false })

    return fallbackData || []
  }

  return data || []
}

export async function createWorkflow(workflow: WorkflowInsert): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .insert(workflow)
    .select()
    .single()

  if (error) {
    console.error('Error creating workflow:', error)
    throw new Error(error.message)
  }

  return data
}

export async function incrementDownloads(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_downloads', {
    workflow_slug: slug,
  })

  if (error) {
    console.error('Error incrementing downloads:', error)
  }
}
