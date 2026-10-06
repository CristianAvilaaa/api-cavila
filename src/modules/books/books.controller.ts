import { Request, Response } from 'express';
import { BooksService } from './books.service';

export class BooksController {
  private service = new BooksService();

  create = async (req: Request, res: Response): Promise<void> => {
    const book = await this.service.createBook(req.body);
    res.status(201).json(book);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.getAllBooks(req.query);
    res.status(200).json(result);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const book = await this.service.getBookById(req.params.id);
    res.status(200).json(book);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const book = await this.service.updateBook(req.params.id, req.body);
    res.status(200).json(book);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteBook(req.params.id);
    res.status(204).send();
  };
}