import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { execSync } from 'node:child_process'
import { fetchWorkflow } from '../api.js'

interface InstallOptions {
  dir: string
  skipSkills: boolean
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

    // Install required skills
    if (workflow.required_skills.length > 0 && !options.skipSkills) {
      console.log(`\nInstalling ${workflow.required_skills.length} required skill(s)...`)

      for (const skill of workflow.required_skills) {
        console.log(`  Installing ${skill}...`)
        try {
          execSync(`npx clawdhub install ${skill}`, {
            stdio: 'inherit',
            timeout: 60000
          })
        } catch {
          console.warn(`  Warning: Could not install skill "${skill}" - you may need to install it manually`)
        }
      }

      console.log(`\nDone! Workflow and skills installed.`)
    } else if (workflow.required_skills.length > 0) {
      console.log(`\nRequired skills (skipped):`)
      workflow.required_skills.forEach((skill: string) => {
        console.log(`  - ${skill}`)
      })
      console.log(`\nRun: npx clawdhub install <skill-name>`)
    } else {
      console.log(`\nDone! No additional skills required.`)
    }
  } catch (error) {
    console.error(`Error installing workflow: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }
}
