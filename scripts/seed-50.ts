import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xxdmbzlhnpgllrzclkpy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZG1iemxobnBnbGxyemNsa3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDIxNjIsImV4cCI6MjA4NDkxODE2Mn0.sVK4wmeB5fv9k4wo--61PCl0K-mfsOjScTerYCC7fJw'
);

const workflows = [
  // Productivity (1-15)
  {
    slug: 'today-reminders',
    name: "Today's Reminders",
    description: 'List all reminders due today from Apple Reminders.',
    long_description: 'A simple workflow that fetches and displays all your reminders due today using the remindctl CLI.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: today-reminders
description: List all reminders due today

steps:
  - id: fetch
    command: remindctl today --json
    description: Get today's reminders`,
    required_skills: [],
    category: 'productivity',
    tags: ['reminders', 'apple', 'today', 'tasks'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'overdue-tasks',
    name: 'Overdue Tasks',
    description: 'List all overdue tasks from Todoist.',
    long_description: "Check what tasks you've missed. Fetches all overdue items from your Todoist account.",
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: overdue-tasks
description: List overdue Todoist tasks

steps:
  - id: fetch
    command: todoist-cli list --filter overdue
    description: Get overdue tasks`,
    required_skills: [],
    category: 'productivity',
    tags: ['todoist', 'tasks', 'overdue', 'productivity'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'week-ahead',
    name: 'Week Ahead',
    description: 'View all reminders for the upcoming week.',
    long_description: 'Plan your week by seeing all reminders due in the next 7 days.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: week-ahead
description: View reminders for the week

steps:
  - id: fetch
    command: remindctl week --json
    description: Get this week's reminders`,
    required_skills: [],
    category: 'productivity',
    tags: ['reminders', 'apple', 'week', 'planning'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'list-notes',
    name: 'List Notes',
    description: 'List all notes from Apple Notes.',
    long_description: 'Browse your Apple Notes from the command line. Returns a list of all notes with their titles.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: list-notes
description: List all Apple Notes

steps:
  - id: list
    command: memo list
    description: List all notes`,
    required_skills: [],
    category: 'productivity',
    tags: ['notes', 'apple', 'list', 'memo'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'priority-tasks',
    name: 'Priority Tasks',
    description: 'List all high priority (P1) tasks from Todoist.',
    long_description: 'Focus on what matters. Fetches only your highest priority tasks.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: priority-tasks
description: List P1 priority tasks

steps:
  - id: fetch
    command: todoist-cli list --filter p1
    description: Get priority 1 tasks`,
    required_skills: [],
    category: 'productivity',
    tags: ['todoist', 'tasks', 'priority', 'focus'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'tomorrow-reminders',
    name: "Tomorrow's Reminders",
    description: "See what's coming up tomorrow.",
    long_description: "Preview tomorrow's reminders so you can prepare ahead.",
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: tomorrow-reminders
description: List tomorrow's reminders

steps:
  - id: fetch
    command: remindctl tomorrow --json
    description: Get tomorrow's reminders`,
    required_skills: [],
    category: 'productivity',
    tags: ['reminders', 'apple', 'tomorrow', 'planning'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'obsidian-daily',
    name: 'Obsidian Daily Note',
    description: "Create or open today's daily note in Obsidian.",
    long_description: 'Quickly access your daily note for journaling and task tracking.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: obsidian-daily
description: Open today's daily note

steps:
  - id: open
    command: obsidian-daily today
    description: Open or create daily note`,
    required_skills: [],
    category: 'productivity',
    tags: ['obsidian', 'notes', 'daily', 'journal'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'search-notes',
    name: 'Search Notes',
    description: 'Search through your Apple Notes.',
    long_description: 'Find notes by keyword using fuzzy search.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: search-notes
description: Search Apple Notes
args:
  query:
    required: true
    description: Search term

steps:
  - id: search
    command: memo list --search "$args.query"
    description: Search notes`,
    required_skills: [],
    category: 'productivity',
    tags: ['notes', 'apple', 'search', 'find'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'complete-reminder',
    name: 'Complete Reminder',
    description: 'Mark a reminder as complete.',
    long_description: 'Quickly complete a reminder by its number.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: complete-reminder
description: Complete a reminder
args:
  id:
    required: true
    description: Reminder number

steps:
  - id: complete
    command: remindctl complete $args.id
    description: Mark reminder complete`,
    required_skills: [],
    category: 'productivity',
    tags: ['reminders', 'apple', 'complete', 'done'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'todo-today',
    name: 'Todoist Today',
    description: 'List all tasks due today from Todoist.',
    long_description: 'See everything you need to accomplish today.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: todo-today
description: List today's Todoist tasks

steps:
  - id: fetch
    command: todoist-cli list --filter today
    description: Get today's tasks`,
    required_skills: [],
    category: 'productivity',
    tags: ['todoist', 'tasks', 'today', 'daily'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'topydo-list',
    name: 'Topydo List',
    description: 'List tasks from your todo.txt file.',
    long_description: 'View your todo.txt tasks using topydo.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: topydo-list
description: List todo.txt tasks

steps:
  - id: list
    command: topydo ls
    description: List all tasks`,
    required_skills: [],
    category: 'productivity',
    tags: ['topydo', 'todo.txt', 'tasks', 'cli'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'granola-notes',
    name: 'Granola Notes',
    description: 'Access your meeting notes from Granola.',
    long_description: 'Fetch recent meeting notes and transcriptions.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: granola-notes
description: Get Granola meeting notes

steps:
  - id: fetch
    command: granola list --recent
    description: Get recent meeting notes`,
    required_skills: [],
    category: 'productivity',
    tags: ['granola', 'meetings', 'notes', 'transcription'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'linkding-bookmarks',
    name: 'Linkding Bookmarks',
    description: 'List recent bookmarks from Linkding.',
    long_description: 'Access your self-hosted bookmark manager.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: linkding-bookmarks
description: List Linkding bookmarks

steps:
  - id: list
    command: linkding list --limit 20
    description: Get recent bookmarks`,
    required_skills: [],
    category: 'productivity',
    tags: ['linkding', 'bookmarks', 'self-hosted', 'links'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'reminder-lists',
    name: 'Reminder Lists',
    description: 'Show all your reminder lists.',
    long_description: 'View all available reminder lists in Apple Reminders.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: reminder-lists
description: Show all reminder lists

steps:
  - id: lists
    command: remindctl list
    description: Get all lists`,
    required_skills: [],
    category: 'productivity',
    tags: ['reminders', 'apple', 'lists', 'organize'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'confluence-search',
    name: 'Confluence Search',
    description: 'Search Confluence for documentation.',
    long_description: 'Find pages and content in your Confluence workspace.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: confluence-search
description: Search Confluence
args:
  query:
    required: true
    description: Search term

steps:
  - id: search
    command: confluence search "$args.query"
    description: Search Confluence`,
    required_skills: [],
    category: 'productivity',
    tags: ['confluence', 'search', 'docs', 'wiki'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  // Automation (16-30)
  {
    slug: 'spotify-pause',
    name: 'Pause Spotify',
    description: 'Pause the currently playing track on Spotify.',
    long_description: 'Simple playback control for Spotify on macOS.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: spotify-pause
description: Pause Spotify playback

steps:
  - id: pause
    command: spotify pause
    description: Pause current track`,
    required_skills: [],
    category: 'automation',
    tags: ['spotify', 'music', 'playback', 'pause'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'spotify-play',
    name: 'Play Spotify',
    description: 'Resume Spotify playback.',
    long_description: 'Continue playing music on Spotify.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: spotify-play
description: Resume Spotify playback

steps:
  - id: play
    command: spotify play
    description: Resume playback`,
    required_skills: [],
    category: 'automation',
    tags: ['spotify', 'music', 'playback', 'play'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'spotify-next',
    name: 'Next Track',
    description: 'Skip to the next track on Spotify.',
    long_description: 'Move to the next song in your queue.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: spotify-next
description: Skip to next track

steps:
  - id: next
    command: spotify next
    description: Play next track`,
    required_skills: [],
    category: 'automation',
    tags: ['spotify', 'music', 'skip', 'next'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'spotify-volume-up',
    name: 'Volume Up',
    description: 'Increase Spotify volume by 10%.',
    long_description: 'Turn up the music.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: spotify-volume-up
description: Increase volume

steps:
  - id: volume
    command: spotify vol up
    description: Volume up 10%`,
    required_skills: [],
    category: 'automation',
    tags: ['spotify', 'volume', 'audio', 'louder'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'homey-scenes',
    name: 'Homey Scenes',
    description: 'List available Homey smart home scenes.',
    long_description: 'View all automation scenes in your Homey setup.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: homey-scenes
description: List Homey scenes

steps:
  - id: list
    command: homey flows list
    description: List all flows`,
    required_skills: [],
    category: 'automation',
    tags: ['homey', 'smart-home', 'scenes', 'automation'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'smartthings-devices',
    name: 'SmartThings Devices',
    description: 'List all Samsung SmartThings devices.',
    long_description: 'View your connected smart home devices.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: smartthings-devices
description: List SmartThings devices

steps:
  - id: list
    command: smartthings devices list
    description: Get all devices`,
    required_skills: [],
    category: 'automation',
    tags: ['smartthings', 'samsung', 'smart-home', 'iot'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'tailscale-status',
    name: 'Tailscale Status',
    description: 'Check your Tailscale VPN status.',
    long_description: 'View connection status and connected devices.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: tailscale-status
description: Check Tailscale status

steps:
  - id: status
    command: tailscale status
    description: Get VPN status`,
    required_skills: [],
    category: 'automation',
    tags: ['tailscale', 'vpn', 'network', 'status'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'unifi-clients',
    name: 'UniFi Clients',
    description: 'List connected clients on your UniFi network.',
    long_description: 'See all devices connected to your network.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: unifi-clients
description: List UniFi clients

steps:
  - id: list
    command: unifi clients list
    description: Get connected clients`,
    required_skills: [],
    category: 'automation',
    tags: ['unifi', 'network', 'clients', 'ubiquiti'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'gotify-notify',
    name: 'Gotify Notification',
    description: 'Send a push notification via Gotify.',
    long_description: 'Send notifications to your self-hosted Gotify server.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: gotify-notify
description: Send Gotify notification
args:
  message:
    required: true
    description: Notification message

steps:
  - id: send
    command: gotify push "$args.message"
    description: Send notification`,
    required_skills: [],
    category: 'automation',
    tags: ['gotify', 'notification', 'push', 'alert'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'coolify-status',
    name: 'Coolify Status',
    description: 'Check your Coolify deployments status.',
    long_description: 'View the status of your self-hosted applications.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: coolify-status
description: Check Coolify status

steps:
  - id: status
    command: coolify status
    description: Get deployment status`,
    required_skills: [],
    category: 'automation',
    tags: ['coolify', 'deploy', 'self-hosted', 'status'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'tesla-status',
    name: 'Tesla Status',
    description: 'Check your Tesla vehicle status.',
    long_description: 'View battery level, location, and climate status.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: tesla-status
description: Check Tesla status

steps:
  - id: status
    command: tesla status
    description: Get vehicle status`,
    required_skills: [],
    category: 'automation',
    tags: ['tesla', 'car', 'ev', 'status'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'timer-start',
    name: 'Start Timer',
    description: 'Start a countdown timer.',
    long_description: 'Set a timer for any duration.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: timer-start
description: Start a timer
args:
  minutes:
    required: true
    description: Timer duration in minutes

steps:
  - id: start
    command: timer start $args.minutes
    description: Start countdown`,
    required_skills: [],
    category: 'automation',
    tags: ['timer', 'countdown', 'time', 'pomodoro'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'qbittorrent-list',
    name: 'qBittorrent Downloads',
    description: 'List active downloads in qBittorrent.',
    long_description: 'Check the status of your torrent downloads.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: qbittorrent-list
description: List qBittorrent downloads

steps:
  - id: list
    command: qbt list
    description: Get active downloads`,
    required_skills: [],
    category: 'automation',
    tags: ['qbittorrent', 'torrent', 'downloads', 'media'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'unraid-status',
    name: 'Unraid Status',
    description: 'Check your Unraid server status.',
    long_description: 'View array status, docker containers, and VMs.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: unraid-status
description: Check Unraid status

steps:
  - id: status
    command: unraid status
    description: Get server status`,
    required_skills: [],
    category: 'automation',
    tags: ['unraid', 'server', 'nas', 'homelab'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'beeper-status',
    name: 'Beeper Status',
    description: 'Check Beeper messaging status.',
    long_description: 'View connected bridges and message status.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: beeper-status
description: Check Beeper status

steps:
  - id: status
    command: beeper status
    description: Get messaging status`,
    required_skills: [],
    category: 'automation',
    tags: ['beeper', 'messaging', 'chat', 'bridges'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  // DevTools (31-42)
  {
    slug: 'conventional-commit',
    name: 'Conventional Commit',
    description: 'Create a conventional commit message.',
    long_description: 'Generate properly formatted commit messages following the conventional commits spec.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: conventional-commit
description: Create conventional commit
args:
  type:
    required: true
    description: Commit type (feat, fix, etc)
  message:
    required: true
    description: Commit message

steps:
  - id: commit
    command: git commit -m "$args.type: $args.message"
    description: Create commit`,
    required_skills: [],
    category: 'devtools',
    tags: ['git', 'commit', 'conventional', 'semantic'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'gitload-clone',
    name: 'Gitload Clone',
    description: 'Clone a repository with gitload.',
    long_description: 'Faster repository cloning with progress tracking.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: gitload-clone
description: Clone with gitload
args:
  repo:
    required: true
    description: Repository URL

steps:
  - id: clone
    command: gitload clone $args.repo
    description: Clone repository`,
    required_skills: [],
    category: 'devtools',
    tags: ['git', 'clone', 'download', 'repository'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'codex-quota',
    name: 'Codex Quota',
    description: 'Check your OpenAI Codex usage quota.',
    long_description: 'Monitor your API usage and remaining quota.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: codex-quota
description: Check Codex quota

steps:
  - id: check
    command: codex-quota check
    description: Get quota status`,
    required_skills: [],
    category: 'devtools',
    tags: ['codex', 'openai', 'quota', 'usage'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'hn-digest',
    name: 'Hacker News Digest',
    description: 'Get a digest of top Hacker News stories.',
    long_description: 'Stay updated with the tech community.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: hn-digest
description: Get HN top stories

steps:
  - id: fetch
    command: hn-digest top --limit 10
    description: Get top stories`,
    required_skills: [],
    category: 'devtools',
    tags: ['hackernews', 'news', 'tech', 'digest'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'miniflux-unread',
    name: 'Miniflux Unread',
    description: 'List unread articles from Miniflux RSS reader.',
    long_description: 'Check your RSS feed for new articles.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: miniflux-unread
description: List unread articles

steps:
  - id: list
    command: miniflux entries --status unread --limit 20
    description: Get unread articles`,
    required_skills: [],
    category: 'devtools',
    tags: ['miniflux', 'rss', 'news', 'reader'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'excalidraw-flow',
    name: 'Excalidraw Flowchart',
    description: 'Generate a flowchart in Excalidraw format.',
    long_description: 'Create visual diagrams from text descriptions.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: excalidraw-flow
description: Create flowchart
args:
  description:
    required: true
    description: Flowchart description

steps:
  - id: generate
    command: excalidraw-flowchart generate "$args.description"
    description: Generate flowchart`,
    required_skills: [],
    category: 'devtools',
    tags: ['excalidraw', 'diagram', 'flowchart', 'visual'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'sf-symbol',
    name: 'SF Symbol Generator',
    description: 'Find and preview SF Symbols.',
    long_description: 'Search Apple SF Symbols for your app.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: sf-symbol
description: Search SF Symbols
args:
  query:
    required: true
    description: Symbol search term

steps:
  - id: search
    command: sfsymbol search "$args.query"
    description: Find symbols`,
    required_skills: [],
    category: 'devtools',
    tags: ['sfsymbols', 'apple', 'icons', 'ios'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'polymarket-odds',
    name: 'Polymarket Odds',
    description: 'Check prediction market odds on Polymarket.',
    long_description: 'View current odds for various events.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: polymarket-odds
description: Check Polymarket odds
args:
  query:
    required: true
    description: Market search term

steps:
  - id: search
    command: polymarket search "$args.query"
    description: Get market odds`,
    required_skills: [],
    category: 'devtools',
    tags: ['polymarket', 'predictions', 'odds', 'markets'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'search-x',
    name: 'Search X',
    description: 'Search posts on X (Twitter).',
    long_description: 'Find recent posts matching your query.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: search-x
description: Search X posts
args:
  query:
    required: true
    description: Search term

steps:
  - id: search
    command: search-x "$args.query" --limit 10
    description: Search posts`,
    required_skills: [],
    category: 'devtools',
    tags: ['twitter', 'x', 'search', 'social'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'prowlarr-search',
    name: 'Prowlarr Search',
    description: 'Search indexers via Prowlarr.',
    long_description: 'Find content across multiple indexers.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: prowlarr-search
description: Search Prowlarr
args:
  query:
    required: true
    description: Search term

steps:
  - id: search
    command: prowlarr search "$args.query"
    description: Search indexers`,
    required_skills: [],
    category: 'devtools',
    tags: ['prowlarr', 'indexer', 'search', 'arr'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'sabnzbd-queue',
    name: 'SABnzbd Queue',
    description: 'Check SABnzbd download queue.',
    long_description: 'View active and queued Usenet downloads.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: sabnzbd-queue
description: Check SABnzbd queue

steps:
  - id: queue
    command: sabnzbd queue
    description: Get download queue`,
    required_skills: [],
    category: 'devtools',
    tags: ['sabnzbd', 'usenet', 'downloads', 'nzb'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'xai-query',
    name: 'xAI Query',
    description: 'Query xAI Grok model.',
    long_description: 'Send a prompt to xAI and get a response.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: xai-query
description: Query xAI
args:
  prompt:
    required: true
    description: Your prompt

steps:
  - id: query
    command: xai query "$args.prompt"
    description: Get response`,
    required_skills: [],
    category: 'devtools',
    tags: ['xai', 'grok', 'ai', 'llm'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  // Communication (43-50)
  {
    slug: 'post-at',
    name: 'Scheduled Post',
    description: 'Schedule a post for later.',
    long_description: 'Queue up social media posts for future publishing.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: post-at
description: Schedule a post
args:
  message:
    required: true
    description: Post content
  time:
    required: true
    description: Schedule time

steps:
  - id: schedule
    command: post-at schedule "$args.message" --at "$args.time"
    description: Schedule post`,
    required_skills: [],
    category: 'communication',
    tags: ['social', 'schedule', 'post', 'queue'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'youtube-article',
    name: 'YouTube to Article',
    description: 'Convert a YouTube video to an article.',
    long_description: 'Generate a readable article from video content.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: youtube-article
description: Convert YouTube to article
args:
  url:
    required: true
    description: YouTube URL

steps:
  - id: convert
    command: youtube-instant-article "$args.url"
    description: Generate article`,
    required_skills: [],
    category: 'communication',
    tags: ['youtube', 'article', 'convert', 'read'],
    downloads: 0,
    featured: true,
    status: 'approved'
  },
  {
    slug: 'tailscale-serve',
    name: 'Tailscale Serve',
    description: 'Share a local service via Tailscale.',
    long_description: 'Expose a local port to your tailnet.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: tailscale-serve
description: Share via Tailscale
args:
  port:
    required: true
    description: Local port to share

steps:
  - id: serve
    command: tailscale serve $args.port
    description: Start sharing`,
    required_skills: [],
    category: 'communication',
    tags: ['tailscale', 'share', 'serve', 'network'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'endurance-coach',
    name: 'Endurance Coach',
    description: 'Get endurance training advice.',
    long_description: 'AI-powered coaching for running and cycling.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: endurance-coach
description: Get training advice
args:
  question:
    required: true
    description: Your training question

steps:
  - id: ask
    command: endurance-coach ask "$args.question"
    description: Get advice`,
    required_skills: [],
    category: 'communication',
    tags: ['fitness', 'running', 'cycling', 'coach'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'withings-weight',
    name: 'Withings Weight',
    description: 'Get your latest weight from Withings.',
    long_description: 'Fetch recent weight measurements.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: withings-weight
description: Get weight data

steps:
  - id: fetch
    command: withings weight --latest
    description: Get latest weight`,
    required_skills: [],
    category: 'communication',
    tags: ['withings', 'health', 'weight', 'fitness'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'oebb-train',
    name: 'OBB Train Search',
    description: 'Search Austrian train schedules.',
    long_description: 'Find train connections on Austrian railways.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: oebb-train
description: Search OBB trains
args:
  from:
    required: true
    description: Departure station
  to:
    required: true
    description: Arrival station

steps:
  - id: search
    command: oebb-scotty search --from "$args.from" --to "$args.to"
    description: Find connections`,
    required_skills: [],
    category: 'communication',
    tags: ['oebb', 'train', 'austria', 'travel'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'remotion-render',
    name: 'Remotion Render',
    description: 'Render a video with Remotion.',
    long_description: 'Generate videos from React components.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: remotion-render
description: Render Remotion video
args:
  composition:
    required: true
    description: Composition name

steps:
  - id: render
    command: remotion-server render $args.composition
    description: Render video`,
    required_skills: [],
    category: 'communication',
    tags: ['remotion', 'video', 'render', 'react'],
    downloads: 0,
    featured: false,
    status: 'approved'
  },
  {
    slug: 'spotify-current',
    name: 'Now Playing',
    description: 'Show the currently playing track on Spotify.',
    long_description: 'See what song is currently playing.',
    author: 'LobsterHub',
    author_url: 'https://github.com/xBenJamminx/Lobsterhub',
    yaml: `name: spotify-current
description: Show current track

steps:
  - id: current
    command: spotify-web-api current
    description: Get now playing`,
    required_skills: [],
    category: 'communication',
    tags: ['spotify', 'music', 'now-playing', 'current'],
    downloads: 0,
    featured: true,
    status: 'approved'
  }
];

async function main() {
  console.log('Deleting existing workflows...');
  const { error: deleteError } = await supabase.from('workflows').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Delete error:', deleteError);
    return;
  }

  console.log('Inserting 50 workflows...');
  const { data, error } = await supabase.from('workflows').insert(workflows).select('slug');

  if (error) {
    console.error('Insert error:', error);
    return;
  }

  console.log(`Success! Inserted ${data.length} workflows.`);
}

main();
