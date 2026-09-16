# Simple CRM

A minimal CRM (contacts + status pipeline) built with React, Vite, TypeScript,
and Supabase. Each user only sees their own contacts (enforced by Postgres
row-level security), so it works as a single-tenant CRM per signed-in user.

## Stack

- **Frontend:** React + TypeScript + Vite (plain CSS, no framework overhead)
- **Backend:** Supabase (Postgres + Auth), accessed directly from the client
- **Hosting:** Netlify

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `contacts` table and row-level security policies so users
   can only read/write their own rows.
3. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
4. By default Supabase requires email confirmation for sign-up. For fastest
   local testing you can disable "Confirm email" under
   **Authentication → Providers → Email**, or just check your inbox.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

Sign up with an email/password, then start adding contacts.

## 4. Deploy to Netlify

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Netlify: **Add new site → Import an existing project** and pick this repo.
3. Build settings are already defined in [`netlify.toml`](netlify.toml)
   (`npm run build`, publish directory `dist`) — Netlify should detect them
   automatically.
4. Add the same two environment variables under
   **Site configuration → Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Every push to the connected branch will redeploy automatically.

## Project structure

```
src/
  components/
    Auth.tsx          # sign in / sign up form
    ContactForm.tsx    # add-contact form
    ContactList.tsx    # contacts table with inline status + delete
  supabaseClient.ts     # Supabase client, reads env vars
  types.ts               # Contact / NewContact types
  App.tsx                 # auth gate + data loading
supabase/schema.sql        # table + RLS policies to run in Supabase
netlify.toml                 # Netlify build config
```

## Extending it

- Add more entity types (companies, deals) as additional tables with the same
  `user_id` + RLS pattern.
- Swap password auth for magic links or OAuth via `supabase.auth`.
- Add search/filter on the contacts table client-side, or push it into the
  Supabase query once the contact list grows.
