-- LobsterHub Database Schema
-- Run this in Supabase SQL Editor

-- Workflows table
CREATE TABLE workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  author TEXT NOT NULL,
  author_url TEXT,
  yaml TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('productivity', 'communication', 'automation', 'devtools', 'other')),
  tags TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for status filtering
CREATE INDEX idx_workflows_status ON workflows(status);

-- Indexes for common queries
CREATE INDEX idx_workflows_slug ON workflows(slug);
CREATE INDEX idx_workflows_category ON workflows(category);
CREATE INDEX idx_workflows_featured ON workflows(featured) WHERE featured = TRUE;
CREATE INDEX idx_workflows_downloads ON workflows(downloads DESC);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);

-- Full text search
ALTER TABLE workflows ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED;

CREATE INDEX idx_workflows_fts ON workflows USING GIN(fts);

-- Function to increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(workflow_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE workflows SET downloads = downloads + 1 WHERE slug = workflow_slug;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Anyone can read workflows
CREATE POLICY "Workflows are publicly readable" ON workflows
  FOR SELECT USING (true);

-- Only authenticated users can insert (will add auth later)
CREATE POLICY "Anyone can insert workflows for now" ON workflows
  FOR INSERT WITH CHECK (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Seed data: 50 real workflows using ClawdHub skills
INSERT INTO workflows (slug, name, description, long_description, author, author_url, yaml, required_skills, category, tags, downloads, featured) VALUES
-- Productivity (1-15)
(
  'today-reminders',
  'Today''s Reminders',
  'List all reminders due today from Apple Reminders.',
  'A simple workflow that fetches and displays all your reminders due today using the remindctl CLI.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: today-reminders\ndescription: List all reminders due today\n\nsteps:\n  - id: fetch\n    command: remindctl today --json\n    description: Get today''s reminders',
  ARRAY['steipete/apple-reminders'],
  'productivity',
  ARRAY['reminders', 'apple', 'today', 'tasks'],
  0,
  TRUE
),
(
  'overdue-tasks',
  'Overdue Tasks',
  'List all overdue tasks from Todoist.',
  'Check what tasks you''ve missed. Fetches all overdue items from your Todoist account.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: overdue-tasks\ndescription: List overdue Todoist tasks\n\nsteps:\n  - id: fetch\n    command: todoist-cli list --filter overdue\n    description: Get overdue tasks',
  ARRAY['2mawi2/todoist-task-manager'],
  'productivity',
  ARRAY['todoist', 'tasks', 'overdue', 'productivity'],
  0,
  TRUE
),
(
  'week-ahead',
  'Week Ahead',
  'View all reminders for the upcoming week.',
  'Plan your week by seeing all reminders due in the next 7 days.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: week-ahead\ndescription: View reminders for the week\n\nsteps:\n  - id: fetch\n    command: remindctl week --json\n    description: Get this week''s reminders',
  ARRAY['steipete/apple-reminders'],
  'productivity',
  ARRAY['reminders', 'apple', 'week', 'planning'],
  0,
  TRUE
),
(
  'list-notes',
  'List Notes',
  'List all notes from Apple Notes.',
  'Browse your Apple Notes from the command line. Returns a list of all notes with their titles.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: list-notes\ndescription: List all Apple Notes\n\nsteps:\n  - id: list\n    command: memo list\n    description: List all notes',
  ARRAY['steipete/apple-notes'],
  'productivity',
  ARRAY['notes', 'apple', 'list', 'memo'],
  0,
  FALSE
),
(
  'priority-tasks',
  'Priority Tasks',
  'List all high priority (P1) tasks from Todoist.',
  'Focus on what matters. Fetches only your highest priority tasks.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: priority-tasks\ndescription: List P1 priority tasks\n\nsteps:\n  - id: fetch\n    command: todoist-cli list --filter p1\n    description: Get priority 1 tasks',
  ARRAY['2mawi2/todoist-task-manager'],
  'productivity',
  ARRAY['todoist', 'tasks', 'priority', 'focus'],
  0,
  FALSE
),
(
  'tomorrow-reminders',
  'Tomorrow''s Reminders',
  'See what''s coming up tomorrow.',
  'Preview tomorrow''s reminders so you can prepare ahead.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: tomorrow-reminders\ndescription: List tomorrow''s reminders\n\nsteps:\n  - id: fetch\n    command: remindctl tomorrow --json\n    description: Get tomorrow''s reminders',
  ARRAY['steipete/apple-reminders'],
  'productivity',
  ARRAY['reminders', 'apple', 'tomorrow', 'planning'],
  0,
  FALSE
),
(
  'obsidian-daily',
  'Obsidian Daily Note',
  'Create or open today''s daily note in Obsidian.',
  'Quickly access your daily note for journaling and task tracking.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: obsidian-daily\ndescription: Open today''s daily note\n\nsteps:\n  - id: open\n    command: obsidian-daily today\n    description: Open or create daily note',
  ARRAY['bastos/obsidian-daily'],
  'productivity',
  ARRAY['obsidian', 'notes', 'daily', 'journal'],
  0,
  TRUE
),
(
  'search-notes',
  'Search Notes',
  'Search through your Apple Notes.',
  'Find notes by keyword using fuzzy search.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: search-notes\ndescription: Search Apple Notes\nargs:\n  query:\n    required: true\n    description: Search term\n\nsteps:\n  - id: search\n    command: memo list --search "$args.query"\n    description: Search notes',
  ARRAY['steipete/apple-notes'],
  'productivity',
  ARRAY['notes', 'apple', 'search', 'find'],
  0,
  FALSE
),
(
  'complete-reminder',
  'Complete Reminder',
  'Mark a reminder as complete.',
  'Quickly complete a reminder by its number.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: complete-reminder\ndescription: Complete a reminder\nargs:\n  id:\n    required: true\n    description: Reminder number\n\nsteps:\n  - id: complete\n    command: remindctl complete $args.id\n    description: Mark reminder complete',
  ARRAY['steipete/apple-reminders'],
  'productivity',
  ARRAY['reminders', 'apple', 'complete', 'done'],
  0,
  FALSE
),
(
  'todo-today',
  'Todoist Today',
  'List all tasks due today from Todoist.',
  'See everything you need to accomplish today.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: todo-today\ndescription: List today''s Todoist tasks\n\nsteps:\n  - id: fetch\n    command: todoist-cli list --filter today\n    description: Get today''s tasks',
  ARRAY['2mawi2/todoist-task-manager'],
  'productivity',
  ARRAY['todoist', 'tasks', 'today', 'daily'],
  0,
  FALSE
),
(
  'topydo-list',
  'Topydo List',
  'List tasks from your todo.txt file.',
  'View your todo.txt tasks using topydo.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: topydo-list\ndescription: List todo.txt tasks\n\nsteps:\n  - id: list\n    command: topydo ls\n    description: List all tasks',
  ARRAY['bastos/topydo'],
  'productivity',
  ARRAY['topydo', 'todo.txt', 'tasks', 'cli'],
  0,
  FALSE
),
(
  'granola-notes',
  'Granola Notes',
  'Access your meeting notes from Granola.',
  'Fetch recent meeting notes and transcriptions.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: granola-notes\ndescription: Get Granola meeting notes\n\nsteps:\n  - id: fetch\n    command: granola list --recent\n    description: Get recent meeting notes',
  ARRAY['mvanhorn/granola-notes'],
  'productivity',
  ARRAY['granola', 'meetings', 'notes', 'transcription'],
  0,
  FALSE
),
(
  'linkding-bookmarks',
  'Linkding Bookmarks',
  'List recent bookmarks from Linkding.',
  'Access your self-hosted bookmark manager.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: linkding-bookmarks\ndescription: List Linkding bookmarks\n\nsteps:\n  - id: list\n    command: linkding list --limit 20\n    description: Get recent bookmarks',
  ARRAY['jmagar/linkding'],
  'productivity',
  ARRAY['linkding', 'bookmarks', 'self-hosted', 'links'],
  0,
  FALSE
),
(
  'reminder-lists',
  'Reminder Lists',
  'Show all your reminder lists.',
  'View all available reminder lists in Apple Reminders.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: reminder-lists\ndescription: Show all reminder lists\n\nsteps:\n  - id: lists\n    command: remindctl list\n    description: Get all lists',
  ARRAY['steipete/apple-reminders'],
  'productivity',
  ARRAY['reminders', 'apple', 'lists', 'organize'],
  0,
  FALSE
),
(
  'confluence-search',
  'Confluence Search',
  'Search Confluence for documentation.',
  'Find pages and content in your Confluence workspace.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: confluence-search\ndescription: Search Confluence\nargs:\n  query:\n    required: true\n    description: Search term\n\nsteps:\n  - id: search\n    command: confluence search "$args.query"\n    description: Search Confluence',
  ARRAY['francisbrero/confluence'],
  'productivity',
  ARRAY['confluence', 'search', 'docs', 'wiki'],
  0,
  FALSE
),
-- Automation (16-30)
(
  'spotify-pause',
  'Pause Spotify',
  'Pause the currently playing track on Spotify.',
  'Simple playback control for Spotify on macOS.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: spotify-pause\ndescription: Pause Spotify playback\n\nsteps:\n  - id: pause\n    command: spotify pause\n    description: Pause current track',
  ARRAY['2mawi2/spotify'],
  'automation',
  ARRAY['spotify', 'music', 'playback', 'pause'],
  0,
  TRUE
),
(
  'spotify-play',
  'Play Spotify',
  'Resume Spotify playback.',
  'Continue playing music on Spotify.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: spotify-play\ndescription: Resume Spotify playback\n\nsteps:\n  - id: play\n    command: spotify play\n    description: Resume playback',
  ARRAY['2mawi2/spotify'],
  'automation',
  ARRAY['spotify', 'music', 'playback', 'play'],
  0,
  FALSE
),
(
  'spotify-next',
  'Next Track',
  'Skip to the next track on Spotify.',
  'Move to the next song in your queue.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: spotify-next\ndescription: Skip to next track\n\nsteps:\n  - id: next\n    command: spotify next\n    description: Play next track',
  ARRAY['2mawi2/spotify'],
  'automation',
  ARRAY['spotify', 'music', 'skip', 'next'],
  0,
  FALSE
),
(
  'spotify-volume-up',
  'Volume Up',
  'Increase Spotify volume by 10%.',
  'Turn up the music.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: spotify-volume-up\ndescription: Increase volume\n\nsteps:\n  - id: volume\n    command: spotify vol up\n    description: Volume up 10%',
  ARRAY['2mawi2/spotify'],
  'automation',
  ARRAY['spotify', 'volume', 'audio', 'louder'],
  0,
  FALSE
),
(
  'homey-scenes',
  'Homey Scenes',
  'List available Homey smart home scenes.',
  'View all automation scenes in your Homey setup.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: homey-scenes\ndescription: List Homey scenes\n\nsteps:\n  - id: list\n    command: homey flows list\n    description: List all flows',
  ARRAY['krausefx/homey-cli'],
  'automation',
  ARRAY['homey', 'smart-home', 'scenes', 'automation'],
  0,
  FALSE
),
(
  'smartthings-devices',
  'SmartThings Devices',
  'List all Samsung SmartThings devices.',
  'View your connected smart home devices.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: smartthings-devices\ndescription: List SmartThings devices\n\nsteps:\n  - id: list\n    command: smartthings devices list\n    description: Get all devices',
  ARRAY['regenrek/samsung-smartthings'],
  'automation',
  ARRAY['smartthings', 'samsung', 'smart-home', 'iot'],
  0,
  FALSE
),
(
  'tailscale-status',
  'Tailscale Status',
  'Check your Tailscale VPN status.',
  'View connection status and connected devices.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: tailscale-status\ndescription: Check Tailscale status\n\nsteps:\n  - id: status\n    command: tailscale status\n    description: Get VPN status',
  ARRAY['jmagar/tailscale'],
  'automation',
  ARRAY['tailscale', 'vpn', 'network', 'status'],
  0,
  TRUE
),
(
  'unifi-clients',
  'UniFi Clients',
  'List connected clients on your UniFi network.',
  'See all devices connected to your network.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: unifi-clients\ndescription: List UniFi clients\n\nsteps:\n  - id: list\n    command: unifi clients list\n    description: Get connected clients',
  ARRAY['jmagar/unifi'],
  'automation',
  ARRAY['unifi', 'network', 'clients', 'ubiquiti'],
  0,
  FALSE
),
(
  'gotify-notify',
  'Gotify Notification',
  'Send a push notification via Gotify.',
  'Send notifications to your self-hosted Gotify server.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: gotify-notify\ndescription: Send Gotify notification\nargs:\n  message:\n    required: true\n    description: Notification message\n\nsteps:\n  - id: send\n    command: gotify push "$args.message"\n    description: Send notification',
  ARRAY['jmagar/gotify'],
  'automation',
  ARRAY['gotify', 'notification', 'push', 'alert'],
  0,
  FALSE
),
(
  'coolify-status',
  'Coolify Status',
  'Check your Coolify deployments status.',
  'View the status of your self-hosted applications.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: coolify-status\ndescription: Check Coolify status\n\nsteps:\n  - id: status\n    command: coolify status\n    description: Get deployment status',
  ARRAY['visiongeist/coolify'],
  'automation',
  ARRAY['coolify', 'deploy', 'self-hosted', 'status'],
  0,
  FALSE
),
(
  'tesla-status',
  'Tesla Status',
  'Check your Tesla vehicle status.',
  'View battery level, location, and climate status.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: tesla-status\ndescription: Check Tesla status\n\nsteps:\n  - id: status\n    command: tesla status\n    description: Get vehicle status',
  ARRAY['mvanhorn/tesla'],
  'automation',
  ARRAY['tesla', 'car', 'ev', 'status'],
  0,
  TRUE
),
(
  'timer-start',
  'Start Timer',
  'Start a countdown timer.',
  'Set a timer for any duration.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: timer-start\ndescription: Start a timer\nargs:\n  minutes:\n    required: true\n    description: Timer duration in minutes\n\nsteps:\n  - id: start\n    command: timer start $args.minutes\n    description: Start countdown',
  ARRAY['hisxo/timer'],
  'automation',
  ARRAY['timer', 'countdown', 'time', 'pomodoro'],
  0,
  FALSE
),
(
  'qbittorrent-list',
  'qBittorrent Downloads',
  'List active downloads in qBittorrent.',
  'Check the status of your torrent downloads.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: qbittorrent-list\ndescription: List qBittorrent downloads\n\nsteps:\n  - id: list\n    command: qbt list\n    description: Get active downloads',
  ARRAY['jmagar/qbittorrent'],
  'automation',
  ARRAY['qbittorrent', 'torrent', 'downloads', 'media'],
  0,
  FALSE
),
(
  'unraid-status',
  'Unraid Status',
  'Check your Unraid server status.',
  'View array status, docker containers, and VMs.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: unraid-status\ndescription: Check Unraid status\n\nsteps:\n  - id: status\n    command: unraid status\n    description: Get server status',
  ARRAY['jmagar/unraid'],
  'automation',
  ARRAY['unraid', 'server', 'nas', 'homelab'],
  0,
  FALSE
),
(
  'beeper-status',
  'Beeper Status',
  'Check Beeper messaging status.',
  'View connected bridges and message status.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: beeper-status\ndescription: Check Beeper status\n\nsteps:\n  - id: status\n    command: beeper status\n    description: Get messaging status',
  ARRAY['krausefx/beeper'],
  'automation',
  ARRAY['beeper', 'messaging', 'chat', 'bridges'],
  0,
  FALSE
),
-- DevTools (31-42)
(
  'conventional-commit',
  'Conventional Commit',
  'Create a conventional commit message.',
  'Generate properly formatted commit messages following the conventional commits spec.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: conventional-commit\ndescription: Create conventional commit\nargs:\n  type:\n    required: true\n    description: Commit type (feat, fix, etc)\n  message:\n    required: true\n    description: Commit message\n\nsteps:\n  - id: commit\n    command: git commit -m "$args.type: $args.message"\n    description: Create commit',
  ARRAY['bastos/conventional-commits'],
  'devtools',
  ARRAY['git', 'commit', 'conventional', 'semantic'],
  0,
  TRUE
),
(
  'gitload-clone',
  'Gitload Clone',
  'Clone a repository with gitload.',
  'Faster repository cloning with progress tracking.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: gitload-clone\ndescription: Clone with gitload\nargs:\n  repo:\n    required: true\n    description: Repository URL\n\nsteps:\n  - id: clone\n    command: gitload clone $args.repo\n    description: Clone repository',
  ARRAY['waldekmastykarz/gitload'],
  'devtools',
  ARRAY['git', 'clone', 'download', 'repository'],
  0,
  FALSE
),
(
  'codex-quota',
  'Codex Quota',
  'Check your OpenAI Codex usage quota.',
  'Monitor your API usage and remaining quota.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: codex-quota\ndescription: Check Codex quota\n\nsteps:\n  - id: check\n    command: codex-quota check\n    description: Get quota status',
  ARRAY['odrobnik/codex-quota'],
  'devtools',
  ARRAY['codex', 'openai', 'quota', 'usage'],
  0,
  FALSE
),
(
  'hn-digest',
  'Hacker News Digest',
  'Get a digest of top Hacker News stories.',
  'Stay updated with the tech community.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: hn-digest\ndescription: Get HN top stories\n\nsteps:\n  - id: fetch\n    command: hn-digest top --limit 10\n    description: Get top stories',
  ARRAY['cpojer/hn-digest'],
  'devtools',
  ARRAY['hackernews', 'news', 'tech', 'digest'],
  0,
  TRUE
),
(
  'miniflux-unread',
  'Miniflux Unread',
  'List unread articles from Miniflux RSS reader.',
  'Check your RSS feed for new articles.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: miniflux-unread\ndescription: List unread articles\n\nsteps:\n  - id: list\n    command: miniflux entries --status unread --limit 20\n    description: Get unread articles',
  ARRAY['hartlco/miniflux-news'],
  'devtools',
  ARRAY['miniflux', 'rss', 'news', 'reader'],
  0,
  FALSE
),
(
  'excalidraw-flow',
  'Excalidraw Flowchart',
  'Generate a flowchart in Excalidraw format.',
  'Create visual diagrams from text descriptions.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: excalidraw-flow\ndescription: Create flowchart\nargs:\n  description:\n    required: true\n    description: Flowchart description\n\nsteps:\n  - id: generate\n    command: excalidraw-flowchart generate "$args.description"\n    description: Generate flowchart',
  ARRAY['swiftlysingh/excalidraw-flowchart'],
  'devtools',
  ARRAY['excalidraw', 'diagram', 'flowchart', 'visual'],
  0,
  FALSE
),
(
  'sf-symbol',
  'SF Symbol Generator',
  'Find and preview SF Symbols.',
  'Search Apple SF Symbols for your app.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: sf-symbol\ndescription: Search SF Symbols\nargs:\n  query:\n    required: true\n    description: Symbol search term\n\nsteps:\n  - id: search\n    command: sfsymbol search "$args.query"\n    description: Find symbols',
  ARRAY['svkozak/sfsymbol-generator'],
  'devtools',
  ARRAY['sfsymbols', 'apple', 'icons', 'ios'],
  0,
  FALSE
),
(
  'polymarket-odds',
  'Polymarket Odds',
  'Check prediction market odds on Polymarket.',
  'View current odds for various events.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: polymarket-odds\ndescription: Check Polymarket odds\nargs:\n  query:\n    required: true\n    description: Market search term\n\nsteps:\n  - id: search\n    command: polymarket search "$args.query"\n    description: Get market odds',
  ARRAY['mvanhorn/polymarket'],
  'devtools',
  ARRAY['polymarket', 'predictions', 'odds', 'markets'],
  0,
  FALSE
),
(
  'search-x',
  'Search X',
  'Search posts on X (Twitter).',
  'Find recent posts matching your query.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: search-x\ndescription: Search X posts\nargs:\n  query:\n    required: true\n    description: Search term\n\nsteps:\n  - id: search\n    command: search-x "$args.query" --limit 10\n    description: Search posts',
  ARRAY['mvanhorn/search-x'],
  'devtools',
  ARRAY['twitter', 'x', 'search', 'social'],
  0,
  FALSE
),
(
  'prowlarr-search',
  'Prowlarr Search',
  'Search indexers via Prowlarr.',
  'Find content across multiple indexers.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: prowlarr-search\ndescription: Search Prowlarr\nargs:\n  query:\n    required: true\n    description: Search term\n\nsteps:\n  - id: search\n    command: prowlarr search "$args.query"\n    description: Search indexers',
  ARRAY['jmagar/prowlarr'],
  'devtools',
  ARRAY['prowlarr', 'indexer', 'search', 'arr'],
  0,
  FALSE
),
(
  'sabnzbd-queue',
  'SABnzbd Queue',
  'Check SABnzbd download queue.',
  'View active and queued Usenet downloads.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: sabnzbd-queue\ndescription: Check SABnzbd queue\n\nsteps:\n  - id: queue\n    command: sabnzbd queue\n    description: Get download queue',
  ARRAY['jmagar/sabnzbd'],
  'devtools',
  ARRAY['sabnzbd', 'usenet', 'downloads', 'nzb'],
  0,
  FALSE
),
(
  'xai-query',
  'xAI Query',
  'Query xAI Grok model.',
  'Send a prompt to xAI and get a response.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: xai-query\ndescription: Query xAI\nargs:\n  prompt:\n    required: true\n    description: Your prompt\n\nsteps:\n  - id: query\n    command: xai query "$args.prompt"\n    description: Get response',
  ARRAY['mvanhorn/xai'],
  'devtools',
  ARRAY['xai', 'grok', 'ai', 'llm'],
  0,
  FALSE
),
-- Communication (43-50)
(
  'post-at',
  'Scheduled Post',
  'Schedule a post for later.',
  'Queue up social media posts for future publishing.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: post-at\ndescription: Schedule a post\nargs:\n  message:\n    required: true\n    description: Post content\n  time:\n    required: true\n    description: Schedule time\n\nsteps:\n  - id: schedule\n    command: post-at schedule "$args.message" --at "$args.time"\n    description: Schedule post',
  ARRAY['krausefx/post-at'],
  'communication',
  ARRAY['social', 'schedule', 'post', 'queue'],
  0,
  FALSE
),
(
  'youtube-article',
  'YouTube to Article',
  'Convert a YouTube video to an article.',
  'Generate a readable article from video content.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: youtube-article\ndescription: Convert YouTube to article\nargs:\n  url:\n    required: true\n    description: YouTube URL\n\nsteps:\n  - id: convert\n    command: youtube-instant-article "$args.url"\n    description: Generate article',
  ARRAY['viticci/youtube-instant-article'],
  'communication',
  ARRAY['youtube', 'article', 'convert', 'read'],
  0,
  TRUE
),
(
  'tailscale-serve',
  'Tailscale Serve',
  'Share a local service via Tailscale.',
  'Expose a local port to your tailnet.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: tailscale-serve\ndescription: Share via Tailscale\nargs:\n  port:\n    required: true\n    description: Local port to share\n\nsteps:\n  - id: serve\n    command: tailscale serve $args.port\n    description: Start sharing',
  ARRAY['snopoke/tailscale-serve'],
  'communication',
  ARRAY['tailscale', 'share', 'serve', 'network'],
  0,
  FALSE
),
(
  'endurance-coach',
  'Endurance Coach',
  'Get endurance training advice.',
  'AI-powered coaching for running and cycling.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: endurance-coach\ndescription: Get training advice\nargs:\n  question:\n    required: true\n    description: Your training question\n\nsteps:\n  - id: ask\n    command: endurance-coach ask "$args.question"\n    description: Get advice',
  ARRAY['shiv19/endurance-coach'],
  'communication',
  ARRAY['fitness', 'running', 'cycling', 'coach'],
  0,
  FALSE
),
(
  'withings-weight',
  'Withings Weight',
  'Get your latest weight from Withings.',
  'Fetch recent weight measurements.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: withings-weight\ndescription: Get weight data\n\nsteps:\n  - id: fetch\n    command: withings weight --latest\n    description: Get latest weight',
  ARRAY['hisxo/withings-health'],
  'communication',
  ARRAY['withings', 'health', 'weight', 'fitness'],
  0,
  FALSE
),
(
  'oebb-train',
  'OBB Train Search',
  'Search Austrian train schedules.',
  'Find train connections on Austrian railways.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: oebb-train\ndescription: Search OBB trains\nargs:\n  from:\n    required: true\n    description: Departure station\n  to:\n    required: true\n    description: Arrival station\n\nsteps:\n  - id: search\n    command: oebb-scotty search --from "$args.from" --to "$args.to"\n    description: Find connections',
  ARRAY['manmal/oebb-scotty'],
  'communication',
  ARRAY['oebb', 'train', 'austria', 'travel'],
  0,
  FALSE
),
(
  'remotion-render',
  'Remotion Render',
  'Render a video with Remotion.',
  'Generate videos from React components.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: remotion-render\ndescription: Render Remotion video\nargs:\n  composition:\n    required: true\n    description: Composition name\n\nsteps:\n  - id: render\n    command: remotion-server render $args.composition\n    description: Render video',
  ARRAY['mvanhorn/remotion-server'],
  'communication',
  ARRAY['remotion', 'video', 'render', 'react'],
  0,
  FALSE
),
(
  'spotify-current',
  'Now Playing',
  'Show the currently playing track on Spotify.',
  'See what song is currently playing.',
  'LobsterHub',
  'https://github.com/xBenJamminx/Lobsterhub',
  E'name: spotify-current\ndescription: Show current track\n\nsteps:\n  - id: current\n    command: spotify-web-api current\n    description: Get now playing',
  ARRAY['mvanhorn/spotify-web-api'],
  'communication',
  ARRAY['spotify', 'music', 'now-playing', 'current'],
  0,
  TRUE
);
