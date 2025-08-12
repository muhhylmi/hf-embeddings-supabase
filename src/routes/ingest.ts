import { Router } from "express";
import { ingestText } from "../services/ingestService";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const { text, metadata } = req.body;
        if (!text) return res.status(400).json({ error: "text required" });
        const result = await ingestText(text, metadata ?? null);
        res.json({ ok: true, ...result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

export default router;