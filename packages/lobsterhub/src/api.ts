// Supabase REST API
const SUPABASE_URL = process.env.LOBSTERHUB_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = process.env.LOBSTERHUB_SUPABASE_ANON_KEY || ''

export interface Workflow {
  id: string
  slug: string
  name: string
  description: string
  long_description?: string
  author: string
  author_url?: string
  yaml: string
  required_skills: string[]
  category: string
  tags: string[]
  downloads: number
  created_at: string
}

function getHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function fetchWorkflow(slug: string): Promise<Workflow | null> {
  const url = `${SUPABASE_URL}/rest/v1/workflows?slug=eq.${encodeURIComponent(slug)}&select=*`

  const response = await fetch(url, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch workflow: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.length === 0) {
    return null
  }

  // Increment downloads via RPC
  await incrementDownloads(slug)

  return data[0]
}

export async function searchWorkflows(query: string): Promise<Workflow[]> {
  // Use full-text search or fallback to ilike
  const url = `${SUPABASE_URL}/rest/v1/workflows?or=(name.ilike.*${encodeURIComponent(query)}*,description.ilike.*${encodeURIComponent(query)}*)&select=*&order=downloads.desc`

  const response = await fetch(url, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to search workflows: ${response.statusText}`)
  }

  return response.json()
}

export async function listWorkflows(options?: {
  category?: string
  limit?: number
}): Promise<Workflow[]> {
  let url = `${SUPABASE_URL}/rest/v1/workflows?select=*&order=created_at.desc`

  if (options?.category) {
    url += `&category=eq.${encodeURIComponent(options.category)}`
  }

  if (options?.limit) {
    url += `&limit=${options.limit}`
  }

  const response = await fetch(url, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to list workflows: ${response.statusText}`)
  }

  return response.json()
}

async function incrementDownloads(slug: string): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/rpc/increment_downloads`

  try {
    await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ workflow_slug: slug }),
    })
  } catch {
    // Silently fail - download tracking is not critical
  }
}
