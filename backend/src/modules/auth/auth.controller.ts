import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { z } from "zod";
import prisma from "../../config/database";
import { env } from "../../config/env";

const password = z.string().min(9).regex(/[A-Z]/, "must contain uppercase").regex(/[a-z]/, "must contain lowercase").regex(/[^A-Za-z0-9]/, "must contain special character");
const credentials = z.object({ email: z.string().email().transform((v) => v.toLowerCase()), password });

const publicUser = (user: { id: string; name: string; email: string; role: string }) => ({
  id: user.id, name: user.name, email: user.email, role: user.role,
});

export async function register(req: Request, res: Response) {
  const parsed = z.object({ name: z.string().min(2), email: z.string().email(), password }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  const { name, email, password: rawPassword } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return res.status(409).json({ success: false, message: "Email already registered" });
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash: await bcrypt.hash(rawPassword, 12) },
    select: { id: true, name: true, email: true, role: true },
  });
  await prisma.customer.create({ data: { name, email: user.email, userId: user.id } });
  return res.status(201).json({ success: true, message: "Registration successful", data: { user: publicUser(user) } });
}

export async function login(req: Request, res: Response) {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Invalid login details" });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, { expiresIn: "1d" });
  return res.json({ success: true, message: "Login successful", data: { token, user: publicUser(user) } });
}

export async function forgotPassword(req: Request, res: Response) {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Valid email is required" });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({ where: { id: user.id }, data: { resetTokenHash: crypto.createHash("sha256").update(token).digest("hex"), resetTokenUntil: new Date(Date.now() + 3600000) } });
    console.info(`Password reset token generated for ${user.email}: ${token}`);
  }
  return res.json({ success: true, message: "If the account exists, reset instructions have been sent" });
}

export async function resetPassword(req: Request, res: Response) {
  const parsed = z.object({ token: z.string().min(1), password }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  const hash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const user = await prisma.user.findFirst({ where: { resetTokenHash: hash, resetTokenUntil: { gt: new Date() } } });
  if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12), resetTokenHash: null, resetTokenUntil: null } });
  return res.json({ success: true, message: "Password reset successful" });
}
