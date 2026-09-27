import { ObjectId, Collection } from 'mongodb';
import { getDb } from '../../config/database';
import { Loan, CreateLoanDTO } from './loans.model';

export class LoansRepository {
  private get collection(): Collection<Loan> {
    return getDb().collection<Loan>('loans');
  }

  async create(data: CreateLoanDTO): Promise<Loan> {
    const now = new Date();
    const doc: Loan = {
      bookId: new ObjectId(data.bookId),
      userName: data.userName,
      loanDate: data.loanDate ? new Date(data.loanDate) : now,
      returned: false,
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.collection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc };
  }

  async findAll(filter: { returned?: boolean }): Promise<Loan[]> {
    const query: any = {};
    if (filter.returned !== undefined) {
      query.returned = filter.returned;
    }
    return await this.collection.find(query).toArray();
  }

  async findById(id: string): Promise<Loan | null> {
    if (!ObjectId.isValid(id)) return null;
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async update(id: string, data: Partial<Loan>): Promise<Loan | null> {
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