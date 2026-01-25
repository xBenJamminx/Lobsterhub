import { searchWorkflows } from '../api.js'

interface SearchOptions {
  limit: string
}

export async function search(query: string, options: SearchOptions): Promise<void> {
  const limit = parseInt(options.limit, 10)

  console.log(`Searching for "${query}"...\n`)

  try {
    const workflows = await searchWorkflows(query)
    const results = workflows.slice(0, limit)

    if (results.length === 0) {
      console.log('No workflows found.')
      console.log(`\nTry browsing all workflows at: https://lobsterhub.com`)
      return
    }

    console.log(`Found ${results.length} workflow${results.length !== 1 ? 's' : ''}:\n`)

    for (const workflow of results) {
      console.log(`  ${workflow.name}`)
      console.log(`    ${workflow.description}`)
      console.log(`    Slug: ${workflow.slug}`)
      console.log(`    Author: ${workflow.author}`)
      console.log(`    Category: ${workflow.category}`)
      console.log(`    Downloads: ${workflow.downloads}`)
      console.log(`    Install: npx lobsterhub install ${workflow.slug}`)
      console.log()
    }
  } catch (error) {
    console.error(`Error searching: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }
}
