export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
