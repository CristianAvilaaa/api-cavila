import { Request, Response } from "express";
import { CategoryService } from "./category.service";

export class CategoryController {

    private readonly CategoryService = new CategoryService();

    create = async (req: Request, res: Response): Promise<void> => {
        const category = await this.CategoryService.create(req.body);
        res.status(201).json(category);
    };

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const category = await this.CategoryService.findAll();
        res.status(200).json(category);
    };

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.CategoryService.findById(req.params.id);
        res.status(200).json(category);
    };

    update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.CategoryService.update(req.params.id, req.body);
        res.status(200).json(category);
    };

    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        await this.CategoryService.delete(req.params.id);
        res.status(204).send();
    };
}
