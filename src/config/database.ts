import { MongoClient, Db } from 'mongodb';
import { env } from './env';

let db: Db;

export const connectDB = async (): Promise<void> => {
  const client = new MongoClient(env.mongoUri!);

  await client.connect();

  db = client.db(env.mongoDBName);

  console.log('Conexión a MongoDB establecida');
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('La base de datos no está conectada.');
  }

  return db;
};
