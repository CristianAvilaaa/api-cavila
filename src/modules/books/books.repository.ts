import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../../config/database';
import { Book, CreateBookDTO, UpdateBookDTO } from './books.model';

export class BooksRepository {
  private get collection(): Collection<Book> {
    return getDb().collection<Book>('books');
  }

  async create(data: CreateBookDTO): Promise<Book> {
    const now = new Date();
    const doc: Book = {
      title: data.title,
      isbn: data.isbn,
      authorId: new ObjectId(data.authorId),
      year: data.year,
      available: true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc };
  }

  async findAll(filter: { available?: boolean }, page = 1, limit = 10): Promise<{ data: Book[]; total: number; page: number; totalPages: number }> {
    const query: any = {};
    if (filter.available !== undefined) {
      query.available = filter.available;
    }

    const skip = (page - 1) * limit;
    const total = await this.collection.countDocuments(query);
    const data = await this.collection.find(query).skip(skip).limit(limit).toArray();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: string): Promise<Book | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    return await this.collection.findOne({ isbn });
  }

  async update(id: string, data: Partial<Book>): Promise<Book | null> {
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