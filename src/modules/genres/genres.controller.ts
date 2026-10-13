import { Request, Response } from 'express';
import { GenreService } from './genres.service';

export class GenreController {
  static async getAll(req: Request, res: Response) {
    const genres = await GenreService.getAllGenres();
    res.status(200).json(genres);
  }

  static async getById(req: Request, res: Response) {
    const genre = await GenreService.getGenreById(req.params.id);
    res.status(200).json(genre);
  }

  static async create(req: Request, res: Response) {
    const newGenre = await GenreService.createGenre(req.body);
    res.status(201).json(newGenre);
  }

  static async update(req: Request, res: Response) {
    const updatedGenre = await GenreService.updateGenre(req.params.id, req.body);
    res.status(200).json(updatedGenre);
  }

  static async delete(req: Request, res: Response) {
    const response = await GenreService.deleteGenre(req.params.id);
    res.status(200).json(response);
  }
}