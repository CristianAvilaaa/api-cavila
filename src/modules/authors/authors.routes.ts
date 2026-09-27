import { Router } from 'express';
import { AuthorsController } from './authors.controller';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';

const router = Router();
const controller = new AuthorsController();

router.post('/', asyncHandler(controller.create));
router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getById));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.delete));
router.get('/:id/books', asyncHandler(controller.getBooks));

export default router;