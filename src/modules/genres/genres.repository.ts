import { GenreModel } from './genres.model';
import { CreateGenreDTO, UpdateGenreDTO } from './genres.interface';

export class GenreRepository {
  static async findAll() {
    return await GenreModel.find();
  }

  static async findById(id: string) {
    return await GenreModel.findById(id);
  }

  static async create(data: CreateGenreDTO) {
    return await GenreModel.create(data);
  }

  static async update(id: string, data: UpdateGenreDTO) {
    return await GenreModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string) {
    return await GenreModel.findByIdAndDelete(id);
  }
}