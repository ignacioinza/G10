# G10 · Alto Rendimiento

Mobile-first athlete performance platform.

## Current prototype
- Animated coach / athlete role switch.
- Coach can build, edit and assign a session.
- Athlete receives the assigned session, completes exercises and records RPE.
- Demo data is stored only in the browser. No real athlete health data is exposed publicly.

## Data layer
The production data model lives in the isolated G10 Supabase project with Row Level Security enabled. Authentication and role-based access are the next integration step.
