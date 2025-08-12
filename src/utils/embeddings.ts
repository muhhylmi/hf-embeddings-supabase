import { groq } from "../services/groqClient";

/**
 * Create single embedding via groq-sdk
 */
export async function createEmbedding(text: string, model = process.env.EMBEDDING_MODEL as string) {
    // groq-sdk mirrors OpenAI shape    
    const resp = await groq.embeddings.create({ model, input: text });
    // @ts-ignore
    return resp.data[0].embedding as number[];
}

/**
 * Batch embeddings
 */
export async function createEmbeddings(
    texts: string[],
    model: string = "nomic-embed-text-v1_5"
) {
    console.log("================", texts);
    const resp = await groq.embeddings.create({ model, input: texts });
    return resp.data.map((d: any) => d.embedding as number[]);
}



export async function chatCompletion(
    messages: Array<{ role: string; content: string }>,
    model: Exclude<typeof process.env.GROQ_CHAT_MODEL, undefined> = "llama3-8b-8192",
    max_tokens = 512
) {
    const resp = await groq.chat.completions.create({
        model,
        messages: messages as any,
        max_tokens
    });
    return resp; // return full response; caller will parse choices
}
