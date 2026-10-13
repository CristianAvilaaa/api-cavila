import express from 'express';
import apiv1Routes from './api/v1';
import {
  notFound,
  errorHandler
} from './shared/middlewares/errorHandler';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', apiv1Routes);

app.use(notFound);
app.use(errorHandler);
