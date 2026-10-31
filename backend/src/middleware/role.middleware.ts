import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";

export const requireRoles = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Insufficient permissions" });
  }
  return next();
};
