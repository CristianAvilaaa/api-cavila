import { Router } from "express";
import { CategoryController } from "./category.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
const CategoryController = new CategoryController();

router.post("/", asyncHandler(CategoryController.create));
router.get("/", asyncHandler(CategoryController.findAll));
router.get("/:id", asyncHandler(CategoryController.findById));
router.put("/:id", asyncHandler(CategoryController.update));
router.delete("/:id", asyncHandler(CategoryController.delete));

export default router;
/*
Las Routes reciben las peticiones HTTP.   
El Controller maneja la respuesta y los códigos de estado HTTP (200, 201, 204).   
El Service aplica las validaciones y reglas del negocio.   
El Repository centraliza las consultas a la base de datos para que el Service no dependa de Mongoose.   
El Model estructura la colección en MongoDB Atlas con Mongoose."
*/ 