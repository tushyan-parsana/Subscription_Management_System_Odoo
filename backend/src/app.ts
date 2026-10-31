import express from "express";
import cors from "cors";
import prisma from "./config/database";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import coreRoutes from "./modules/core.routes";
import odooRoutes from "./modules/odoo.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "1mb" }));
app.get("/", (_req, res) => res.json({ success: true, message: "Brightloop API is running", data: null }));
app.get("/api/health", (_req, res) => res.json({ success: true, message: "Healthy", data: { service: "Brightloop Backend" } }));
app.get("/api/health/db", async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; return res.json({ success: true, message: "Database connected", data: null }); }
  catch { return res.status(503).json({ success: false, message: "Database unavailable" }); }
});
app.use("/api/auth", authRoutes);
app.use("/api", coreRoutes);
app.use("/api/odoo", odooRoutes);
app.use(errorHandler);
export default app;
