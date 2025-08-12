create extension if not exists vector;

create table if not exists documents (
  id bigserial primary key,
  content text not null,
  metadata jsonb,
  embedding vector(384)  -- sesuaikan 384 dengan VECTOR_DIM
);

create index if not exists idx_documents_embedding on documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_documents(
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table(
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    metadata,
    1 - (embedding <#> query_embedding) as similarity
  from documents
  where 1 - (embedding <#> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;