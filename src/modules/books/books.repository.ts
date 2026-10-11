import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { Book, CreateBookDTO } from './books.model';

export class BooksRepository {
  private get collection() {
    return getDb().collection<Book>('books');
  }

  async create(data: CreateBookDTO): Promise<Book> {
    const now = new Date();

    const book = {
      title: data.title,
      isbn: data.isbn,
      authorId: new ObjectId(data.authorId),
      year: data.year,
      available: true,
      createdAt: now,
      updatedAt: now
    };

    const result = await this.collection.insertOne(book as Book);

    return {
      ...book,
      _id: result.insertedId
    };
  }

  async findAll(): Promise<Book[]> {
    return this.collection.find().toArray();
  }

  async findById(id: string): Promise<Book | null> {
    if (!ObjectId.isValid(id)) return null;

    return this.collection.findOne({
      _id: new ObjectId(id)
    } as any);
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    return this.collection.findOne({ isbn } as any);
  }

  async update(
    id: string,
    data: Partial<Book>
  ): Promise<Book | null> {
    if (!ObjectId.isValid(id)) return null;

    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...data, updatedAt: new Date() } },
      {
        returnDocument: 'after',
        includeResultMetadata: false
      }
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const result = await this.collection.deleteOne({
      _id: new ObjectId(id)
    } as any);

    return result.deletedCount > 0;
  }
}
