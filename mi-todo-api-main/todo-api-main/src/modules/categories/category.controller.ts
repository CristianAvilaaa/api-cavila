import { Request, Response } from "express"; // Importa los tipos Request (petición) y Response (respuesta) desde Express
import { CategoryService } from "./category.service"; // Importa la clase CategoryService que contiene la lógica de negocio 

export class CategoryController {

    private readonly CategoryService = new CategoryService(); // Instancia privada 

    create = async (req: Request, res: Response): Promise<void> => {
        const category = await this.CategoryService.create(req.body);
        res.status(201).json(category);
    }; // Toma los datos de la solicitud (req.body), llama al método create del servicio y devuelve la categoría creada con un estado 201 (creado).

    findAll = async (_req: Request, res: Response): Promise<void> => {
        const category = await this.CategoryService.findAll();
        res.status(200).json(category);
    }; // Consulta todas las categorías llamando al método findAll del servicio y devuelve la lista con un estado 200 (OK).

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.CategoryService.findById(req.params.id);
        res.status(200).json(category);
    }; // Busca una categoría específica por su ID, y devuelve la categoría encontrada con un estado 200 (OK).

    update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const category = await this.CategoryService.update(req.params.id, req.body);
        res.status(200).json(category);
    }; /* Actualiza una categoría existente, tomando el ID de la solicitud y los datos del cuerpo, 
         llamando al método update del servicio y devuelve la categoría actualizada con un estado 200 (OK).*/

    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        await this.CategoryService.delete(req.params.id);
        res.status(204).send();
    }; /* Elimina una categoría específica por su ID, llamando al método delete del servicio y 
    devuelve un estado 204 (sin contenido) para indicar que la operación fue exitosa.*/
}
