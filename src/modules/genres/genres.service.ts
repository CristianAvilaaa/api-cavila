import { GenreRepository } from './genres.repository';
import { CreateGenreDTO, UpdateGenreDTO } from './genres.interface';

export class GenreService {
  static async getAllGenres() {
    return await GenreRepository.findAll();
  }

  static async getGenreById(id: string) {
    const genre = await GenreRepository.findById(id);
    if (!genre) {
      throw { status: 404, message: 'Género no encontrado' };
    }
    return genre;
  }

  static async createGenre(data: CreateGenreDTO) {
    return await GenreRepository.create(data);
  }

  static async updateGenre(id: string, data: UpdateGenreDTO) {
    const updated = await GenreRepository.update(id, data);
    if (!updated) {
      throw { status: 404, message: 'Género no encontrado para actualizar' };
    }
    return updated;
  }

  static async deleteGenre(id: string) {
    const deleted = await GenreRepository.delete(id);
    if (!deleted) {
      throw { status: 404, message: 'Género no encontrado para eliminar' };
    }
    return { message: 'Género eliminado exitosamente' };
  }
}