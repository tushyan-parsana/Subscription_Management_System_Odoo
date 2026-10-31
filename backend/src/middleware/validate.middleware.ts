import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) {
    return res.status(400).json({ success: false, message: "Validation failed", errors: result.error.issues });
  }
  req.body = (result.data as { body: unknown }).body;
  return next();
};
