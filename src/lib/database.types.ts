export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workflows: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          long_description: string | null
          author: string
          author_url: string | null
          yaml: string
          required_skills: string[]
          category: 'productivity' | 'communication' | 'automation' | 'devtools' | 'other'
          tags: string[]
          downloads: number
          featured: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description: string
          long_description?: string | null
          author: string
          author_url?: string | null
          yaml: string
          required_skills?: string[]
          category: 'productivity' | 'communication' | 'automation' | 'devtools' | 'other'
          tags?: string[]
          downloads?: number
          featured?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          long_description?: string | null
          author?: string
          author_url?: string | null
          yaml?: string
          required_skills?: string[]
          category?: 'productivity' | 'communication' | 'automation' | 'devtools' | 'other'
          tags?: string[]
          downloads?: number
          featured?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      increment_downloads: {
        Args: { workflow_slug: string }
        Returns: void
      }
    }
  }
}
