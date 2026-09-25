import { Request, Response } from 'express';
import { FijoModel } from '../models/fijo.model';

export const getFijo = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const fijo = await FijoModel.find({ userId });
    res.json(fijo);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addFijo = async (req: Request, res: Response): Promise<void> => {
  const { dia, nombre, monto, categoria, estado } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!dia || !nombre || monto === undefined || !categoria || !estado) {
    res.status(400).json({
      messages: 'Completar todos los campos requeridos'
    });
    return;
  }

  if (dia < 1 || dia > 31) {
    res.status(400).json({
      messages: 'El día debe estar entre 1 y 31'
    });
    return;
  }

  try {
    const newFijo = new FijoModel({
      dia,
      nombre,
      monto,
      categoria,
      estado,
      userId
    });

    const result = await newFijo.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const editFijo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { dia, nombre, monto, categoria, estado } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const fijo = await FijoModel.findOneAndUpdate(
      { _id: id, userId },
      { dia, nombre, monto, categoria, estado },
      { new: true, runValidators: true }
    );

    if (!fijo) {
      res.status(404).json({ error: 'Gasto fijo no encontrado' });
      return;
    }

    res.json(fijo);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteFijo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const fijo = await FijoModel.findOneAndDelete({ _id: id, userId });

    if (!fijo) {
      res.status(404).json({ error: 'Gasto no encontrado' });
      return;
    }

    res.json(fijo);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteAllFijo = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const result = await FijoModel.deleteMany({ userId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};