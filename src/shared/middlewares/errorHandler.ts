import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const notFound = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
};

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message
    });
    return;
  }

  if (error?.code === 11000) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Ya existe un registro con ese valor único.'
    });
    return;
  }

  console.error('Error del servidor:', error);

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error inesperado en el servidor.'
  });
};
