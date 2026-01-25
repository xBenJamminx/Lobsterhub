import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { getWorkflowBySlug, incrementDownloads } from '../lib/api'
import type { Workflow } from '../lib/supabase'

export function WorkflowPage() {
  const { slug } = useParams<{ slug: string }>()
  const [workflow, setWorkflow] = useState<Workflow | null | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  const [yamlCopied, setYamlCopied] = useState(false)

  useEffect(() => {
    if (slug) {
      getWorkflowBySlug(slug).then(setWorkflow)
    }
  }, [slug])

  if (workflow === undefined) {
    return <div className="loading">Loading workflow...</div>
  }

  if (workflow === null) {
    return (
      <div className="detail-page">
        <Link to="/" className="back-link">
          ← Back to workflows
        </Link>
        <div className="empty-state">
          <p className="empty-state-title">Workflow not found</p>
          <p>The workflow "{slug}" doesn't exist.</p>
        </div>
      </div>
    )
  }

  const installCommand = `npx lobsterhub install ${workflow.slug}`

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // Track as a download intent
    incrementDownloads(workflow.slug)
  }

  const copyYaml = async () => {
    await navigator.clipboard.writeText(workflow.yaml)
    setYamlCopied(true)
    setTimeout(() => setYamlCopied(false), 2000)
  }

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        ← Back to workflows
      </Link>

      {/* Header */}
      <header className="detail-header">
        <h1 className="detail-title">{workflow.name}</h1>
        <div className="detail-meta">
          <span>by {workflow.author}</span>
          <span>•</span>
          <span>{workflow.downloads} downloads</span>
          <span>•</span>
          <span>{workflow.category}</span>
        </div>
        <p className="detail-description">
          {workflow.long_description || workflow.description}
        </p>
      </header>

      {/* Install Command */}
      <div className="install-box">
        <p className="install-title">Install this workflow</p>
        <div className="install-command">
          <code>{installCommand}</code>
          <button className="copy-btn" onClick={copyInstallCommand}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Required Skills */}
      <section className="skills-section">
        <h2 className="skills-title">Required Skills</h2>
        <div className="skills-list">
          {workflow.required_skills.map((skill) => (
            <a
              key={skill}
              href={`https://clawdhub.com/skill/${skill}`}
              target="_blank"
              rel="noopener noreferrer"
              className="skill-link"
            >
              {skill}
            </a>
          ))}
        </div>
      </section>

      {/* Tags */}
      {workflow.tags.length > 0 && (
        <section className="skills-section">
          <h2 className="skills-title">Tags</h2>
          <div className="tags">
            {workflow.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </section>
      )}

      {/* YAML Preview */}
      <section className="yaml-section">
        <div className="yaml-header">
          <h2 className="yaml-title">Workflow Definition</h2>
          <button className="copy-btn" onClick={copyYaml}>
            {yamlCopied ? 'Copied!' : 'Copy YAML'}
          </button>
        </div>
        <div className="yaml-preview">
          <Highlight
            theme={themes.nightOwl}
            code={workflow.yaml}
            language="yaml"
          >
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre style={{ ...style, background: 'transparent' }}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </section>
    </div>
  )
}
