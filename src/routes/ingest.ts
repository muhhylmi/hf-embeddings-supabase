import { Router } from "express";
import { ingestText, ingestTextFile } from "../services/ingestService";
import path from "path";
const router = Router();


router.post("/txt", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "..", "..", "dataset", "clean.txt");
        const result = await ingestTextFile(filePath);
        res.json({ ok: true, result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

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