import { Document } from "mongoose";

export type PostUser = {
  name: string;
  email: string;
  password: string;
};

export type GetUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const UserProjection = {
  name: 1,
  email: 1,
  createdAt: 1,
  updatedAt: 1,
};

export type LoginUser = {
  email: string;
  password: string;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
