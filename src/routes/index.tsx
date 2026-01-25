import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const navigate = useNavigate()

  const featuredWorkflows = useQuery(api.workflows.list, { featured: true, limit: 6 })
  const allWorkflows = useQuery(api.workflows.list, {
    limit: 20,
    category: selectedCategory ?? undefined,
  })
  const searchResults = useQuery(
    api.workflows.search,
    searchQuery.length > 0 ? { query: searchQuery } : 'skip'
  )
  const categories = useQuery(api.workflows.getCategories, {})

  const displayWorkflows = searchQuery.length > 0 ? searchResults : allWorkflows

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Lobster Workflows</h1>
        <p className="hero-subtitle">
          Discover and share automation pipelines for Clawdbot's workflow shell.
          Chain skills together to build powerful automations.
        </p>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      {!searchQuery && !selectedCategory && featuredWorkflows && featuredWorkflows.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Featured Workflows</h2>
          </div>
          <div className="workflow-grid">
            {featuredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow._id} workflow={workflow} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Workflows / Search Results */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            {searchQuery
              ? `Search Results`
              : selectedCategory
                ? `${categories?.find((c) => c.id === selectedCategory)?.name} Workflows`
                : 'All Workflows'}
          </h2>
        </div>
        {displayWorkflows === undefined ? (
          <div className="loading">Loading workflows...</div>
        ) : displayWorkflows.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No workflows found</p>
            <p>Try a different search or browse all categories.</p>
          </div>
        ) : (
          <div className="workflow-grid">
            {displayWorkflows.map((workflow) => (
              <WorkflowCard key={workflow._id} workflow={workflow} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

interface WorkflowCardProps {
  workflow: {
    _id: string
    slug: string
    name: string
    description: string
    author: string
    category: string
    downloads: number
    requiredSkills: string[]
  }
  featured?: boolean
}

function WorkflowCard({ workflow, featured }: WorkflowCardProps) {
  return (
    <Link to={`/workflow/${workflow.slug}`} className="card">
      <div className="card-header">
        <h3 className="card-title">{workflow.name}</h3>
        {featured && <span className="card-badge">Featured</span>}
      </div>
      <p className="card-description">{workflow.description}</p>
      <div className="tags">
        {workflow.requiredSkills.slice(0, 3).map((skill) => (
          <span key={skill} className="tag">{skill}</span>
        ))}
        {workflow.requiredSkills.length > 3 && (
          <span className="tag">+{workflow.requiredSkills.length - 3}</span>
        )}
      </div>
      <div className="card-footer">
        <span className="card-author">by {workflow.author}</span>
        <span className="card-stats">⬇ {workflow.downloads}</span>
      </div>
    </Link>
  )
}
