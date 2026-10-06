import { Request, Response } from 'express';
import { AuthorsService } from './authors.service';

export class AuthorsController {
  private service = new AuthorsService();

  create = async (req: Request, res: Response): Promise<void> => {
    const author = await this.service.createAuthor(req.body);
    res.status(201).json(author);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const authors = await this.service.getAllAuthors();
    res.status(200).json(authors);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const author = await this.service.getAuthorById(req.params.id);
    res.status(200).json(author);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const author = await this.service.updateAuthor(req.params.id, req.body);
    res.status(200).json(author);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteAuthor(req.params.id);
    res.status(204).send();
  };

  getBooks = async (req: Request, res: Response): Promise<void> => {
    const books = await this.service.getAuthorBooks(req.params.id);
    res.status(200).json(books);
  };
}