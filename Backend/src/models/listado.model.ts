import mongoose, { Model, Schema } from "mongoose";
import { IList, IListItem } from "../types/listado.type";


const ListItemSchema = new Schema<IListItem>({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  _id: false
});

const ListSchema = new Schema<IList>({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  descripcion: {
    type: [ListItemSchema],
    default: []
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

export const ListModel: Model<IList> = mongoose.model<IList>('List', ListSchema);