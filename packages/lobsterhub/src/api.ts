const API_BASE = process.env.LOBSTERHUB_API_URL || 'https://lobsterhub.convex.site'

export interface Workflow {
  _id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  author: string
  authorUrl?: string
  yaml: string
  requiredSkills: string[]
  category: string
  tags: string[]
  downloads: number
  createdAt: number
}

export async function fetchWorkflow(slug: string): Promise<Workflow | null> {
  const response = await fetch(`${API_BASE}/api/workflows/${slug}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch workflow: ${response.statusText}`)
  }

  return response.json()
}

export async function searchWorkflows(query: string): Promise<Workflow[]> {
  const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`)

  if (!response.ok) {
    throw new Error(`Failed to search workflows: ${response.statusText}`)
  }

  return response.json()
}

export async function listWorkflows(options?: {
  category?: string
  limit?: number
}): Promise<Workflow[]> {
  const params = new URLSearchParams()
  if (options?.category) params.set('category', options.category)
  if (options?.limit) params.set('limit', options.limit.toString())

  const url = `${API_BASE}/api/workflows${params.toString() ? `?${params}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to list workflows: ${response.statusText}`)
  }

  return response.json()
}
