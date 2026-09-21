# G10 · Alto Rendimiento

Mobile-first athlete performance platform.

## Current MVP
- Branded mobile experience for athletes and coaches.
- Email/password authentication with a safe demo fallback.
- Role detection from Supabase memberships.
- Coaches can select real athletes and assign training sessions.
- Athletes can receive and complete their own sessions.
- Demo data remains available before login.

## Data layer
The production data model lives in the isolated G10 Supabase project with Row Level Security enabled. Athletes can only access their own personal records; authorized professionals can access athletes from their organization according to role.

## Local setup
1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Optionally override the G10 project URL and publishable key.
4. Run `npm run dev`.

The browser bundle uses only the modern Supabase publishable key. Never expose a Supabase secret or `service_role` key in frontend environment variables.
