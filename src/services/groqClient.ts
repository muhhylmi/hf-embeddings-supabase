import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not set in .env");

export const groq = new Groq({ apiKey: GROQ_API_KEY }); // instantiate sdk