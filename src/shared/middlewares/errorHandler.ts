import { Request, Response, NextFunction } from 'express';

// Middleware para rutas no encontradas (404)
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ message: `Ruta no encontrada - ${req.originalUrl}` });
};

// Middleware para manejo global de errores
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  // ID inválido de MongoDB
  if (err.name === 'CastError') {
    res.status(400).json({ message: 'El formato del ID es inválido' });
    return;
  }

  // ISBN o llave duplicada
  if (err.code === 11000) {
    res.status(400).json({ message: 'Ya existe un registro con ese valor único (ej. ISBN)' });
    return;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message });
    return;
  }

  // Error no controlado
  res.status(500).json({ message: 'Error interno del servidor' });
};