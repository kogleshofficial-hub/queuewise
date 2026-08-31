# QueueWise 🌍

> **Know the queue before you go.**

QueueWise is a crowdsourced waiting-time platform for real-world services. The idea is simple: check recent community observations before spending time travelling to a place and waiting in line.

## 🚀 Live

**https://queuewise-app.vercel.app/**

## Why QueueWise?

Waiting is one of those everyday problems that is easy to ignore because there is no good way to know what is happening right now.

QueueWise explores whether communities can make that information visible by sharing quick observations when they are actually at a location.

## How it works

```text
Discover a place
      ↓
See recent reports
      ↓
Understand the estimated wait
      ↓
Visit when it makes sense
      ↓
Share what you observe
      ↓
Help the next person
```

## ✨ Key ideas

- 🗺️ Discover real places through OpenStreetMap
- ⏱️ View recent community-reported waiting information
- 📊 Estimates are based on recent observations
- 🕐 Older reports fade out of live estimates
- 👥 Community reporting instead of invented queue numbers
- 🔒 Privacy-conscious reporting using a random local reporter token
- 🛡️ Supabase Row Level Security for database access
- 📱 Designed for practical mobile use

### A deliberate product rule

**QueueWise does not invent queue numbers.**

If there is not enough recent community data, the interface should communicate that clearly rather than pretending a location is quiet.

## 🧱 Architecture

```text
Next.js / React
      ↓
Supabase
      ↓
PostgreSQL + RLS
      ↓
Queue reports
      ↓
Recent observations
      ↓
Live estimate
```

The data model includes locations and timestamped queue reports. Database functions handle nearby-location discovery and basic report-rate protection.

## 🛠️ Built with

- Next.js App Router
- React
- TypeScript
- Supabase
- PostgreSQL
- Row Level Security
- OpenStreetMap / Nominatim
- Vercel

## 💻 Run locally

```bash
npm install
npm run dev
```

Create `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never expose a Supabase secret/service-role key in client-side code.

## 🌱 Project status

**Live MVP — actively evolving.**

The next challenge is not simply adding features. It is getting enough real local participation for the information to become genuinely useful.

## 👨‍💻 Creator

Built independently by **Koglesh R. Murugan**, a 16-year-old developer from Malaysia exploring how software can solve practical everyday problems.

## 🤝 Feedback

If you have ideas for making crowdsourced waiting information more trustworthy, useful, or easier to contribute, I'd love to hear them.

**Live app:** https://queuewise-app.vercel.app/
