// README.md

# LLM RAG with Supabase pgvector (TypeScript + Express)

# 🧠 RAG App - Supabase + Hugging Face + Groq

A simple Retrieval-Augmented Generation (RAG) app using:

-   **Supabase** → Vector database for semantic search
-   **Hugging Face** → Free embedding model (`all-MiniLM-L6-v2`)
-   **Groq** → LLM inference with LLaMA 3 for natural language answers

---

## 🚀 Features

-   Ingest long text automatically **with chunking**.
-   Store embeddings in **Supabase**.
-   Perform **semantic search** using Supabase.
-   Use **Groq** LLaMA 3 to answer questions based on search results.

---

📊 Flow of the App

-   User Input Question → User asks a question.
-   Hugging Face → Generate Embedding → Convert question into vector form.
-   Supabase → Search Relevant Chunks → Find most similar text chunks.
-   Groq LLaMA 3 → Generate Final Answer → Create a natural language answer.
-   Return Answer to User → Display final output.
    User ➡️ Embedding ➡️ Supabase Search ➡️ LLM Groq ➡️ Answer

Quickstart:

1. Copy `.env.example` to `.env` and fill values (OpenAI key, Supabase URL & service role key).
2. Run SQL in Supabase SQL Editor: `SQL/setup.sql` contents (creates `documents` table + RPC function).
3. Install deps: `npm install`.
4. Start dev server: `npm run dev`.
5. Ingest: POST `/ingest` with `{ "text": "..." }`.
6. Chat: POST `/chat` with `{ "question": "..." }`.

Notes:

-   Use SUPABASE service role key on the server to allow RPC that takes vector as param.
-   Adjust `VECTOR_DIM` in `.env` and SQL if you use a different embedding model.
-   For production, secure the server and don't leak the service role key.

---
