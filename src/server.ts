import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import ingestRouter from "./routes/ingest";
import chatRouter from "./routes/chat";

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

app.get("/", (req, res) => res.json({ ok: true }));

app.use("/ingest", ingestRouter);
app.use("/chat", chatRouter);

const port = parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));