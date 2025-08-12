import { encoding_for_model } from "tiktoken";
import type { TiktokenModel } from "tiktoken";

/** returns encoder and helper chunk function */
export function getEncoderAndChunker(modelForToken: TiktokenModel = "gpt-3.5-turbo") {
    const encoder = encoding_for_model(modelForToken);

    function chunkTokens(text: string, maxTokens = 500, overlap = 50): string[] {
        const tokenIds: number[] = Array.from(encoder.encode(text));
        const chunks: string[] = [];
        let start = 0;
        while (start < tokenIds.length) {
            const end = Math.min(start + maxTokens, tokenIds.length);
            // tiktoken expects Uint32Array for decode, not number[]
            const slice = new Uint32Array(tokenIds.slice(start, end));
            const decodedBytes = encoder.decode(slice);
            chunks.push(new TextDecoder().decode(decodedBytes));
            start += maxTokens - overlap;
        }
        return chunks.filter(Boolean);
    }

    return { encoder, chunkTokens };
}