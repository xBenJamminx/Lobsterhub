# lobsterhub

CLI for LobsterHub - Install and manage Lobster workflows for Clawdbot.

## Installation

```bash
npm install -g lobsterhub
```

Or use directly with npx:

```bash
npx lobsterhub <command>
```

## Commands

### install

Install a workflow from LobsterHub:

```bash
npx lobsterhub install morning-briefing
```

Options:
- `-d, --dir <path>` - Installation directory (default: `~/.clawdbot/lobster/workflows`)

### list

List installed workflows:

```bash
npx lobsterhub list
```

Options:
- `-d, --dir <path>` - Workflows directory (default: `~/.clawdbot/lobster/workflows`)

### search

Search for workflows on LobsterHub:

```bash
npx lobsterhub search "email automation"
```

Options:
- `-l, --limit <number>` - Maximum number of results (default: 10)

## Configuration

Set `LOBSTERHUB_API_URL` environment variable to use a custom API endpoint:

```bash
export LOBSTERHUB_API_URL=https://your-instance.convex.site
```

## License

MIT
