import { CheckCircle, Circle, DollarSign, Pencil, Trash2 } from "lucide-react";
import type { GastoFijoItemProps } from "../types/type.gastos.fijo";


const estadoIcon = {
    activo: <Circle size={16} className="estado-icon activo" />,
    pagado: <CheckCircle size={16} className="estado-icon pagado" />,
    vencido: <Circle size={16} className="estado-icon vencido" />
};

const estadoLabel = {
    activo: 'Activo',
    pagado: 'Pagado',
    vencido: 'Vencido'
};

export const GastoFijoItem = ({
    gasto, onEdit, onDelete
}: GastoFijoItemProps) => {
    return (
        <div className={`gasto-fijo-item estado-${gasto.estado}`}>
            <div className="gasto-fijo-info">
                <div className="gasto-fijo-nombre">
                    {estadoIcon[gasto.estado as keyof typeof estadoIcon]}
                    <span>{gasto.nombre}</span>
                </div>
                <div className="gasto-fijo-detalles">
                    vence el {gasto.dia} de cada mes
                    <span className="gasto-fijo-monto">
                    
                        ${gasto.monto.toLocaleString('es-AR')}
                    </span>
                    <span className="gasto-fijo-categoria">{gasto.categoria}</span>
                    <span className={`gasto-fijo-estado ${gasto.estado}`}>
                        {estadoLabel[gasto.estado as keyof typeof estadoLabel]}
                    </span>
                </div>
            </div>
            <div className="gasto-fijo-actions">

                <button
                    className="btn-edit"
                    onClick={() => onEdit(gasto)}
                    title="Editar"
                >
                    <Pencil size={16} />
                </button>
                <button
                    className="btn-delete"
                    onClick={() => onDelete(gasto._id!)}
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};