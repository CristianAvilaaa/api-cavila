import { Router } from 'express';
import authorsRoutes from '../../modules/authors/authors.routes';
import booksRoutes from '../../modules/books/books.routes';
import loansRoutes from '../../modules/loans/loans.routes';
import genreRoutes from '../../modules/genres/genres.routes';

const apiV1Router = Router();

apiV1Router.use('/authors', authorsRoutes);
apiV1Router.use('/books', booksRoutes);
apiV1Router.use('/loans', loansRoutes);
router.use('/genres', genreRoutes);

export default apiV1Router;
