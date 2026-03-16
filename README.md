# FDL Tournament Centre with /admin and /public

This project gives you:
- `/admin` for score entry
- `/public` for read-only live viewing
- shared live database via Supabase
- real-time score updates to the public page

## 1. Create a Supabase project
In Supabase:
- create a new project
- go to SQL Editor
- run the SQL from `supabase-setup.sql`

## 2. Enable Email auth
In Supabase:
- Authentication -> Providers
- enable Email
- use magic links

## 3. Add environment variables in Vercel
Use values from Supabase Project Settings -> API:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## 4. Deploy to Vercel
Import this repo into Vercel.

## 5. Use these links
- `https://your-site.vercel.app/admin`
- `https://your-site.vercel.app/public`

## Notes
- Public page is read-only in the UI.
- Admin page requires email magic-link login to write scores.
- Security depends on the RLS policies in Supabase.