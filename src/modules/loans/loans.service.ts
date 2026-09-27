import { LoansRepository } from './loans.repository';
import { CreateLoanDTO, UpdateLoanDTO, Loan } from './loans.model';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { getDb } from '../../config/database';
import { ObjectId } from 'mongodb';

export class LoansService {
  private repository = new LoansRepository();

  async createLoan(data: CreateLoanDTO): Promise<Loan> {
    if (!data.bookId || !ObjectId.isValid(data.bookId)) {
      throw new BadRequestError('Debe proporcionar un bookId válido.');
    }
    if (!data.userName || typeof data.userName !== 'string' || !data.userName.trim()) {
      throw new BadRequestError('El nombre del usuario es obligatorio.');
    }

    const booksCollection = getDb().collection('books');
    const book = await booksCollection.findOne({ _id: new ObjectId(data.bookId) });

    if (!book) {
      throw new NotFoundError(`No existe ningún libro registrado con el ID '${data.bookId}'.`);
    }

    // Regla de negocio: El libro debe estar disponible
    if (!book.available) {
      throw new BadRequestError('El libro no está disponible para préstamo.');
    }

    // Crear el préstamo
    const loan = await this.repository.create({
      bookId: data.bookId,
      userName: data.userName.trim(),
      loanDate: data.loanDate,
    });

    // Actualizar estado del libro a disponible: false
    await booksCollection.updateOne(
      { _id: new ObjectId(data.bookId) },
      { $set: { available: false, updatedAt: new Date() } }
    );

    return loan;
  }

  async getAllLoans(returnedStr?: string): Promise<Loan[]> {
    let returned: boolean | undefined = undefined;
    if (returnedStr !== undefined) {
      returned = returnedStr === 'true';
    }
    return await this.repository.findAll({ returned });
  }

  async getLoanById(id: string): Promise<Loan> {
    const loan = await this.repository.findById(id);
    if (!loan) {
      throw new NotFoundError(`Préstamo con ID '${id}' no encontrado.`);
    }
    return loan;
  }

  async updateLoan(id: string, data: UpdateLoanDTO): Promise<Loan> {
    const existingLoan = await this.getLoanById(id);

    const updatePayload: Partial<Loan> = {};

    if (data.userName !== undefined) {
      if (!data.userName.trim()) throw new BadRequestError('El nombre del usuario no puede estar vacío.');
      updatePayload.userName = data.userName.trim();
    }

    // Regla de negocio: Devolución de préstamo
    if (data.returned === true && !existingLoan.returned) {
      updatePayload.returned = true;
      updatePayload.returnDate = new Date();

      // Marcar libro como disponible
      await getDb().collection('books').updateOne(
        { _id: existingLoan.bookId },
        { $set: { available: true, updatedAt: new Date() } }
      );
    }

    const updated = await this.repository.update(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`Préstamo con ID '${id}' no encontrado.`);
    }
    return updated;
  }

  async deleteLoan(id: string): Promise<void> {
    await this.getLoanById(id);
    await this.repository.delete(id);
  }
}