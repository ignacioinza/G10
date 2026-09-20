# G10 · Alto Rendimiento

Mobile-first athlete performance platform.

## Current prototype
- Animated coach / athlete role switch.
- Coach can build, edit and assign a session.
- Athlete receives the assigned session, completes exercises and records RPE.
- Demo data is stored only in the browser. No real athlete health data is exposed publicly.

## Data layer
The production data model lives in the isolated G10 Supabase project with Row Level Security enabled. Authentication and role-based access are the next integration step.

## Local setup
1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add only the G10 project URL and publishable key.
4. Run `npm run dev`.

The app keeps using browser-only demo data until the authentication flow is connected. Server and browser Supabase client factories are already available in `lib/supabase` for that next step. Never expose a Supabase secret or `service_role` key in frontend environment variables.
