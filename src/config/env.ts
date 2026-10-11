import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI,
  mongoDBName: process.env.MONGO_DB_NAME || 'biblioteca'
};

if (!env.mongoUri) {
  throw new Error('Debes configurar MONGO_URI en el archivo .env');
}
