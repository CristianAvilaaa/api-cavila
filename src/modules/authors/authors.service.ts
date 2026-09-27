import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDTO, UpdateAuthorDTO, Author } from './authors.model';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { getDb } from '../../config/database';
import { ObjectId } from 'mongodb';

export class AuthorsService {
  private repository = new AuthorsRepository();

  async createAuthor(data: CreateAuthorDTO): Promise<Author> {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new BadRequestError('El nombre del autor es obligatorio y no puede estar vacío.');
    }
    if (!data.nationality || typeof data.nationality !== 'string' || !data.nationality.trim()) {
      throw new BadRequestError('La nacionalidad es obligatoria y no puede estar vacía.');
    }
    if (data.birthYear !== undefined && (!Number.isInteger(data.birthYear) || data.birthYear <= 0)) {
      throw new BadRequestError('El año de nacimiento debe ser un número entero positivo.');
    }

    return await this.repository.create({
      name: data.name.trim(),
      nationality: data.nationality.trim(),
      birthYear: data.birthYear,
    });
  }

  async getAllAuthors(): Promise<Author[]> {
    return await this.repository.findAll();
  }

  async getAuthorById(id: string): Promise<Author> {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new NotFoundError(`Autor con ID '${id}' no encontrado.`);
    }
    return author;
  }

  async updateAuthor(id: string, data: UpdateAuthorDTO): Promise<Author> {
    await this.getAuthorById(id);

    if (data.name !== undefined && (!data.name.trim())) {
      throw new BadRequestError('El nombre del autor no puede estar vacío.');
    }
    if (data.nationality !== undefined && (!data.nationality.trim())) {
      throw new BadRequestError('La nacionalidad no puede estar vacía.');
    }
    if (data.birthYear !== undefined && (!Number.isInteger(data.birthYear) || data.birthYear <= 0)) {
      throw new BadRequestError('El año de nacimiento debe ser un entero positivo.');
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Autor con ID '${id}' no encontrado para actualizar.`);
    }
    return updated;
  }

  async deleteAuthor(id: string): Promise<void> {
    await this.getAuthorById(id);

    // Regla de negocio: Verificar si tiene libros asociados
    const booksCount = await getDb().collection('books').countDocuments({
      authorId: new ObjectId(id)
    });

    if (booksCount > 0) {
      throw new BadRequestError(
        `No se puede eliminar el autor porque tiene ${booksCount} libro(s) asociado(s).`
      );
    }

    await this.repository.delete(id);
  }

  async getAuthorBooks(id: string) {
    await this.getAuthorById(id);
    return await getDb().collection('books').find({ authorId: new ObjectId(id) }).toArray();
  }
}