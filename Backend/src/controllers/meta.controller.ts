import { Request, Response } from 'express';
import { QueryFilter } from 'mongoose';
import { MetaModel } from '../models/meta.model';
import { IMeta } from '../types/meta.type';

export const crearMeta = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const { nombre, descripcion, montoObjetivo, fecha, categoria } = req.body;

  if (!nombre || !montoObjetivo || !fecha || !categoria) {
    res.status(400).json({
      error: 'Nombre, monto objetivo, fecha y categoría son obligatorios'
    });
    return;
  }

  if (montoObjetivo <= 0) {
    res.status(400).json({ error: 'El monto objetivo debe ser mayor a 0' });
    return;
  }

  const fechaDate = new Date(fecha);
  if (isNaN(fechaDate.getTime())) {
    res.status(400).json({ error: 'Fecha inválida' });
    return;
  }

  try {
    const meta = new MetaModel({
      userId,
      nombre,
      descripcion,
      montoObjetivo,
      fecha: fechaDate,
      categoria
    });

    await meta.save();
    res.status(201).json(meta);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const listarMetas = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const { estado, categoria } = req.query as {
      estado?: string;
      categoria?: string;
    };

    const filtro: QueryFilter<IMeta> = { userId };
    if (estado) filtro.estado = estado as IMeta['estado'];
    if (categoria) filtro.categoria = categoria;

    const metas = await MetaModel.find(filtro).sort({ createdAt: -1 });
    res.status(200).json(metas);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const obtenerMeta = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const meta = await MetaModel.findOne({ _id: id, userId });

    if (!meta) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    res.status(200).json(meta);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const editarMeta = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const {
    nombre,
    descripcion,
    montoObjetivo,
    fecha,
    categoria,
    estado
  } = req.body;

  try {
    const meta = await MetaModel.findOne({ _id: id, userId });

    if (!meta) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    if (nombre !== undefined) meta.nombre = nombre;
    if (descripcion !== undefined) meta.descripcion = descripcion;
    if (categoria !== undefined) meta.categoria = categoria;

    if (montoObjetivo !== undefined) {
      if (montoObjetivo <= 0) {
        res.status(400).json({ error: 'El monto objetivo debe ser mayor a 0' });
        return;
      }
      meta.montoObjetivo = montoObjetivo;
    }

    if (fecha !== undefined) {
      const fechaDate = new Date(fecha);
      if (isNaN(fechaDate.getTime())) {
        res.status(400).json({ error: 'Fecha inválida' });
        return;
      }
      meta.fecha = fechaDate;
    }

    if (estado !== undefined) {
      const estadosValidos: IMeta['estado'][] = [
        'activa',
        'completada',
        'pausada',
        'cancelada'
      ];
      if (!estadosValidos.includes(estado)) {
        res.status(400).json({ error: 'Estado inválido' });
        return;
      }
      meta.estado = estado;
    }

    await meta.save();
    res.status(200).json(meta);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const eliminarMeta = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const meta = await MetaModel.findOneAndDelete({ _id: id, userId });

    if (!meta) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Meta eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const agregarAporte = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { monto, nota } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (monto === undefined || monto <= 0) {
    res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    return;
  }

  try {
    const meta = await MetaModel.findOne({ _id: id, userId });

    if (!meta) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    if (meta.estado === 'completada' || meta.estado === 'cancelada') {
      res.status(400).json({ error: 'La meta ya está cerrada' });
      return;
    }

    meta.aportes.push({ monto, nota } as { monto: number; nota?: string });

    const total = meta.aportes.reduce((s, a) => s + a.monto, 0);
    if (total >= meta.montoObjetivo) {
      meta.estado = 'completada';
    } else if (meta.estado === 'pausada') {
      meta.estado = 'activa';
    }

    await meta.save();
    res.status(201).json(meta);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const eliminarAporte = async (req: Request, res: Response): Promise<void> => {
  const { id, aporteId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const meta = await MetaModel.findOne({ _id: id, userId });

    if (!meta) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    const aporte = meta.aportes.id(Array.isArray(aporteId) ? aporteId[0] : aporteId);

    if (!aporte) {
      res.status(404).json({ error: 'Aporte no encontrado' });
      return;
    }

    aporte.deleteOne();

    const total = meta.aportes.reduce((s, a) => s + a.monto, 0);
    if (meta.estado === 'completada' && total < meta.montoObjetivo) {
      meta.estado = 'activa';
    }

    await meta.save();
    res.status(200).json(meta);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteAllMetas = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const result = await MetaModel.deleteMany({ userId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteFilterCuotas = async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'Se requiere un array de ids' });
    return;
  }

  try {
    const result = await MetaModel.deleteMany({
      _id: { $in: ids },
      userId
    });

    res.json({
      message: `${result.deletedCount} metas eliminadas`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};