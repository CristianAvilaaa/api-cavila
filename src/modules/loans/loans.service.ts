import { ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';
import { Loan, CreateLoanDTO, UpdateLoanDTO } from './loans.model';
import { LoansRepository } from './loans.repository';

export class LoansService {
  private repository = new LoansRepository();

  async createLoan(data: CreateLoanDTO): Promise<Loan> {
    if (
      typeof data.bookId !== 'string' ||
      !ObjectId.isValid(data.bookId)
    ) {
      throw new BadRequestError('Debe proporcionar un ID de libro válido.');
    }

    if (typeof data.userName !== 'string' || !data.userName.trim()) {
      throw new BadRequestError('El nombre del usuario es obligatorio.');
    }

    if (
      data.loanDate !== undefined &&
      Number.isNaN(new Date(data.loanDate).getTime())
    ) {
      throw new BadRequestError('La fecha del préstamo no es válida.');
    }

    const books = getDb().collection('books');
    const bookId = new ObjectId(data.bookId);

    // Verificar que el libro exista.
    const book = await books.findOne({ _id: bookId });

    if (!book) {
      throw new NotFoundError('El libro indicado no existe.');
    }

    // Un libro prestado no se puede prestar otra vez.
    if (book.available !== true) {
      throw new BadRequestError('El libro no está disponible para préstamo.');
    }

    // Registrar el préstamo.
    const loan = await this.repository.create({
      bookId: data.bookId,
      userName: data.userName.trim(),
      loanDate: data.loanDate
    });

    // Marcar el libro como no disponible.
    await books.updateOne(
      { _id: bookId },
      { $set: { available: false, updatedAt: new Date() } }
    );

    return loan;
  }

  async getAllLoans(): Promise<Loan[]> {
    return this.repository.findAll();
  }

  async getLoanById(id: string): Promise<Loan> {
    const loan = await this.repository.findById(id);

    if (!loan) {
      throw new NotFoundError('Préstamo no encontrado.');
    }

    return loan;
  }

  async updateLoan(
    id: string,
    data: UpdateLoanDTO
  ): Promise<Loan> {
    const loan = await this.getLoanById(id);
    const update: Partial<Loan> = {};

    if (data.userName !== undefined) {
      if (typeof data.userName !== 'string' || !data.userName.trim()) {
        throw new BadRequestError('El nombre del usuario no puede estar vacío.');
      }

      update.userName = data.userName.trim();
    }

    if (data.returned !== undefined && typeof data.returned !== 'boolean') {
      throw new BadRequestError('El campo returned debe ser verdadero o falso.');
    }

    if (data.returned === true && !loan.returned) {
      update.returned = true;
      update.returnDate = new Date();

      await getDb().collection('books').updateOne(
        { _id: loan.bookId },
        { $set: { available: true, updatedAt: new Date() } }
      );
    }

    const updated = await this.repository.update(id, update);

    if (!updated) {
      throw new NotFoundError('Préstamo no encontrado.');
    }

    return updated;
  }

  async deleteLoan(id: string): Promise<void> {
    const loan = await this.getLoanById(id);

    await this.repository.delete(id);

    // Si se elimina un préstamo activo, liberar el libro.
    if (!loan.returned) {
      await getDb().collection('books').updateOne(
        { _id: loan.bookId },
        { $set: { available: true, updatedAt: new Date() } }
      );
    }
  }
}
