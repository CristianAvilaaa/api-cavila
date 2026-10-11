import { Request, Response } from 'express';
import { LoansService } from './loans.service';

export class LoansController {
  private service = new LoansService();

  create = async (req: Request, res: Response): Promise<void> => {
    const loan = await this.service.createLoan(req.body);
    res.status(201).json(loan);
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const loans = await this.service.getAllLoans();
    res.status(200).json(loans);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const loan = await this.service.getLoanById(req.params.id);
    res.status(200).json(loan);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const loan = await this.service.updateLoan(req.params.id, req.body);
    res.status(200).json(loan);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteLoan(req.params.id);
    res.status(204).send();
  };
}
