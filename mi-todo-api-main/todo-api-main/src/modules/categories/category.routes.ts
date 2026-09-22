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
