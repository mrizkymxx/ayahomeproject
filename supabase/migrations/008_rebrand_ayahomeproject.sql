-- Rebrand article metadata and copy from Loewes to Aya Home Project.

ALTER TABLE public.articles
ALTER COLUMN author SET DEFAULT 'Aya Home Project';

UPDATE public.articles
SET author = 'Aya Home Project'
WHERE author IS NULL
   OR btrim(author) = ''
   OR lower(author) IN ('loewes furniture', 'loewes wood');

UPDATE public.articles
SET excerpt = regexp_replace(excerpt, 'Loewes Furniture', 'Aya Home Project', 'gi')
WHERE excerpt ILIKE '%Loewes Furniture%';

UPDATE public.articles
SET excerpt = regexp_replace(excerpt, 'Loewes Wood', 'Aya Home Project', 'gi')
WHERE excerpt ILIKE '%Loewes Wood%';

UPDATE public.articles
SET content = regexp_replace(content, 'Loewes Furniture', 'Aya Home Project', 'gi')
WHERE content ILIKE '%Loewes Furniture%';

UPDATE public.articles
SET content = regexp_replace(content, 'Loewes Wood', 'Aya Home Project', 'gi')
WHERE content ILIKE '%Loewes Wood%';

UPDATE public.articles
SET content = regexp_replace(content, ' at Loewes ', ' at Aya Home Project ', 'gi')
WHERE content ILIKE '% at Loewes %';
