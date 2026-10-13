import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../../config/database';
import { Genre, CreateGenreDTO, UpdateGenreDTO } from './genres.model';

export class GenreRepository {
  private static get collection(): Collection<Genre> {
    return getDb().collection<Genre>('genres');
  }

  static async create(data: CreateGenreDTO): Promise<Genre> {
    const now = new Date();
    const doc: Genre = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc };
  }

  static async findAll(): Promise<Genre[]> {
    return await this.collection.find().toArray();
  }

  static async findById(id: string): Promise<Genre | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, data: UpdateGenreDTO): Promise<Genre | null> {
    if (!ObjectId.isValid(id)) return null;
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  static async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}