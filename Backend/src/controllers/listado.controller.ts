import { Request, Response } from 'express';
import { ListModel } from '../models/listado.model';
import { IListItem } from '../types/listado.type';



export const getList = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const list = await ListModel.find({ userId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addList = async (req: Request, res: Response): Promise<void> => {
  const { titulo, fecha } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!titulo || !fecha) {
    res.status(400).json({ error: 'Todos los campos son requeridos' });
    return;
  }

  try {
    const newList = new ListModel({
      titulo,
      fecha,
      userId
    });

    const result = await newList.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteList = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const list = await ListModel.findOneAndDelete({ _id: id, userId });

    if (!list) {
      res.status(404).json({ error: 'Listado no encontrado' });
      return;
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const DeleteAll = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const result = await ListModel.deleteMany({ userId });

    res.json({
      message: 'Todos los listados han sido eliminados',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + (err as Error).message });
  }
};

export const addNoteList = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!text || text.trim() === '') {
    res.status(400).json({ error: 'Ingrese una nota válida' });
    return;
  }

  try {
    const note = await ListModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Listado no encontrado' });
      return;
    }

    note.descripcion.push({ text: text.trim(), completed: false } as IListItem);

    const updateNote = await note.save();
    res.json(updateNote);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteIndexList = async (req: Request, res: Response): Promise<void> => {
  const { id, idx } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!id || !idx) {
    res.status(400).json({ error: 'ID e índice son requeridos' });
    return;
  }

  const index = parseInt(Array.isArray(idx) ? idx[0] : idx, 10);

  try {
    const note = await ListModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Listado no encontrado' });
      return;
    }

    if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
      res.status(400).json({ error: 'Índice inválido' });
      return;
    }

    note.descripcion.splice(index, 1);

    const updateList = await note.save();
    res.json(updateList);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const editListItem = async (req: Request, res: Response): Promise<void> => {
  const { id, idx } = req.params;
  const { text } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!id || !idx) {
    res.status(400).json({ message: 'ID e índice son requeridos' });
    return;
  }

  const index = parseInt(Array.isArray(idx) ? idx[0] : idx, 10);

  try {
    const note = await ListModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ message: 'Listado no encontrado' });
      return;
    }

    if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
      res.status(400).json({ message: 'Índice inválido' });
      return;
    }

    if (!text || text.trim() === '') {
      res.status(400).json({ message: 'El texto no puede estar vacío' });
      return;
    }

    note.descripcion[index].text = text.trim();

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Error al editar la nota' });
  }
};

export const toggleCompleteDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, idx } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!id || !idx) {
    res.status(400).json({ error: 'ID e índice son requeridos' });
    return;
  }

  const index = parseInt(Array.isArray(idx) ? idx[0] : idx, 10);

  try {
    const list = await ListModel.findOne({ _id: id, userId });

    if (!list) {
      res.status(404).json({ error: 'Listado no encontrado' });
      return;
    }

    if (isNaN(index) || index < 0 || index >= list.descripcion.length) {
      res.status(400).json({ error: 'Índice inválido' });
      return;
    }

    list.descripcion[index].completed = !list.descripcion[index].completed;

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const ListCompleted = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const list = await ListModel.findOne({ _id: id, userId });

    if (!list) {
      res.status(404).json({ error: 'Listado no encontrado' });
      return;
    }

    list.completed = !list.completed;

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};