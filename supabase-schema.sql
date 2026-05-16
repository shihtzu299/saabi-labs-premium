create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.projects (
  slug text primary key,
  title text not null,
  tagline text not null default '',
  summary text not null,
  description text not null default '',
  stack text[] not null default '{}',
  services text[] not null default '{}',
  year text not null default '',
  outcome text not null default '',
  "imageUrl" text not null default '',
  "liveUrl" text not null default '',
  metrics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  slug text primary key,
  title text not null,
  excerpt text not null,
  date text not null,
  "readTime" text not null default '3 min read',
  category text not null default '',
  content text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  company text not null default '',
  message text not null,
  "avatarUrl" text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  featured boolean not null default false,
  approved boolean not null default false,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.testimonials
add column if not exists rating integer not null default 5;

alter table public.testimonials
drop constraint if exists testimonials_rating_check;

alter table public.testimonials
add constraint testimonials_rating_check check (rating between 1 and 5);

drop trigger if exists set_projects_updated_at on public.projects;

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;

create trigger set_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Public projects are readable" on public.projects;

create policy "Public projects are readable"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "Public posts are readable" on public.posts;

create policy "Public posts are readable"
on public.posts
for select
to anon, authenticated
using (true);

drop policy if exists "Public approved testimonials are readable" on public.testimonials;

create policy "Public approved testimonials are readable"
on public.testimonials
for select
to anon, authenticated
using (
  approved = true
  or status = 'approved'
);

drop policy if exists "Anyone can submit testimonials" on public.testimonials;

create policy "Anyone can submit testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'saabi-media',
  'saabi-media',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into public.projects (
  slug,
  title,
  tagline,
  summary,
  description,
  stack,
  services,
  year,
  outcome,
  "imageUrl",
  "liveUrl",
  metrics
)
values
(
  'afrilance',
  'AfriLance',
  'Decentralized freelance escrow for African builders.',
  'AI-powered freelance marketplace with smart-contract escrow and stablecoin settlement rails.',
  'AfriLance combines reputation scoring, milestone-based escrow, dispute workflows, and AI-assisted project matching into a product designed for cross-border freelance work.',
  array['React', 'Node.js', 'Solidity', 'BNB Chain'],
  array['Product Strategy', 'Smart Contracts', 'Web App'],
  '2026',
  'A secure marketplace foundation ready for investor demos and protocol integrations.',
  '',
  '',
  '[{"label":"Escrow flows","value":"4"},{"label":"Core screens","value":"18+"},{"label":"Settlement layer","value":"Stablecoin"}]'::jsonb
),
(
  'paard-co',
  'PAARD-Co',
  'Agricultural infrastructure platform for scalable operations.',
  'A modern platform experience for agricultural logistics, investment storytelling, and field operations.',
  'PAARD-Co turns a complex operating model into a clear digital presence with investor-ready positioning, operational modules, and a polished growth narrative.',
  array['Next.js', 'Tailwind', 'Framer Motion'],
  array['Website', 'UX Design', 'Automation'],
  '2026',
  'A premium brand and platform surface built for partnerships and operational expansion.',
  '',
  '',
  '[{"label":"Regions modeled","value":"6"},{"label":"Content modules","value":"12"},{"label":"Launch speed","value":"2 weeks"}]'::jsonb
),
(
  'bozkurt',
  'Bozkurt',
  'High-conversion Web3 brand experience.',
  'A premium meme coin launch site with community-first interaction design and conversion paths.',
  'Bozkurt needed to feel fast, loud, and credible. The experience blends token storytelling, launch mechanics, social proof, and mobile-first engagement.',
  array['React', 'TypeScript', 'Tailwind'],
  array['Landing Page', 'Motion Design', 'Web3 UX'],
  '2025',
  'A memorable launch surface built to move visitors from curiosity to community action.',
  '',
  '',
  '[{"label":"Mobile score","value":"95+"},{"label":"CTA paths","value":"5"},{"label":"Community links","value":"3"}]'::jsonb
)
on conflict (slug) do nothing;

insert into public.posts (
  slug,
  title,
  excerpt,
  date,
  "readTime",
  category,
  content
)
values
(
  'shipping-premium-startup-products',
  'Shipping Premium Startup Products Without Slowing Down',
  'A practical operating model for pairing fast iteration with a polished product experience.',
  '2026-05-13',
  '4 min read',
  'Product Engineering',
  array[
    'Premium product work is not about adding ceremony. It is about choosing the few systems that keep quality high while the team is moving quickly.',
    'For early teams, the strongest pattern is a compact loop: define the user action, build the smallest complete flow, polish the moment of trust, then measure the next bottleneck.',
    'Saabi Labs uses this approach across AI, Web3, and SaaS builds because it keeps the product useful before it becomes crowded.'
  ]
),
(
  'web3-products-need-better-ux',
  'Web3 Products Need Better UX, Not More Jargon',
  'How to make blockchain experiences feel understandable, credible, and conversion-ready.',
  '2026-05-10',
  '3 min read',
  'Web3',
  array[
    'Most users do not want to decode infrastructure. They want to understand what happens next, what risk they are taking, and why the product is worth trusting.',
    'A strong Web3 interface makes wallet states, transaction progress, and ownership outcomes visible without burying the user in protocol language.',
    'The best technical systems still need careful product writing, interface hierarchy, and recovery paths.'
  ]
),
(
  'ai-automation-that-actually-helps',
  'AI Automation That Actually Helps Teams',
  'The useful AI layer is usually narrow, workflow-aware, and connected to the right handoff points.',
  '2026-05-07',
  '5 min read',
  'AI Systems',
  array[
    'AI features work best when they remove a repeated decision or prepare a human to make a better one.',
    'Instead of forcing chat into every corner of a product, teams should map the moments where context gathering, summarization, triage, or drafting slows people down.',
    'That keeps the AI experience grounded in business value instead of novelty.'
  ]
)
on conflict (slug) do nothing;

insert into public.testimonials (
  name,
  role,
  company,
  message,
  "avatarUrl",
  rating,
  featured,
  approved,
  status
)
values
(
  'David Hassan',
  'Founder',
  'AfriLance',
  'Saabi Labs transformed our product vision into a premium platform experience. Fast execution, strong communication, and exceptional engineering.',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
  5,
  true,
  true,
  'approved'
),
(
  'Sarah Ibrahim',
  'Operations Lead',
  'PAARD-Co',
  'The level of polish and strategic thinking was impressive. The final product positioned us professionally for investors and partners.',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
  5,
  true,
  true,
  'approved'
)
on conflict do nothing;
