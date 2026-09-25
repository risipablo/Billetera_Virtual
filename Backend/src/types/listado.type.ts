import { Document, Types } from "mongoose";

export interface IListItem {
  text: string;
  completed: boolean;
}

export interface IList extends Document {
  titulo: string;
  fecha: Date;
  descripcion: Types.DocumentArray<IListItem>;
  completed: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
