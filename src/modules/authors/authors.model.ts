import { ObjectId } from 'mongodb';

export interface Author {
  _id?: ObjectId;
  name: string;
  nationality: string;
  birthYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAuthorDTO {
  name: string;
  nationality: string;
  birthYear?: number;
}

export interface UpdateAuthorDTO {
  name?: string;
  nationality?: string;
  birthYear?: number;
}