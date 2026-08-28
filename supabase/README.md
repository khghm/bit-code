# Supabase Local Development

This folder contains Supabase migration and seed files for the Bitcode Academy database.

## Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start Supabase locally:
   ```bash
   supabase start
   ```

3. Apply migrations:
   ```bash
   supabase db reset
   ```

4. Generate TypeScript types:
   ```bash
   npm run db:generate
   ```

## Migrations

- `001_initial_schema.sql` - Creates all tables, indexes, RLS policies, and triggers

## Seed Data

- `001_initial_data.sql` - Populates initial categories, courses, phases, mentors, testimonials, and FAQs

## Database Schema

### Tables
- **categories** - Course categories (prog, cs, se, web, data, infra, mkt)
- **courses** - Course catalog
- **phases** - Learning path phases
- **mentors** - Instructor profiles
- **testimonials** - Student testimonials
- **faqs** - Frequently asked questions
- **lessons** - Course lessons with blocks and quizzes
- **profiles** - User profiles (extends auth.users)
- **user_progress** - User lesson completion tracking
- **enrollments** - User course enrollments

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for content tables
- Authenticated users can only modify their own data
