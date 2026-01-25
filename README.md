# LobsterHub

A community marketplace for [Lobster](https://docs.clawd.bot/tools/lobster) workflows. Browse, share, and install automation pipelines for [Clawdbot](https://clawd.bot).

## What is Lobster?

Lobster is Clawdbot's workflow shell that chains skills into powerful automation pipelines. Think of it as "Shortcuts for your terminal" - composable automations that connect multiple tools together.

## Features

- **Browse** - Grid of workflow cards with name, description, author, and required skills
- **Search** - Filter by name, skill dependencies, or category
- **Detail Pages** - Full YAML preview with syntax highlighting, install command, and skill links
- **Submit** - Form to add new workflows to the community hub
- **Install** - One-liner: `npx lobsterhub install <workflow-slug>`

## Tech Stack

- **Frontend**: TanStack Start (React meta-framework)
- **Backend**: Convex (database, real-time sync, HTTP API)
- **Styling**: Tailwind CSS
- **Deploy**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/clawdbot/lobsterhub.git
cd lobsterhub

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Convex deployment URL

# Start Convex dev server (in a separate terminal)
npx convex dev

# Start the development server
npm run dev
```

### Seeding Data

After starting the Convex dev server, seed the database with example workflows:

```bash
npx convex run seed:seedData
```

## CLI Usage

Install workflows directly from the command line:

```bash
# Install a workflow
npx lobsterhub install morning-briefing

# List installed workflows
npx lobsterhub list

# Search for workflows
npx lobsterhub search "email automation"
```

Workflows are installed to `~/.clawdbot/lobster/workflows/` by default.

## Workflow Format

Lobster workflows are YAML files that define a pipeline of steps:

```yaml
name: morning-briefing
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

  - id: summarize
    command: llm-task --prompt "Create a morning briefing summary"
    stdin: $calendar.stdout, $email.stdout
    description: AI summarizes all inputs

  - id: send
    command: clawd.invoke --tool message --action send --channel $args.channel
    stdin: $summarize.stdout
    description: Send briefing to user
```

## Project Structure

```
lobsterhub/
├── src/
│   ├── routes/           # TanStack Start file-based routing
│   │   ├── __root.tsx    # Root layout
│   │   ├── index.tsx     # Homepage
│   │   ├── workflow.$slug.tsx  # Workflow detail page
│   │   ├── submit.tsx    # Submit form
│   │   └── category.$category.tsx  # Category filter
│   ├── convex/
│   │   └── client.ts     # Convex client setup
│   └── styles.css        # Global styles (Tailwind)
├── convex/
│   ├── schema.ts         # Database schema
│   ├── workflows.ts      # Queries and mutations
│   ├── seed.ts           # Seed data
│   └── http.ts           # HTTP API routes
├── packages/
│   └── lobsterhub/       # CLI package
│       └── src/
│           ├── cli.ts
│           ├── api.ts
│           └── commands/
└── package.json
```

## API Endpoints

The HTTP API is available for CLI and external integrations:

- `GET /api/workflows` - List all workflows
- `GET /api/workflows?category=productivity` - Filter by category
- `GET /api/workflows/:slug` - Get workflow by slug (increments downloads)
- `GET /api/search?q=email` - Search workflows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Related Projects

- [ClawdHub](https://clawdhub.com) - Skills marketplace for Clawdbot
- [Clawdbot](https://clawd.bot) - The AI-powered automation platform
- [Lobster Docs](https://docs.clawd.bot/tools/lobster) - Workflow shell documentation

## License

MIT
