import { Router } from "express";
import { answerQuestion } from "../services/chatService";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const { question, topK = 5, match_threshold = 0.68 } = req.body;
        if (!question) return res.status(400).json({ error: "question required" });
        const out = await answerQuestion(question, topK, match_threshold);
        res.json({ ok: true, ...out });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

export default router;