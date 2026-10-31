import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.user = { id: payload.userId, role: payload.role as Request["user"] extends { role: infer R } ? R : never };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
