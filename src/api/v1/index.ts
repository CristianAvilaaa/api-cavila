import { Router } from 'express';
import authorsRoutes from '../../modules/authors/authors.routes';
import booksRoutes from '../../modules/books/books.routes';
import loansRoutes from '../../modules/loans/loans.routes';

const apiV1Router = Router();

apiV1Router.use('/authors', authorsRoutes);
apiV1Router.use('/books', booksRoutes);
apiV1Router.use('/loans', loansRoutes);

export default apiV1Router;