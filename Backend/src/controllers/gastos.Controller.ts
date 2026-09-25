
import { Request, Response } from "express";
import { GastosModel } from "../models/gastos.model";
import { IGasto } from "../types/gastos.type";
import { QueryFilter } from 'mongoose';


// export const getGastos =  async(
//     req:Request,
//     res:Response
// ) => {
//     const userId = req.user?._id
    
//     if(!userId){
//         return res.status(401).json({ error: "No autorizado" });
//     }

//     try{
//         const gastos = await GastosModel.find({userId})
//         res.json(gastos)
//     } catch (err){
//          const error = err as Error;
//         if (error.name === 'ValidationError') {
//           return res.status(400).json({ error: error.message });
//         }
//         return res.status(500).json({ error: 'Internal server error' });
//     }


// }

export const getGastos = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const gastos = await GastosModel.find({ userId });

    const gastosFormateados = gastos.map((gasto) => {
      const g = gasto.toObject() as unknown as Record<string, unknown>;

      if (!g.fecha && g.dia && g.mes && g.año) {
        const meses: Record<string, string> = {
          Enero: '01', Febrero: '02', Marzo: '03',
          Abril: '04', Mayo: '05', Junio: '06',
          Julio: '07', Agosto: '08', Septiembre: '09',
          Octubre: '10', Noviembre: '11', Diciembre: '12'
        };
        const mesNumero = meses[g.mes as string] || '01';
        const diaFormateado = String(g.dia).padStart(2, '0');
        g.fecha = `${g.año}-${mesNumero}-${diaFormateado}`;
      }

      if (!g.fecha) {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        g.fecha = `${year}-${month}-${day}`;
      }

      if (g.fecha instanceof Date) {
        const d = new Date(g.fecha);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        g.fecha = `${year}-${month}-${day}`;
      }

      if (!g.categoria || g.categoria === '') {
        const prodLower = g.producto ? String(g.producto).toLowerCase() : '';
        const categorias: Record<string, string> = {
          asado: 'Comida', carne: 'Comida', pollo: 'Comida',
          despensa: 'Comida', dietetica: 'Comida', facturas: 'Comida',
          pipa: 'Comida', cocina: 'Comida', verduleria: 'Comida',
          psicologa: 'Salud', medico: 'Salud', farmacia: 'Salud',
          doctor: 'Salud', enfermeria: 'Salud',
          auto: 'Automovil', nafta: 'Automovil', gasolina: 'Automovil',
          mecanico: 'Automovil', lavado: 'Automovil',
          taxi: 'Transporte', uber: 'Transporte', colectivo: 'Transporte',
          alquiler: 'Vivienda', luz: 'Vivienda', agua: 'Vivienda',
          gas: 'Vivienda', expensas: 'Vivienda',
          netflix: 'Servicios', spotify: 'Servicios', internet: 'Servicios',
          telefono: 'Servicios', seguro: 'Servicios',
          gimnasio: 'Deporte', deporte: 'Deporte',
          libro: 'Educacion', curso: 'Educacion', universidad: 'Educacion',
          celular: 'Tecnologia', computadora: 'Tecnologia',
          cine: 'Ocio', teatro: 'Ocio', salida: 'Ocio',
          viaje: 'Viajes', hotel: 'Viajes', avion: 'Viajes'
        };
        g.categoria = categorias[prodLower] || 'Otro';
      }

      if (g.condicion) {
        const condicionMap: Record<string, string> = {
          fijo: 'Fijo',
          variable: 'Variable',
          innecesario: 'Innecesario',
          necesario: 'Necesario'
        };
        const condicionLower = String(g.condicion).toLowerCase();
        g.condicion = condicionMap[condicionLower] || g.condicion;
      } else {
        g.condicion = 'Fijo';
      }

      if (g.estado) {
        const estadoMap: Record<string, string> = {
          pagado: 'Pagado',
          impago: 'Impago',
          deben: 'Impago',
          cuotas: 'Cuotas',
          devolver: 'Devolver',
          cajero: 'Cajero',
          inversion: 'Inversion'
        };
        const estadoLower = String(g.estado).toLowerCase();
        g.estado = estadoMap[estadoLower] || g.estado;
      } else {
        g.estado = 'Pagado';
      }

      if (g.metodo) {
        const metodoMap: Record<string, string> = {
          'Mercado Pago': 'Transferencia'
        };
        g.metodo = metodoMap[g.metodo as string] || g.metodo;
      }

      if (g.fecha && typeof g.fecha === 'string' && g.fecha.includes('-')) {
        const parts = g.fecha.split('-');
        if (parts.length === 3) {
          const meses: Record<string, string> = {
            '01': 'enero', '02': 'febrero', '03': 'marzo',
            '04': 'abril', '05': 'mayo', '06': 'junio',
            '07': 'julio', '08': 'agosto', '09': 'septiembre',
            '10': 'octubre', '11': 'noviembre', '12': 'diciembre'
          };
          g.mes = meses[parts[1]] || 'enero';
          g.año = parts[0];
        }
      }

      return g;
    });

    res.json(gastosFormateados);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


export const addGastos = async(
    req:Request,
    res:Response
) => {
    const {fecha, producto, monto,categoria,metodo,condicion,estado} = req.body

    const userId = req.user?._id

    if(!fecha||! producto || !monto || !categoria || !metodo || !condicion || !estado){
          return res.status(400).json({ 
          message: ' Todos los campos son requeridos '
        });
    }

    try{
        const newGasto = new GastosModel({
            fecha,
            producto,
            monto,
            categoria,
            metodo,
            condicion,
            estado,
            userId: req.user?._id
        })

        const result = await newGasto.save()
        res.json(result)
    } catch(err){
                const error = err as Error;
        if (error.name === 'ValidationError') {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
      }

}

export const deleteGasto = async(
    req:Request,
    res:Response
) => {
    const {id} = req.params
    const userId = req.user?._id

     if (!id) {
      return res.status(400).json({ error: "El ID es requerido" });
    }

    try{
        const gasto = await GastosModel.findOneAndDelete({
            _id:id, userId
        })

        if(!gasto){
            return res.status(401).json({error: "Usuario no autorizado"})
        }

        res.json(gasto)
    } catch(err) {
        const error = err as Error;
        if (error.name === 'ValidationError') {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
      }

}

export const deleteAllGastos = async(
    req:Request,
    res:Response
): Promise<void> => {

    const userId = req.user?._id

    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }

    try{
        const result = await GastosModel.deleteMany({userId})
        res.json(result)
    } catch (err) {
        const error = err as Error;
        if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteGastoFilter = async(
    req:Request,
    res:Response
): Promise<void> => {
    
    const userId = req.user?._id
    const { filterType, date, month, year } = req.query as {
        filterType?: string;
        date?: string;
        month?: string;
        year?: string;
    };

    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }

    const filtered: QueryFilter<IGasto> = { userId };

   try {
    switch (filterType) {
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered.fecha = { $gte: today, $lt: tomorrow } as unknown as string;
        break;
      }

      case 'date': {
        if (date) {
          const targetDate = new Date(date);
          targetDate.setHours(0, 0, 0, 0);
          const nextDay = new Date(targetDate);
          nextDay.setDate(nextDay.getDate() + 1);
          filtered.fecha = { $gte: targetDate, $lt: nextDay } as unknown as string;
        }
        break;
      }

      case 'month': {
        if (month && year) {
          const startDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
          const endDate = new Date(parseInt(year, 10), parseInt(month, 10), 0);
          filtered.fecha = { $gte: startDate, $lte: endDate } as unknown as string;
        }
        break;
      }

      case 'year': {
        if (year) {
          const startDate = new Date(parseInt(year, 10), 0, 1);
          const endDate = new Date(parseInt(year, 10) + 1, 0, 1);
          filtered.fecha = { $gte: startDate, $lt: endDate } as unknown as string;
        }
        break;
      }

      default:
        res.status(400).json({ error: 'Se requiere un tipo de filtro válido' });
        return;
    }

    const count = await GastosModel.countDocuments(filtered);

    if (count === 0) {
      res.status(404).json({ message: 'No hay gastos para eliminar', deletedCount: 0 });
      return;
    }

    const result = await GastosModel.deleteMany(filtered);

    res.json({
      message: `${result.deletedCount} gastos eliminados`,
      deletedCount: result.deletedCount,
      filterApplied: { filterType, date, month, year }
    });
  } catch (err) {
    const error = err as Error;
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const deleteGastosByIds = async (
    req:Request,
    res:Response
) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array de ids' });
    }

    try {
        const result = await GastosModel.deleteMany({
            _id: { $in: ids },
            userId: req.user?._id
        });
        res.json({
            message: `${result.deletedCount} gastos eliminados`,
            deletedCount: result.deletedCount
        });
    } catch(err) {
        const error = err as Error;
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const editGasto = async(
    req:Request,
    res:Response
) => {
    const {id} = req.params
    const userId = req.user?._id
    const {fecha, producto, monto,categoria,metodo,condicion,estado} = req.body

    if (!id){
        return res.status(400).json({error: "ID es requerido"})
    }

    try{
        const saveGasto = await GastosModel.findOneAndUpdate(
            {_id:id, userId},
            {fecha, producto, monto,categoria,metodo,condicion,estado},
            {new:true, runValidators:true}
        )

        if (!saveGasto){
            return res.status(404).json({error: "Gasto not found"})
        }

        res.json(saveGasto)
    } catch(err) {
        const error = err as Error;
        if (error.name === 'ValidationError') {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

