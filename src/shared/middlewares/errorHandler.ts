import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // ID inválido de MongoDB
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'El formato del ID es inválido' });
  }

  // ISBN o llave duplicada
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Ya existe un registro con ese valor único (ej. ISBN)' });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // Error no controlado
  res.status(500).json({ message: 'Error interno del servidor' });
};