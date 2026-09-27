import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../../config/database';
import { Author, CreateAuthorDTO, UpdateAuthorDTO } from './authors.model';

export class AuthorsRepository {
  private get collection(): Collection<Author> {
    return getDb().collection<Author>('authors');
  }

  async create(data: CreateAuthorDTO): Promise<Author> {
    const now = new Date();
    const doc: Author = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc };
  }

  async findAll(): Promise<Author[]> {
    return await this.collection.find().toArray();
  }

  async findById(id: string): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async update(id: string, data: UpdateAuthorDTO): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}