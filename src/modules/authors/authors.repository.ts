import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { Author, CreateAuthorDTO, UpdateAuthorDTO } from './authors.model';

export class AuthorsRepository {
  private get collection() {
    return getDb().collection<Author>('authors');
  }

  async create(data: CreateAuthorDTO): Promise<Author> {
    const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
    const result = await this.collection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc } as any;
  }

  async findAll(): Promise<Author[]> {
    return await this.collection.find().toArray();
  }

  async findById(id: string): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOne({ _id: new ObjectId(id) } as any);
  }

  async update(id: string, data: UpdateAuthorDTO): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const res = await this.collection.deleteOne({ _id: new ObjectId(id) } as any);
    return res.deletedCount > 0;
  }
}