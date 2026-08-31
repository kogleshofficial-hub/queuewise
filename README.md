# QueueWise

**Know the queue before you go.**

QueueWise is a crowdsourced waiting-time platform for real-world services. People can discover nearby places, see recent community-reported waiting times, and submit a quick report when they are on-site.

## Principles

- Real reports only — no fabricated queue data.
- Every estimate is community-derived and time-limited.
- Old reports expire from live estimates after 24 hours.
- Clear confidence levels based on recent report volume.
- Privacy-first reporting: the app uses a random local reporter token rather than collecting a person's identity for a queue report.
- Supabase Row Level Security protects database access.

## Stack

- Next.js App Router
- TypeScript
- Supabase Postgres + RLS
- Vercel
- OpenStreetMap Nominatim for place discovery

## Local development

```bash
npm install
npm run dev
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never put a Supabase secret/service-role key in browser code.

## Data model

- `locations` stores real places discovered by users.
- `queue_reports` stores time-stamped community observations.
- `nearby_queue_locations()` calculates nearby live estimates.
- `can_submit_report()` and a database trigger enforce a basic report rate limit.

QueueWise is deliberately transparent: an empty location means there is not enough recent community data yet, not that the place is quiet.
