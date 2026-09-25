import { Request, Response } from 'express';
import { CuotaModel } from '../models/cuotas.model';
import { ICuota } from '../types/cuotas.type';

const sumarMeses = (fecha: Date, meses: number): Date => {
  const año = fecha.getUTCFullYear();
  const mes = fecha.getUTCMonth() + meses;
  const dia = fecha.getUTCDate();

  const ultimoDiaMes = new Date(Date.UTC(año, mes + 1, 0)).getUTCDate();
  const diaFinal = Math.min(dia, ultimoDiaMes);

  return new Date(Date.UTC(año, mes, diaFinal));
};

const asegurarFechaPrimeraCuota = (note: ICuota): void => {
  if (!note.fechaPrimeraCuota) {
    const primera = (note.fecha && note.fecha[0])
      ? new Date(note.fecha[0])
      : (note.fechaCompra || new Date());
    note.fechaPrimeraCuota = primera.toISOString().slice(0, 10);
  }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const notes = await CuotaModel.find({ userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addNotes = async (req: Request, res: Response): Promise<void> => {
  const { titulo, cuotas, monto, fecha, fechaPrimeraCuota, categoria } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!titulo || !cuotas || !monto || !fecha || !fechaPrimeraCuota || !categoria) {
    res.status(400).json({
      error: 'Todos los campos son requeridos: título, cuotas, monto, fecha, fecha primera cuota y categoría'
    });
    return;
  }

  const totalCuotas = Number(cuotas);
  const montoTotal = Number(monto);

  if (totalCuotas < 1 || totalCuotas > 100) {
    res.status(400).json({ error: 'La cantidad de cuotas debe estar entre 1 y 100' });
    return;
  }

  if (montoTotal <= 0) {
    res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    return;
  }

  const fechaCompraDate = new Date(fecha);
  const primeraCuotaDate = new Date(fechaPrimeraCuota);

  if (isNaN(fechaCompraDate.getTime())) {
    res.status(400).json({ error: 'Fecha de compra inválida' });
    return;
  }

  if (isNaN(primeraCuotaDate.getTime())) {
    res.status(400).json({ error: 'Fecha de primera cuota inválida' });
    return;
  }

  const montoPorCuota = Math.floor((montoTotal / totalCuotas) * 100) / 100;
  const diferencia = Math.round((montoTotal - montoPorCuota * totalCuotas) * 100) / 100;

  const descripcion: string[] = [];
  const fechas: Date[] = [];
  const precios: number[] = [];
  const completedItems: boolean[] = [];

  for (let i = 0; i < totalCuotas; i++) {
    descripcion.push(`Cuota ${i + 1}/${totalCuotas}`);
    fechas.push(sumarMeses(primeraCuotaDate, i));
    precios.push(i === totalCuotas - 1 ? montoPorCuota + diferencia : montoPorCuota);
    completedItems.push(false);
  }

  try {
    const noteData = {
      titulo: titulo.trim(),
      cuotas: totalCuotas,
      montoTotal,
      fechaCompra: fechaCompraDate,
      categoria: categoria.trim(),
      descripcion,
      fecha: fechas,
      precio: precios,
      completedItems,
      fechaPrimeraCuota: primeraCuotaDate.toISOString().slice(0, 10),
      userId
    };

    const newNote = new CuotaModel(noteData);
    const result = await newNote.save();

    res.status(201).json(result);
  } catch (err) {
    console.error('ERROR AL GUARDAR:', err);
    const error = err as Error & { errors?: Record<string, unknown> };
    res.status(500).json({
      error: error.message,
      details: error.errors || {}
    });
  }
};

export const addNoteItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { descripcion, fecha, precio } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!id) {
    res.status(400).json({ error: 'El ID es requerido' });
    return;
  }

  if (!descripcion || !fecha || !precio) {
    res.status(400).json({
      error: 'Descripción, fecha y precio son requeridos'
    });
    return;
  }

  try {
    const note = await CuotaModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Cuota no encontrada' });
      return;
    }

    const nuevaFecha = new Date(fecha);
    if (isNaN(nuevaFecha.getTime())) {
      res.status(400).json({ error: 'Fecha inválida' });
      return;
    }

    note.descripcion.push(descripcion.trim());
    note.fecha.push(nuevaFecha);
    note.precio.push(Number(precio));
    note.completedItems.push(false);

    asegurarFechaPrimeraCuota(note);

    const updateNote = await note.save();
    res.json(updateNote);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const note = await CuotaModel.findOneAndDelete({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteNoteItem = async (req: Request, res: Response): Promise<void> => {
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
    const note = await CuotaModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
      res.status(400).json({ error: 'Índice inválido' });
      return;
    }

    note.descripcion.splice(index, 1);
    note.fecha.splice(index, 1);
    note.precio.splice(index, 1);
    note.completedItems.splice(index, 1);

    asegurarFechaPrimeraCuota(note);

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deletecuotasFilter = async (req: Request, res: Response): Promise<void> => {
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
    const result = await CuotaModel.deleteMany({
      _id: { $in: ids },
      userId
    });

    res.json({
      message: `${result.deletedCount} productos eliminados`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteAllCuotas = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const result = await CuotaModel.deleteMany({ userId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const editNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { titulo, cuotas, montoTotal, fecha, fechaPrimeraCuota, categoria } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const note = await CuotaModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    if (titulo) note.titulo = titulo;
    if (montoTotal) note.montoTotal = Number(montoTotal);
    if (fecha) note.fechaCompra = new Date(fecha);
    if (categoria) note.categoria = categoria;

    if (cuotas) {
      const nuevoTotal = Number(cuotas);
      const viejasCuotas = note.cuotas;

      if (nuevoTotal !== viejasCuotas) {
        const montoPorCuota =
          Math.floor((Number(montoTotal || note.montoTotal) / nuevoTotal) * 100) / 100;
        const diferencia =
          Math.round(
            (Number(montoTotal || note.montoTotal) - montoPorCuota * nuevoTotal) * 100
          ) / 100;

        const primeraFecha = fechaPrimeraCuota
          ? new Date(fechaPrimeraCuota)
          : (note.fecha[0] ? new Date(note.fecha[0]) : new Date());

        const nuevosItems: string[] = [];
        const nuevasFechas: Date[] = [];
        const nuevosPrecios: number[] = [];
        const nuevosCompleted: boolean[] = [];

        for (let i = 0; i < nuevoTotal; i++) {
          nuevosItems.push(`Cuota ${i + 1}/${nuevoTotal}`);
          nuevasFechas.push(sumarMeses(primeraFecha, i));
          nuevosPrecios.push(
            i === nuevoTotal - 1 ? montoPorCuota + diferencia : montoPorCuota
          );
          nuevosCompleted.push(
            i < viejasCuotas ? (note.completedItems[i] || false) : false
          );
        }

        note.descripcion = nuevosItems;
        note.fecha = nuevasFechas;
        note.precio = nuevosPrecios;
        note.completedItems = nuevosCompleted;
        note.cuotas = nuevoTotal;
      } else if (fechaPrimeraCuota) {
        const primeraFecha = new Date(fechaPrimeraCuota);

        for (let i = 0; i < note.cuotas; i++) {
          note.fecha[i] = sumarMeses(primeraFecha, i);
        }
      }
    } else if (fechaPrimeraCuota) {
      const primeraFecha = new Date(fechaPrimeraCuota);

      for (let i = 0; i < note.cuotas; i++) {
        note.fecha[i] = sumarMeses(primeraFecha, i);
      }
    }

    asegurarFechaPrimeraCuota(note);

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const editNoteItem = async (req: Request, res: Response): Promise<void> => {
  const { id, idx } = req.params;
  const { descripcion, fecha, precio } = req.body;
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
    const note = await CuotaModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
      res.status(400).json({ error: 'Índice inválido' });
      return;
    }

    if (descripcion) note.descripcion[index] = descripcion;
    if (fecha) note.fecha[index] = new Date(fecha);
    if (precio) note.precio[index] = Number(precio);

    asegurarFechaPrimeraCuota(note);

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const toggleCompleteItem = async (req: Request, res: Response): Promise<void> => {
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
    const note = await CuotaModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    if (isNaN(index) || index < 0 || index >= note.completedItems.length) {
      res.status(400).json({ error: 'Índice inválido' });
      return;
    }

    note.completedItems[index] = !note.completedItems[index];

    asegurarFechaPrimeraCuota(note);

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const toggleCompleteNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const note = await CuotaModel.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    note.completed = !note.completed;
    asegurarFechaPrimeraCuota(note);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};