import path from "path";
import { supabaseAdmin } from "../config/supabase";
import { getEncoderAndChunker } from "../utils/chunkText";
import { createEmbeddings } from "./embeddings";
import dotenv from "dotenv";
import fs from "fs";
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

export async function ingestTextFile(filePath: string) {
    const file = fs.readFileSync(filePath, "utf8");
    const splitFile = file.split("\r\n\r\n\r\n");
    for (const item of splitFile) {
        ingestText(item);
    }
    return { inserted: splitFile };
}