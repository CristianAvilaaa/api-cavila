
import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { Book, CreateBookDTO, UpdateBookDTO } from './books.model';
import { BooksRepository } from './books.repository';

export class BooksService {
  private repository = new BooksRepository();

  private async validateAuthor(authorId: string): Promise<void> {
    if (!ObjectId.isValid(authorId)) {throw new BadRequestError('El ID del autor no es válido.');
    }
    const author = await getDb().collection('authors').findOne({
      _id: new ObjectId(authorId)
    });
    if (!author) {throw new NotFoundError('El autor indicado no existe.');
    }
  }

  async createBook(data: CreateBookDTO): Promise<Book> {
    if (typeof data.title !== 'string' || !data.title.trim()) {throw new BadRequestError('El título es obligatorio.');
    }
    if (typeof data.isbn !== 'string' || !data.isbn.trim()) {throw new BadRequestError('El ISBN es obligatorio.');
    }
    if (typeof data.authorId !== 'string' || !data.authorId) {throw new BadRequestError('El autor es obligatorio.');
    }
    if (
      data.year !== undefined &&
      (!Number.isInteger(data.year) || data.year <= 0)
    ) {
      throw new BadRequestError('El año debe ser un entero positivo.');
    }

    await this.validateAuthor(data.authorId);

    const isbn = data.isbn.trim();
    const existingBook = await this.repository.findByIsbn(isbn);

    if (existingBook) {throw new BadRequestError('Ya existe un libro con ese ISBN.');
    }
    return this.repository.create({
      title: data.title.trim(),
      isbn,
      authorId: data.authorId,
      year: data.year
    });
  }

  async getAllBooks(): Promise<Book[]> {
    return this.repository.findAll();
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.repository.findById(id);

    if (!book) {throw new NotFoundError('Libro no encontrado.');
    }

    return book;
  }

  async updateBook(
    id: string,
    data: UpdateBookDTO
  ): Promise<Book> {
    await this.getBookById(id);

    const update: Partial<Book> = {};

    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || !data.title.trim()) {
        throw new BadRequestError('El título no puede estar vacío.');
      }

      update.title = data.title.trim();
    }

    if (data.isbn !== undefined) {
      if (typeof data.isbn !== 'string' || !data.isbn.trim()) {
        throw new BadRequestError('El ISBN no puede estar vacío.');
      }

      const isbn = data.isbn.trim();
      const existingBook = await this.repository.findByIsbn(isbn);

      if (existingBook && existingBook._id?.toString() !== id) {
        throw new BadRequestError('Ese ISBN ya pertenece a otro libro.');
      }

      update.isbn = isbn;
    }

    if (data.authorId !== undefined) {
      if (typeof data.authorId !== 'string') {
        throw new BadRequestError('El ID del autor debe ser texto.');
      }

      await this.validateAuthor(data.authorId);
      update.authorId = new ObjectId(data.authorId);
    }

    if (
      data.year !== undefined &&
      (!Number.isInteger(data.year) || data.year <= 0)
    ) {
      throw new BadRequestError('El año debe ser un entero positivo.');
    }

    if (data.year !== undefined) {
      update.year = data.year;
    }

    if (data.available !== undefined) {
      if (typeof data.available !== 'boolean') {
        throw new BadRequestError('La disponibilidad debe ser verdadera o falsa.');
      }

      update.available = data.available;
    }

    const updated = await this.repository.update(id, update);

    if (!updated) {
      throw new NotFoundError('Libro no encontrado.');
    }

    return updated;
  }

  async deleteBook(id: string): Promise<void> {
    const book = await this.getBookById(id);

    const activeLoan = await getDb().collection('loans').findOne({
      bookId: book._id,
      returned: false
    });

    if (activeLoan) {
      throw new BadRequestError(
        'No se puede eliminar un libro que tiene un préstamo activo.'
      );
    }

    await this.repository.delete(id);
  }
}
