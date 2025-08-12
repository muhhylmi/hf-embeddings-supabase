import { supabaseAdmin } from "../config/supabase";
import { getEncoderAndChunker } from "../utils/chunkText";
import { createEmbeddings } from "./embeddings";
import dotenv from "dotenv";
dotenv.config();

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE_TOKENS ?? "500");
const CHUNK_OVERLAP = parseInt(process.env.CHUNK_OVERLAP_TOKENS ?? "50");

export async function ingestText(text: string, metadata: Record<string, any> | null = null) {
    const { chunkTokens } = getEncoderAndChunker();
    const chunks = chunkTokens(text, CHUNK_SIZE, CHUNK_OVERLAP);
    if (!chunks.length) return { inserted: 0 };

    const embeddings = await createEmbeddings(chunks);

    // batch insert with supabaseAdmin (array insert)
    const rows = chunks.map((c, i) => ({ content: c, metadata: metadata ?? {}, embedding: embeddings[i] }));
    const { error } = await supabaseAdmin.from("documents").insert(rows);
    if (error) throw error;

    return { inserted: chunks.length };
}