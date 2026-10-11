import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import {Author, CreateAuthorDTO, UpdateAuthorDTO} from './authors.model';

export class AuthorsRepository {
  private get collection() {
    return getDb().collection<Author>('authors');
  }

  async create(data: CreateAuthorDTO): Promise<Author> {
    const now = new Date();
    const author = {...data, createdAt: now, updatedAt: now};
    const result = await this.collection.insertOne(author as Author);
    return {...author, _id: result.insertedId};
  }

  async findAll(): Promise<Author[]> {
    return this.collection.find().toArray();
  }

  async findById(id: string): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({_id: new ObjectId(id)} as any);
  }

  async update(id: string, data: UpdateAuthorDTO): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...data, updatedAt: new Date() } },
      {returnDocument: 'after',includeResultMetadata: false}
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({_id: new ObjectId(id)} as any);
    return result.deletedCount > 0;
  }
}