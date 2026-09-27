import { ObjectId } from 'mongodb';

export interface Loan {
  _id?: ObjectId;
  bookId: ObjectId;
  userName: string;
  loanDate: Date;
  returnDate?: Date;
  returned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLoanDTO {
  bookId: string;
  userName: string;
  loanDate?: string | Date;
}

export interface UpdateLoanDTO {
  returned?: boolean;
  userName?: string;
}