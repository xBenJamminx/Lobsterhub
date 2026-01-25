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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Seed data
INSERT INTO workflows (slug, name, description, long_description, author, author_url, yaml, required_skills, category, tags, downloads, featured, created_at) VALUES
(
  'morning-briefing',
  'Morning Briefing',
  'Get a daily summary of your calendar, emails, and tasks delivered to Telegram.',
  E'Start your day with a comprehensive briefing that pulls together your calendar events,\nrecent emails, and pending tasks. An AI summarizes everything into actionable insights and sends it\ndirectly to your preferred messaging channel.\n\nPerfect for busy professionals who want to hit the ground running each morning.',
  'clawdbot',
  'https://github.com/clawdbot',
  E'name: morning-briefing\ndescription: Daily summary of calendar, emails, and tasks\nargs:\n  channel:\n    default: "telegram"\n    description: "Where to send the briefing"\n\nsteps:\n  - id: calendar\n    command: gog.gcal.today --json\n    description: Fetch today''s calendar events\n\n  - id: email\n    command: gog.gmail.search --query ''newer_than:1d'' --json\n    description: Get emails from the last 24 hours\n\n  - id: tasks\n    command: gog.todoist.today --json\n    description: Get today''s tasks\n\n  - id: summarize\n    command: llm-task --prompt "Create a morning briefing summary"\n    stdin: $calendar.stdout, $email.stdout, $tasks.stdout\n    description: AI summarizes all inputs\n\n  - id: send\n    command: clawd.invoke --tool message --action send --channel $args.channel\n    stdin: $summarize.stdout\n    description: Send briefing to user',
  ARRAY['gog.gcal', 'gog.gmail', 'gog.todoist', 'llm-task', 'clawd.invoke'],
  'productivity',
  ARRAY['morning', 'briefing', 'calendar', 'email', 'tasks', 'telegram'],
  247,
  TRUE,
  NOW() - INTERVAL '7 days'
),
(
  'inbox-triage',
  'Inbox Triage',
  'Automatically categorize and prioritize incoming emails with AI-powered approval gates.',
  E'Overwhelmed by email? This workflow uses AI to categorize your inbox into\nactionable buckets: urgent, needs response, FYI, and spam.\n\nFor important emails, it presents you with a quick approval interface before taking any action.\nIntegrates with your existing labels and filters.',
  'clawdbot',
  'https://github.com/clawdbot',
  E'name: inbox-triage\ndescription: AI-powered email categorization with approval gates\nargs:\n  auto_archive:\n    default: false\n    description: "Auto-archive FYI emails"\n\nsteps:\n  - id: fetch\n    command: gog.gmail.search --query ''is:unread category:primary'' --json\n    description: Get unread primary emails\n\n  - id: categorize\n    command: llm-task --prompt "Categorize emails: urgent, needs_response, fyi, spam"\n    stdin: $fetch.stdout\n    description: AI categorizes each email\n\n  - id: urgent\n    command: clawd.invoke --tool notify --priority high\n    stdin: $categorize.stdout | jq ''.urgent''\n    when: $categorize.stdout.urgent | length > 0\n    description: Alert on urgent emails\n\n  - id: review\n    command: clawd.invoke --tool approval_gate --timeout 300\n    stdin: $categorize.stdout | jq ''.needs_response''\n    description: Present emails needing response for approval\n\n  - id: archive\n    command: gog.gmail.archive\n    stdin: $categorize.stdout | jq ''.fyi''\n    when: $args.auto_archive\n    description: Auto-archive FYI emails if enabled',
  ARRAY['gog.gmail', 'llm-task', 'clawd.invoke'],
  'productivity',
  ARRAY['email', 'triage', 'inbox', 'categorization', 'ai', 'approval'],
  189,
  TRUE,
  NOW() - INTERVAL '5 days'
),
(
  'daily-standup',
  'Daily Standup',
  'Generate standup reports from git commits and calendar, then post to Slack.',
  E'Automate your daily standup updates by pulling context from what you actually did.\n\nThis workflow examines your git commits, completed tasks, and calendar meetings to generate\na meaningful standup update. Posts directly to your team''s Slack channel.\n\nSupports the standard "what I did, what I''m doing, blockers" format.',
  'clawdbot',
  'https://github.com/clawdbot',
  E'name: daily-standup\ndescription: Auto-generate standup from git + calendar\nargs:\n  slack_channel:\n    default: "#standup"\n    description: "Slack channel to post to"\n  git_repos:\n    default: "."\n    description: "Comma-separated repo paths"\n\nsteps:\n  - id: commits\n    command: git.log --since yesterday --author $USER --json\n    cwd: $args.git_repos\n    description: Get yesterday''s commits\n\n  - id: calendar_yesterday\n    command: gog.gcal.range --start yesterday --end today --json\n    description: Get yesterday''s meetings\n\n  - id: calendar_today\n    command: gog.gcal.today --json\n    description: Get today''s scheduled meetings\n\n  - id: generate\n    command: llm-task --prompt "Generate standup: yesterday, today, blockers"\n    stdin: $commits.stdout, $calendar_yesterday.stdout, $calendar_today.stdout\n    description: AI generates standup report\n\n  - id: post\n    command: gog.slack.post --channel $args.slack_channel\n    stdin: $generate.stdout\n    description: Post to Slack',
  ARRAY['git.log', 'gog.gcal', 'gog.slack', 'llm-task'],
  'communication',
  ARRAY['standup', 'slack', 'git', 'calendar', 'team', 'daily'],
  312,
  TRUE,
  NOW() - INTERVAL '3 days'
),
(
  'pr-review-reminder',
  'PR Review Reminder',
  'Monitor open PRs and send reminders for stale reviews.',
  E'Keep your team''s PR queue moving. This workflow checks for pull requests\nthat have been waiting for review and sends gentle reminders to reviewers.\n\nConfigurable thresholds for when to send reminders and escalation paths for critically stale PRs.',
  'octocat',
  'https://github.com/octocat',
  E'name: pr-review-reminder\ndescription: Remind reviewers about pending PRs\nargs:\n  repo:\n    required: true\n    description: "GitHub repo (owner/name)"\n  stale_hours:\n    default: 24\n    description: "Hours before PR is considered stale"\n  channel:\n    default: "slack"\n    description: "Notification channel"\n\nsteps:\n  - id: fetch_prs\n    command: gh.pr.list --repo $args.repo --state open --json\n    description: Get open PRs\n\n  - id: filter_stale\n    command: llm-task --prompt "Filter PRs older than $args.stale_hours hours"\n    stdin: $fetch_prs.stdout\n    description: Identify stale PRs\n\n  - id: get_reviewers\n    command: gh.pr.reviewers --repo $args.repo\n    stdin: $filter_stale.stdout\n    description: Get assigned reviewers\n\n  - id: notify\n    command: clawd.invoke --tool notify --channel $args.channel\n    stdin: $get_reviewers.stdout\n    when: $filter_stale.stdout | length > 0\n    description: Send reminder notifications',
  ARRAY['gh.pr', 'llm-task', 'clawd.invoke'],
  'devtools',
  ARRAY['github', 'pr', 'review', 'reminder', 'code-review'],
  156,
  FALSE,
  NOW() - INTERVAL '10 days'
),
(
  'meeting-notes-sync',
  'Meeting Notes Sync',
  'Transcribe meetings, generate summaries, and sync to Notion.',
  E'Never miss an action item again. This workflow processes meeting recordings,\ngenerates AI summaries with key decisions and action items, then syncs everything to your Notion workspace.\n\nSupports automatic participant detection and task assignment.',
  'productivity-labs',
  'https://github.com/productivity-labs',
  E'name: meeting-notes-sync\ndescription: Transcribe and sync meeting notes to Notion\nargs:\n  notion_db:\n    required: true\n    description: "Notion database ID for meeting notes"\n  audio_source:\n    default: "local"\n    description: "Audio source (local, zoom, meet)"\n\nsteps:\n  - id: transcribe\n    command: whisper.transcribe --source $args.audio_source\n    description: Transcribe meeting audio\n\n  - id: summarize\n    command: llm-task --prompt "Summarize meeting: decisions, action items, participants"\n    stdin: $transcribe.stdout\n    description: Generate structured summary\n\n  - id: extract_tasks\n    command: llm-task --prompt "Extract action items with assignees"\n    stdin: $summarize.stdout\n    description: Pull out action items\n\n  - id: sync_notion\n    command: gog.notion.page.create --database $args.notion_db\n    stdin: $summarize.stdout\n    description: Create Notion page with notes\n\n  - id: create_tasks\n    command: gog.todoist.add\n    stdin: $extract_tasks.stdout\n    description: Create tasks for action items',
  ARRAY['whisper.transcribe', 'llm-task', 'gog.notion', 'gog.todoist'],
  'productivity',
  ARRAY['meetings', 'transcription', 'notion', 'notes', 'action-items'],
  98,
  FALSE,
  NOW() - INTERVAL '14 days'
);
