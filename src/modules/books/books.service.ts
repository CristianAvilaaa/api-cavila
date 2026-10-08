import { BooksRepository } from './books.repository';
import { CreateBookDTO, UpdateBookDTO, Book, BookFilterQuery } from './books.model';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { getDb } from '../../config/database';
import { ObjectId } from 'mongodb';

export class BooksService {
  private repository = new BooksRepository();

  private async validateAuthorExists(authorId: string): Promise<void> {
    if (!ObjectId.isValid(authorId)) {
      throw new BadRequestError('El ID del autor proporcionado no es un ObjectId válido.');
    }
    const author = await getDb().collection('authors').findOne({ _id: new ObjectId(authorId) });
    if (!author) {
      throw new NotFoundError(`No existe ningún autor registrado con el ID '${authorId}'.`);
    }
  }

  async createBook(data: CreateBookDTO): Promise<Book> {
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw new BadRequestError('El título del libro es obligatorio.');
    }
    if (!data.isbn || typeof data.isbn !== 'string' || !data.isbn.trim()) {
      throw new BadRequestError('El ISBN es obligatorio.');
    }
    if (!data.authorId) {
      throw new BadRequestError('El authorId es obligatorio.');
    }

    await this.validateAuthorExists(data.authorId);

    const existingIsbn = await this.repository.findByIsbn(data.isbn.trim());
    if (existingIsbn) {
      throw new BadRequestError(`Ya existe un libro registrado con el ISBN '${data.isbn}'.`);
    }

    return await this.repository.create({
      title: data.title.trim(),
      isbn: data.isbn.trim(),
      authorId: data.authorId,
      year: data.year,
    });
  }

  async getAllBooks(query: BookFilterQuery) {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;

    let available: boolean | undefined = undefined;
    if (query.available !== undefined) {
      available = query.available === 'true';
    }

    return await this.repository.findAll({ available, page, limit } as any);
  }
  async getBookById(id: string): Promise<Book> {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new NotFoundError(`Libro con ID '${id}' no encontrado.`);
    }
    return book;
  }

  async updateBook(id: string, data: UpdateBookDTO): Promise<Book> {
    await this.getBookById(id);

    const updatePayload: Partial<Book> = {};

    if (data.title !== undefined) {
      if (!data.title.trim()) throw new BadRequestError('El título no puede estar vacío.');
      updatePayload.title = data.title.trim();
    }

    if (data.isbn !== undefined) {
      if (!data.isbn.trim()) throw new BadRequestError('El ISBN no puede estar vacío.');
      const existing = await this.repository.findByIsbn(data.isbn.trim());
      if (existing && existing._id?.toString() !== id) {
        throw new BadRequestError(`El ISBN '${data.isbn}' ya pertenece a otro libro.`);
      }
      updatePayload.isbn = data.isbn.trim();
    }

    if (data.authorId !== undefined) {
      await this.validateAuthorExists(data.authorId);
      updatePayload.authorId = new ObjectId(data.authorId);
    }

    if (data.year !== undefined) updatePayload.year = data.year;
    if (data.available !== undefined) updatePayload.available = data.available;

    const updated = await this.repository.update(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`Libro con ID '${id}' no encontrado.`);
    }
    return updated;
  }

  async deleteBook(id: string): Promise<void> {
    await this.getBookById(id);
    await this.repository.delete(id);
  }
}