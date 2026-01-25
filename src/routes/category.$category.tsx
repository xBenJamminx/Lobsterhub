import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/category/$category')({
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useParams()
  const workflows = useQuery(api.workflows.list, { category, limit: 50 })
  const categories = useQuery(api.workflows.getCategories, {})

  const categoryInfo = categories?.find((c) => c.id === category)

  return (
    <div style={{ padding: '2rem 0' }}>
      <Link to="/" className="back-link">
        ← Back to all workflows
      </Link>

      <header style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '2rem' }}>
          {categoryInfo?.icon} {categoryInfo?.name || category} Workflows
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: '0.5rem' }}>
          {workflows?.length || 0} workflow{workflows?.length !== 1 ? 's' : ''} in this category
        </p>
      </header>

      {workflows === undefined ? (
        <div className="loading">Loading workflows...</div>
      ) : workflows.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No workflows yet</p>
          <p>Be the first to submit a workflow in this category!</p>
          <Link to="/submit" className="submit-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Submit Workflow
          </Link>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <Link key={workflow._id} to={`/workflow/${workflow.slug}`} className="card">
              <div className="card-header">
                <h3 className="card-title">{workflow.name}</h3>
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
          ))}
        </div>
      )}
    </div>
  )
}
