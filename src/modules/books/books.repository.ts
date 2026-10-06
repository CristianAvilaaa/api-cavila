import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { Book, CreateBookDTO } from './books.model';

export class BooksRepository {
  private get collection() {
    return getDb().collection<Book>('books');
  }

  async create(data: CreateBookDTO): Promise<Book> {
    const doc = {
      ...data,
      authorId: new ObjectId(data.authorId),
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.collection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc } as any;
  }

  async findAll(filter: { available?: boolean } = {}): Promise<Book[]> {
    const query = filter.available !== undefined ? { available: filter.available } : {};
    return await this.collection.find(query).toArray();
  }

  async findById(id: string): Promise<Book | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOne({ _id: new ObjectId(id) } as any);
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    return await this.collection.findOne({ isbn } as any);
  }

  async update(id: string, data: Partial<Book>): Promise<Book | null> {
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