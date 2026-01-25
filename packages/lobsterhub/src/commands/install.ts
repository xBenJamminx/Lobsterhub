import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { fetchWorkflow } from '../api.js'

interface InstallOptions {
  dir: string
}

export async function install(slug: string, options: InstallOptions): Promise<void> {
  const dir = options.dir.replace('~', os.homedir())

  console.log(`Fetching workflow: ${slug}...`)

  try {
    const workflow = await fetchWorkflow(slug)

    if (!workflow) {
      console.error(`Error: Workflow "${slug}" not found`)
      process.exit(1)
    }

    // Ensure directory exists
    fs.mkdirSync(dir, { recursive: true })

    // Write the workflow YAML file
    const filePath = path.join(dir, `${slug}.yaml`)
    fs.writeFileSync(filePath, workflow.yaml, 'utf-8')

    console.log(`\nInstalled: ${workflow.name}`)
    console.log(`Location: ${filePath}`)
    console.log(`\nRequired skills:`)
    workflow.requiredSkills.forEach((skill: string) => {
      console.log(`  - ${skill}`)
    })
    console.log(`\nMake sure you have all required skills installed from ClawdHub.`)
    console.log(`Run: npx clawdhub install <skill-name>`)
  } catch (error) {
    console.error(`Error installing workflow: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }
}
