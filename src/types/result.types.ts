export type Result<T, E = Error> = 
  | { ok: true; data: T }
  | { ok: false; error: E };

export type AsyncResult<T> = Promise<
  | { ok: true; data: T }
  | { ok: false; error: DataAccessError }
>;

export class DataAccessError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public originalError?: unknown
  ) {
    super(message);
  }
} 