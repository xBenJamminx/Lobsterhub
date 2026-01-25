import { mutation } from './_generated/server'

const seedWorkflows = [
  {
    slug: 'morning-briefing',
    name: 'Morning Briefing',
    description: 'Get a daily summary of your calendar, emails, and tasks delivered to Telegram.',
    longDescription: `Start your day with a comprehensive briefing that pulls together your calendar events,
recent emails, and pending tasks. An AI summarizes everything into actionable insights and sends it
directly to your preferred messaging channel.

Perfect for busy professionals who want to hit the ground running each morning.`,
    author: 'clawdbot',
    authorUrl: 'https://github.com/clawdbot',
    yaml: `name: morning-briefing
description: Daily summary of calendar, emails, and tasks
args:
  channel:
    default: "telegram"
    description: "Where to send the briefing"

steps:
  - id: calendar
    command: gog.gcal.today --json
    description: Fetch today's calendar events

  - id: email
    command: gog.gmail.search --query 'newer_than:1d' --json
    description: Get emails from the last 24 hours

  - id: tasks
    command: gog.todoist.today --json
    description: Get today's tasks

  - id: summarize
    command: llm-task --prompt "Create a morning briefing summary"
    stdin: $calendar.stdout, $email.stdout, $tasks.stdout
    description: AI summarizes all inputs

  - id: send
    command: clawd.invoke --tool message --action send --channel $args.channel
    stdin: $summarize.stdout
    description: Send briefing to user`,
    requiredSkills: ['gog.gcal', 'gog.gmail', 'gog.todoist', 'llm-task', 'clawd.invoke'],
    category: 'productivity' as const,
    tags: ['morning', 'briefing', 'calendar', 'email', 'tasks', 'telegram'],
    downloads: 247,
    featured: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    slug: 'inbox-triage',
    name: 'Inbox Triage',
    description: 'Automatically categorize and prioritize incoming emails with AI-powered approval gates.',
    longDescription: `Overwhelmed by email? This workflow uses AI to categorize your inbox into
actionable buckets: urgent, needs response, FYI, and spam.

For important emails, it presents you with a quick approval interface before taking any action.
Integrates with your existing labels and filters.`,
    author: 'clawdbot',
    authorUrl: 'https://github.com/clawdbot',
    yaml: `name: inbox-triage
description: AI-powered email categorization with approval gates
args:
  auto_archive:
    default: false
    description: "Auto-archive FYI emails"

steps:
  - id: fetch
    command: gog.gmail.search --query 'is:unread category:primary' --json
    description: Get unread primary emails

  - id: categorize
    command: llm-task --prompt "Categorize emails: urgent, needs_response, fyi, spam"
    stdin: $fetch.stdout
    description: AI categorizes each email

  - id: urgent
    command: clawd.invoke --tool notify --priority high
    stdin: $categorize.stdout | jq '.urgent'
    when: $categorize.stdout.urgent | length > 0
    description: Alert on urgent emails

  - id: review
    command: clawd.invoke --tool approval_gate --timeout 300
    stdin: $categorize.stdout | jq '.needs_response'
    description: Present emails needing response for approval

  - id: archive
    command: gog.gmail.archive
    stdin: $categorize.stdout | jq '.fyi'
    when: $args.auto_archive
    description: Auto-archive FYI emails if enabled`,
    requiredSkills: ['gog.gmail', 'llm-task', 'clawd.invoke'],
    category: 'productivity' as const,
    tags: ['email', 'triage', 'inbox', 'categorization', 'ai', 'approval'],
    downloads: 189,
    featured: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    slug: 'daily-standup',
    name: 'Daily Standup',
    description: 'Generate standup reports from git commits and calendar, then post to Slack.',
    longDescription: `Automate your daily standup updates by pulling context from what you actually did.

This workflow examines your git commits, completed tasks, and calendar meetings to generate
a meaningful standup update. Posts directly to your team's Slack channel.

Supports the standard "what I did, what I'm doing, blockers" format.`,
    author: 'clawdbot',
    authorUrl: 'https://github.com/clawdbot',
    yaml: `name: daily-standup
description: Auto-generate standup from git + calendar
args:
  slack_channel:
    default: "#standup"
    description: "Slack channel to post to"
  git_repos:
    default: "."
    description: "Comma-separated repo paths"

steps:
  - id: commits
    command: git.log --since yesterday --author $USER --json
    cwd: $args.git_repos
    description: Get yesterday's commits

  - id: calendar_yesterday
    command: gog.gcal.range --start yesterday --end today --json
    description: Get yesterday's meetings

  - id: calendar_today
    command: gog.gcal.today --json
    description: Get today's scheduled meetings

  - id: generate
    command: llm-task --prompt "Generate standup: yesterday, today, blockers"
    stdin: $commits.stdout, $calendar_yesterday.stdout, $calendar_today.stdout
    description: AI generates standup report

  - id: post
    command: gog.slack.post --channel $args.slack_channel
    stdin: $generate.stdout
    description: Post to Slack`,
    requiredSkills: ['git.log', 'gog.gcal', 'gog.slack', 'llm-task'],
    category: 'communication' as const,
    tags: ['standup', 'slack', 'git', 'calendar', 'team', 'daily'],
    downloads: 312,
    featured: true,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    slug: 'pr-review-reminder',
    name: 'PR Review Reminder',
    description: 'Monitor open PRs and send reminders for stale reviews.',
    longDescription: `Keep your team's PR queue moving. This workflow checks for pull requests
that have been waiting for review and sends gentle reminders to reviewers.

Configurable thresholds for when to send reminders and escalation paths for critically stale PRs.`,
    author: 'octocat',
    authorUrl: 'https://github.com/octocat',
    yaml: `name: pr-review-reminder
description: Remind reviewers about pending PRs
args:
  repo:
    required: true
    description: "GitHub repo (owner/name)"
  stale_hours:
    default: 24
    description: "Hours before PR is considered stale"
  channel:
    default: "slack"
    description: "Notification channel"

steps:
  - id: fetch_prs
    command: gh.pr.list --repo $args.repo --state open --json
    description: Get open PRs

  - id: filter_stale
    command: llm-task --prompt "Filter PRs older than $args.stale_hours hours"
    stdin: $fetch_prs.stdout
    description: Identify stale PRs

  - id: get_reviewers
    command: gh.pr.reviewers --repo $args.repo
    stdin: $filter_stale.stdout
    description: Get assigned reviewers

  - id: notify
    command: clawd.invoke --tool notify --channel $args.channel
    stdin: $get_reviewers.stdout
    when: $filter_stale.stdout | length > 0
    description: Send reminder notifications`,
    requiredSkills: ['gh.pr', 'llm-task', 'clawd.invoke'],
    category: 'devtools' as const,
    tags: ['github', 'pr', 'review', 'reminder', 'code-review'],
    downloads: 156,
    featured: false,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    slug: 'meeting-notes-sync',
    name: 'Meeting Notes Sync',
    description: 'Transcribe meetings, generate summaries, and sync to Notion.',
    longDescription: `Never miss an action item again. This workflow processes meeting recordings,
generates AI summaries with key decisions and action items, then syncs everything to your Notion workspace.

Supports automatic participant detection and task assignment.`,
    author: 'productivity-labs',
    authorUrl: 'https://github.com/productivity-labs',
    yaml: `name: meeting-notes-sync
description: Transcribe and sync meeting notes to Notion
args:
  notion_db:
    required: true
    description: "Notion database ID for meeting notes"
  audio_source:
    default: "local"
    description: "Audio source (local, zoom, meet)"

steps:
  - id: transcribe
    command: whisper.transcribe --source $args.audio_source
    description: Transcribe meeting audio

  - id: summarize
    command: llm-task --prompt "Summarize meeting: decisions, action items, participants"
    stdin: $transcribe.stdout
    description: Generate structured summary

  - id: extract_tasks
    command: llm-task --prompt "Extract action items with assignees"
    stdin: $summarize.stdout
    description: Pull out action items

  - id: sync_notion
    command: gog.notion.page.create --database $args.notion_db
    stdin: $summarize.stdout
    description: Create Notion page with notes

  - id: create_tasks
    command: gog.todoist.add
    stdin: $extract_tasks.stdout
    description: Create tasks for action items`,
    requiredSkills: ['whisper.transcribe', 'llm-task', 'gog.notion', 'gog.todoist'],
    category: 'productivity' as const,
    tags: ['meetings', 'transcription', 'notion', 'notes', 'action-items'],
    downloads: 98,
    featured: false,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
]

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query('workflows').first()
    if (existing) {
      return { message: 'Data already seeded', count: 0 }
    }

    // Insert seed workflows
    for (const workflow of seedWorkflows) {
      await ctx.db.insert('workflows', workflow)
    }

    return { message: 'Seed data inserted', count: seedWorkflows.length }
  },
})

export const clearAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing workflows
    const existing = await ctx.db.query('workflows').collect()
    for (const workflow of existing) {
      await ctx.db.delete(workflow._id)
    }

    // Insert seed workflows
    for (const workflow of seedWorkflows) {
      await ctx.db.insert('workflows', workflow)
    }

    return { message: 'Data reseeded', count: seedWorkflows.length }
  },
})
