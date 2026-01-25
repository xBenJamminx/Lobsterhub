import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'

interface ListOptions {
  dir: string
}

export async function list(options: ListOptions): Promise<void> {
  const dir = options.dir.replace('~', os.homedir())

  if (!fs.existsSync(dir)) {
    console.log('No workflows installed yet.')
    console.log(`\nInstall your first workflow:`)
    console.log(`  npx lobsterhub install <workflow-slug>`)
    return
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))

  if (files.length === 0) {
    console.log('No workflows installed yet.')
    console.log(`\nInstall your first workflow:`)
    console.log(`  npx lobsterhub install <workflow-slug>`)
    return
  }

  console.log('Installed workflows:\n')

  for (const file of files) {
    const slug = path.basename(file, path.extname(file))
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Try to extract name from YAML
    const nameMatch = content.match(/^name:\s*(.+)$/m)
    const name = nameMatch ? nameMatch[1].trim() : slug

    console.log(`  ${name}`)
    console.log(`    Slug: ${slug}`)
    console.log(`    File: ${filePath}`)
    console.log(`    Modified: ${stats.mtime.toLocaleDateString()}`)
    console.log()
  }

  console.log(`Total: ${files.length} workflow${files.length !== 1 ? 's' : ''}`)
}
