import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { requireRoles } from "../middleware/role.middleware";
import { odooStatus } from "../integrations/odoo/odoo.client";

const router = Router();
router.use(authenticate, requireRoles(Role.ADMIN, Role.STAFF));
router.get("/status", async (_req, res) => res.json({ success: true, message: "Odoo status retrieved", data: await odooStatus() }));
router.post("/sync/customers", (_req, res) => res.status(501).json({ success: false, message: "Customer synchronization requires configured Odoo API access" }));
router.post("/sync/products", (_req, res) => res.status(501).json({ success: false, message: "Product synchronization requires configured Odoo API access" }));
export default router;
