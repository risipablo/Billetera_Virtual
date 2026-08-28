
const GastosModel = require('../models/Gastos');



exports.getGastos = async (req, res) => {
    try {
        const gastos = await GastosModel.find({ userId: req.user.id });
        
        const gastosFormateados = gastos.map(gasto => {
            const g = gasto.toObject();
            
            
            if (!g.fecha && g.dia && g.mes && g.año) {
                const meses = {
                    "Enero": "01", "Febrero": "02", "Marzo": "03",
                    "Abril": "04", "Mayo": "05", "Junio": "06",
                    "Julio": "07", "Agosto": "08", "Septiembre": "09",
                    "Octubre": "10", "Noviembre": "11", "Diciembre": "12"
                };
                const mesNumero = meses[g.mes] || "01";
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
                const prodLower = g.producto ? g.producto.toLowerCase() : '';
                const categorias = {
                    'asado': 'Comida', 'carne': 'Comida', 'pollo': 'Comida',
                    'despensa': 'Comida', 'dietetica': 'Comida', 'facturas': 'Comida',
                    'pipa': 'Comida', 'cocina': 'Comida', 'verduleria': 'Comida',
                    'psicologa': 'Salud', 'medico': 'Salud', 'farmacia': 'Salud',
                    'doctor': 'Salud', 'enfermeria': 'Salud',
                    'auto': 'Automovil', 'nafta': 'Automovil', 'gasolina': 'Automovil',
                    'mecanico': 'Automovil', 'lavado': 'Automovil',
                    'taxi': 'Transporte', 'uber': 'Transporte', 'colectivo': 'Transporte',
                    'alquiler': 'Vivienda', 'luz': 'Vivienda', 'agua': 'Vivienda',
                    'gas': 'Vivienda', 'expensas': 'Vivienda',
                    'netflix': 'Servicios', 'spotify': 'Servicios', 'internet': 'Servicios',
                    'telefono': 'Servicios', 'seguro': 'Servicios',
                    'gimnasio': 'Deporte', 'deporte': 'Deporte',
                    'libro': 'Educacion', 'curso': 'Educacion', 'universidad': 'Educacion',
                    'celular': 'Tecnologia', 'computadora': 'Tecnologia',
                    'cine': 'Ocio', 'teatro': 'Ocio', 'salida': 'Ocio',
                    'viaje': 'Viajes', 'hotel': 'Viajes', 'avion': 'Viajes'
                };
                g.categoria = categorias[prodLower] || 'Otro';
            }
            
            if (g.condicion) {
                const condicionMap = {
                    'fijo': 'Fijo',
                    'variable': 'Variable',
                    'innecesario': 'Innecesario',
                    'necesario': 'Necesario'
                    // Añade aquí los valores reales que maneje tu sistema para condicion
                };
                const condicionLower = String(g.condicion).toLowerCase();
                g.condicion = condicionMap[condicionLower] || g.condicion;
            } else {
                g.condicion = 'Fijo';
            }

            if (g.estado) {
                const estadoMap = {
                    'pagado': 'Pagado',
                    'impago': 'Impago',
                    'deben': 'Impago',
                    'cuotas': 'Cuotas',
                    'devolver': 'Devolver',
                    'cajero': 'Cajero',
                    'inversion': 'Inversion'
                };
                const estadoLower = String(g.estado).toLowerCase();
                g.estado = estadoMap[estadoLower] || g.estado; 
            } else {
                g.estado = 'Pagado'; 
            }
            
            if (g.fecha && typeof g.fecha === 'string' && g.fecha.includes('-')) {
                const parts = g.fecha.split('-');
                if (parts.length === 3) {
                    const meses = {
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
        res.status(500).json({ error: err.message });
    }
};

exports.addGasto = async (req, res) => {
    const { fecha, producto, monto, categoria, metodo, condicion, estado } = req.body;

    if (!fecha || !producto || !monto || !categoria || !metodo || !condicion || !estado) {
        return res.status(400).json({ messages: 'Completar todos los campos requeridos' });
    }

    try {
     

        const newGasto = new GastosModel({
            fecha: fecha,
            producto,
            monto,
            categoria,
            metodo,
            condicion,
            estado,
            userId: req.user.id
        });

        const result = await newGasto.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGasto = async (req, res) => {
    const { id } = req.params;

    try {
        const gasto = await GastosModel.findOneAndDelete({ _id: id, userId: req.user.id }); 

        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json(gasto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editGasto = async (req, res) => {
    const { id } = req.params;
    const { fecha,producto,monto,categoria,metodo,condicion,estado } = req.body;

    try {
        const gasto = await GastosModel.findOneAndUpdate(
            { _id: id, userId: req.user.id }, 
            { fecha, producto, monto, categoria, metodo, condicion, estado },
            { new: true }
        );

        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json(gasto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAllGasto = async(req,res) => {
    try{
        const result = await GastosModel.deleteMany({userId:req.user.id})
        res.json(result)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.deleteGastoFilter = async(req,res) => {
    const userId = req.user.id
    const {filterType,date,month,year} = req.query

    let filtered = {userId}

    try{
        switch (filterType){
            case 'today':
                const today = new Date()
                today.setHours(0,0,0,0)
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                filtered.date = { $gte: today, $lt: tomorrow }
                break

            case 'date':
                if(date){
                    const targetDate = new Date(date)
                    targetDate.setHours(0,0,0,0)
                    const nextDay = new Date(targetDate)
                    nextDay.setDate(nextDay.getDate() + 1)
                    filtered.date = { $gte: targetDate, $lt: nextDay }
                }
                break

            case 'month':
                if (month && year) {
                    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
                    const endDate = new Date(parseInt(year), parseInt(month), 0)
                    filtered.date = { $gte: startDate, $lt: endDate }
                }
                break
                
            case 'year':
                if (year) {
                    const startDate = new Date(parseInt(year), 0, 1)
                    const endDate = new Date(parseInt(year) + 1, 0, 1)
                    filtered.date = { $gte: startDate, $lt: endDate }
                }
                break

            default:
                 return res.status(400).json({ error: 'Se requiere un tipo de filtro válido' })
        }

        const count = await GastosModel.countDocuments(filtered)
        
        if (count === 0) {
            return res.status(404).json({ message: 'No hay gastos para eliminar', deletedCount: 0 })
        }

        const result = await GastosModel.deleteMany(filtered)
        res.json(
             {message: `${result.deletedCount} gastos eliminadas`,
            deletedCount: result.deletedCount,
            filterApplied: { filterType, date, month, year }}
        )
     
    } catch(err) {
        console.error(' Error:', err);
        res.status(500).json({ error: err.message });
    }
}


