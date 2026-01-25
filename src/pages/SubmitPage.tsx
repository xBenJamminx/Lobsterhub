import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { createWorkflow, categories } from '../lib/api'

export function SubmitPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    author: '',
    author_url: '',
    yaml: '',
    required_skills: '',
    category: 'other' as const,
    tags: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Parse skills and tags from comma-separated strings
      const required_skills = formData.required_skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      await createWorkflow({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        long_description: formData.long_description || null,
        author: formData.author,
        author_url: formData.author_url || null,
        yaml: formData.yaml,
        required_skills,
        category: formData.category,
        tags,
      })

      navigate(`/workflow/${formData.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit workflow')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <h1 className="form-title">Submit a Workflow</h1>
      <p className="form-subtitle">
        Share your Lobster workflow with the community. All workflows are reviewed before being published.
      </p>

      {error && (
        <div style={{ color: 'var(--accent)', marginBottom: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Workflow Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Morning Briefing"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="slug">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            className="form-input"
            placeholder="morning-briefing"
            value={formData.slug}
            onChange={handleChange}
            required
          />
          <p className="form-hint">URL-friendly identifier. Auto-generated from name.</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Short Description *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
            placeholder="Get a daily summary of your calendar, emails, and tasks"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="long_description">
            Long Description
          </label>
          <textarea
            id="long_description"
            name="long_description"
            className="form-textarea"
            placeholder="Detailed description of what this workflow does..."
            value={formData.long_description}
            onChange={handleChange}
            rows={4}
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="author">
            Author Name *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-input"
            placeholder="Your name or handle"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="author_url">
            Author URL
          </label>
          <input
            type="url"
            id="author_url"
            name="author_url"
            className="form-input"
            placeholder="https://github.com/yourname"
            value={formData.author_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="yaml">
            Workflow YAML *
          </label>
          <textarea
            id="yaml"
            name="yaml"
            className="form-textarea"
            placeholder={`name: my-workflow
steps:
  - id: step1
    command: my-skill.action`}
            value={formData.yaml}
            onChange={handleChange}
            rows={15}
            required
          />
          <p className="form-hint">
            The complete Lobster workflow definition.{' '}
            <a href="https://docs.clawd.bot/tools/lobster" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              View format docs
            </a>
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="required_skills">
            Required Skills *
          </label>
          <input
            type="text"
            id="required_skills"
            name="required_skills"
            className="form-input"
            placeholder="gog.gmail, gog.gcal, llm-task"
            value={formData.required_skills}
            onChange={handleChange}
            required
          />
          <p className="form-hint">Comma-separated list of skill slugs from ClawdHub</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tags">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-input"
            placeholder="email, automation, productivity"
            value={formData.tags}
            onChange={handleChange}
          />
          <p className="form-hint">Comma-separated tags to help users find your workflow</p>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Workflow'}
        </button>
      </form>
    </div>
  )
}
