import { supabaseAdmin } from "../config/supabase";
import { createEmbeddings } from "./embeddings";
import { groq } from "../config/groq";
import dotenv from "dotenv";
dotenv.config();

const GROQ_MODEL = process.env.GROQ_CHAT_MODEL ?? "llama3-8b-8192";

/** question -> embeddings -> match docs -> chat (Groq) */
export async function answerQuestion(question: string, topK = 5, match_threshold = 0.68) {
    // create embedding for question
    const qEmbArr = await createEmbeddings([question]);
    const qEmb = qEmbArr[0];

    // call RPC match_documents
    const { data, error } = await supabaseAdmin.rpc("match_documents", {
        query_embedding: qEmb,
        match_threshold,
        match_count: topK
    });
    if (error) throw error;

    const matches = (data ?? []) as Array<{ id: number; content: string; metadata: any; similarity: number }>;
    const context = matches.map((m) => m.content).join("\n---\n");

    const systemPrompt = "You are a helpful assistant. Answer only using the provided context. If not present, say 'Maaf, saya tidak tahu.'";
    const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const resp = await groq.chat.completions.create({ model: GROQ_MODEL, messages: messages as any, max_tokens: 512, temperature: 0 });
    const answer = resp.choices?.[0]?.message?.content ?? "";

    return { answer, matches };
}