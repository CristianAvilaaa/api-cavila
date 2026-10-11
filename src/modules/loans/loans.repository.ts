import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { Loan, CreateLoanDTO } from './loans.model';

export class LoansRepository {
  private get collection() {
    return getDb().collection<Loan>('loans');
  }

  async create(data: CreateLoanDTO): Promise<Loan> {
    const now = new Date();

    const loan = {
      bookId: new ObjectId(data.bookId),
      userName: data.userName,
      loanDate: data.loanDate
        ? new Date(data.loanDate)
        : now,
      returned: false,
      createdAt: now,
      updatedAt: now
    };

    const result = await this.collection.insertOne(loan as Loan);

    return {
      ...loan,
      _id: result.insertedId
    };
  }

  async findAll(): Promise<Loan[]> {
    return this.collection.find().toArray();
  }

  async findById(id: string): Promise<Loan | null> {
    if (!ObjectId.isValid(id)) return null;

    return this.collection.findOne({
      _id: new ObjectId(id)
    } as any);
  }

  async update(
    id: string,
    data: Partial<Loan>
  ): Promise<Loan | null> {
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
