
import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { Author, CreateAuthorDTO, UpdateAuthorDTO } from './authors.model';
import { AuthorsRepository } from './authors.repository';

export class AuthorsService {
  private repository = new AuthorsRepository();

  async createAuthor(data: CreateAuthorDTO): Promise<Author> {
    if (typeof data.name !== 'string' || !data.name.trim()) {
      throw new BadRequestError('El nombre del autor es obligatorio.');
    }
    if (typeof data.nationality !== 'string' || !data.nationality.trim()) {
      throw new BadRequestError('La nacionalidad es obligatoria.');
    }
    if (data.birthYear !== undefined && (!Number.isInteger(data.birthYear) || data.birthYear <= 0)) {
      throw new BadRequestError('El año de nacimiento debe ser un entero positivo.');
    }

    return this.repository.create({
      name: data.name.trim(),
      nationality: data.nationality.trim(),
      birthYear: data.birthYear
    });
  }

  async getAllAuthors(): Promise<Author[]> {
    return this.repository.findAll();
  }

  async getAuthorById(id: string): Promise<Author> {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new NotFoundError('Autor no encontrado.');
    }
    return author;
  }

  async updateAuthor(id: string, data: UpdateAuthorDTO): Promise<Author> {
    await this.getAuthorById(id);

    if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim())) {
      throw new BadRequestError('El nombre no puede estar vacío.');
    }
    if (data.nationality !== undefined &&(typeof data.nationality !== 'string' || !data.nationality.trim())) {
      throw new BadRequestError('La nacionalidad no puede estar vacía.');
    }
    if (data.birthYear !== undefined && (!Number.isInteger(data.birthYear) || data.birthYear <= 0)) {
      throw new BadRequestError('El año de nacimiento debe ser un entero positivo.');
    }

    const update: UpdateAuthorDTO = {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.nationality !== undefined
        ? { nationality: data.nationality.trim() }
        : {}),
      ...(data.birthYear !== undefined
        ? { birthYear: data.birthYear }
        : {})
    }; 

    const author = await this.repository.update(id, update);

    if (!author) {
      throw new NotFoundError('Autor no encontrado.');
    }

    return author;
  }

  async deleteAuthor(id: string): Promise<void> {
    await this.getAuthorById(id);
    const booksCount = await getDb().collection('books').countDocuments({ 
      authorId: new ObjectId(id) 
    });

    if (booksCount > 0) {
      throw new BadRequestError(
        'No se puede eliminar el autor porque tiene ${booksCount} libro(s) asociado(s).'
      );
    }

    await this.repository.delete(id);
  }
}
