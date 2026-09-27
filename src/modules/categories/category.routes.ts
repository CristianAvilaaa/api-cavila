import { Router } from "express";
import { CategoryController } from "./category.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
const categoryController = new CategoryController();

router.post("/", asyncHandler(categoryController.create));
router.get("/", asyncHandler(categoryController.findAll));
router.get("/:id", asyncHandler(categoryController.findById));
router.put("/:id", asyncHandler(categoryController.update));
router.delete("/:id", asyncHandler(categoryController.delete));

export default router;
/*
Las Routes reciben las peticiones HTTP.   
El Controller maneja la respuesta y los códigos de estado HTTP (200, 201, 204).   
El Service aplica las validaciones y reglas del negocio.   
El Repository centraliza las consultas a la base de datos para que el Service no dependa de Mongoose.   
El Model estructura la colección en MongoDB Atlas con Mongoose."
*/ 