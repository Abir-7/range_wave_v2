import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/serverTools/AppError";
import { logger } from "../../utils/serverTools/logger";
import { ZodError } from "zod";
import { DrizzleError } from "drizzle-orm";
import { DrizzleQueryError } from "drizzle-orm";

export const globalErrorHandler = (
  err: unknown, // accept anything thrown
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let status_code = 500;
  let message = "Internal Server Error";
  let errors: { path: string; message: string }[] = [];

  // Handle AppError
  if (err instanceof AppError) {
    status_code = err.status_code;
    message = err.message;
    errors.push({ path: "", message: err.message });
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    status_code = 400;
    message = "Validation Error";
    errors = err.issues.map((issue) => ({
      path: issue.path.join(".") || "",
      message: issue.message,
    }));
  } else if (err instanceof DrizzleQueryError) {
    const pgError = err.cause as any;
    console.log(pgError?.code);
    switch (pgError?.code) {
      case "23505": {
        // duplicate key error
        const fieldMsg = parsePostgresError(pgError.detail);
        status_code = 400;
        message = fieldMsg || "Duplicate entry already exists.";
        break;
      }
      case "23503":
        status_code = 400;
        message = "Invalid reference — foreign key constraint failed.";
        break;
      case "23502":
        status_code = 400;
        message = "Missing required field.";
        break;

      default:
        message = pgError?.message || "Database query failed.";
        break;
    }
    errors.push({ path: "", message: message || message });
  }
  // Handle any other Error instance
  else if (err instanceof Error) {
    console.log("hit2");
    message = err.message || message;
    errors.push({ path: "", message: err.message || message });
  }
  // Handle unknown non-Error throwables
  else {
    message = "Something went wrong. Try again.";
    errors.push({ path: "", message: String(err) || message });
  }

  // Send structured response
  res.status(status_code).json({
    success: false,
    status_code: status_code,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" &&
      err instanceof Error && { stack: err.stack }),
  });
};

export const parsePostgresError = (detail?: string): string | null => {
  if (!detail) return null;

  // Example: Key (email)=(abir@gmail.com) already exists.
  const match = detail.match(/\((.*?)\)=/);
  if (match && match[1]) {
    return `${match[1]} already exists`;
  }

  return detail; // fallback
};
