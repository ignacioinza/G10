# G10 · Alto Rendimiento

Mobile-first athlete performance platform.

## Current MVP
- Branded mobile experience for athletes and coaches.
- Email/password authentication with a safe demo fallback.
- Role detection from Supabase memberships.
- Coaches can select real athletes and assign training sessions.
- Athletes can receive and complete their own sessions.
- Four-week mesocycles can be synchronized per athlete.
- Daily wellness and physical-test results persist behind role-based access.
- Private image/video uploads use the `g10-media` Storage bucket.
- Demo data remains available before login.

## Data layer
The production data model lives in the isolated G10 Supabase project with Row Level Security enabled. Athletes can only access their own personal records; authorized professionals can access athletes from their organization according to role.

## Local setup
1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Optionally override the G10 project URL and publishable key.
4. Run `npm run dev`.

The browser bundle uses only the modern Supabase publishable key. Never expose a Supabase secret or `service_role` key in frontend environment variables.

## Database changes

Versioned SQL for planning cycles, private messages and media metadata lives in `supabase/migrations`. Every exposed table and the private Storage bucket use Row Level Security; new frontend code should continue using the generated `lib/supabase/database.types.ts` types.

