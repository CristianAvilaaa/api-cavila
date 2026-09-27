import { Router } from 'express';
import { BooksController } from './books.controller';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';

const router = Router();
const controller = new BooksController();

router.post('/', asyncHandler(controller.create));
router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getById));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.delete));

export default router;