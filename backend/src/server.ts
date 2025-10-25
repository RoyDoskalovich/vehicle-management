import express from "express";
import cors from "cors";
import {vehiclesRouter} from "./routes/vehicles.routes";
import {errorHandler} from "./middleware/error";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("Vehicle API running. Try GET /api/vehicles"));
app.get("/health", (_req, res) => res.json({ok: true, uptime: process.uptime()}));

app.use("/api/vehicles", vehiclesRouter);

app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
