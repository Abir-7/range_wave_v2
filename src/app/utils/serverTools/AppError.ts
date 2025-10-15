export class AppError extends Error {
  public status_code: number;
  public is_operational: boolean;

  constructor(message: string, status_code = 500) {
    super(message);
    this.status_code = status_code;
    this.is_operational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
