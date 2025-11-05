import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

/**
 * Generic Zod validator middleware
 * @param schema Zod schema to validate request body
 */
export const validator = <T>(schema: ZodType<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body); // validated & typed
      next();
    } catch (err) {
      next(err); // forward to global error handler
    }
  };
};
