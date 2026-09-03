
import "./style/gastos.css"
import { Pencil, Plus, Trash2, X, ArrowUp, ArrowDown } from "lucide-react"
import {  useState } from "react"
import type { GastosContainerProps, IGastos } from "./types/type.gastos"
import { formatDate } from "./utils/dateutils"
import { ModalConfirm } from "../../../components/ui/modalConfirm"
import Tooltip from "@mui/material/Tooltip"
import { Spinner } from "../../../components/ui/spinner/spinner"
import { IconButton } from "@mui/material"



const GastosContainer = ({
    filterGastos,
    loading,
    deleteGastos,
    editGastos,
    ordenAsc = true,
    onOrderByDate
}: GastosContainerProps) => {


    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({
        fecha:'',
        producto:'',
        monto:0,
        categoria:'',
        metodo:'',
        condicion:'',
        estado:'',
    })

    const handleEditGasto = (gasto:IGastos) => {
        setEditingId(gasto._id || null)
        setEditData({
            fecha:gasto.fecha,
            producto:gasto.producto,
            monto:gasto.monto,
            categoria:gasto.categoria,
            metodo:gasto.metodo,
            condicion:gasto.condicion,
            estado:gasto.estado,
        })
    }

    const handleSaveGasto = async (id:string) => {
        
        if (!editData.fecha || !editData.producto || !editData.monto || 
            !editData.categoria || !editData.metodo || !editData.condicion || 
            !editData.estado) {
            alert('Todos los campos son requeridos')
            return
        }

        editGastos(id, {
            fecha: editData.fecha,
            producto: editData.producto,
            monto: editData.monto,
            categoria: editData.categoria,
            metodo: editData.metodo,
            condicion: editData.condicion,
            estado: editData.estado,
        })
        
        setEditData({
            fecha:'',
            producto:'',
            monto:0,
            categoria:'',
            metodo:'',
            condicion:'',
            estado:'',
        })
        setEditingId(null)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditData({
            fecha: '',
            producto: '',
            monto: 0,
            categoria: '',
            metodo: '',
            condicion: '',
            estado: '',
        })
    }

    const handleChange = (field: keyof typeof editData, value: any) => {
        setEditData(prev => ({ ...prev, [field]: value }))
    }

  

    // Delete modal
    const [showModal, setShowModal] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        confirmText: ""
    });

    
    const openDeleteModal = (
        action: () => void,
        title: string,
        message: string,
        confirmText: string
    ) => {
        setDeleteAction(() => action);
        setModalConfig({ title, message, confirmText });
        setShowModal(true);
    };

    const confirmModal = () => {
        if (deleteAction) {
            deleteAction();
            setShowModal(false);
            setDeleteAction(null);
        }
    };


    const slug = (value: string) =>
    value
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, "-")

    const badgeClass = (value: string) => `badge badge-${slug(value) || "default"}`  

    
    
    if (loading) {
        return (
            <Spinner size="lg" label="Cargando datos..."/>
        )
    }


    if (filterGastos.length === 0) {
        return (
            <div className="gastos-empty">
                <p>No hay gastos registrados</p>
            </div>
        )
    }


    

    return (
        <>
            <div className="gastos-table-wrapper">
                <table className="gastos-table">
                    <thead>
                        <tr>
                            <th>Fecha
                                   <IconButton onClick={onOrderByDate} className="ordenar" size="small" sx={{ color: "rgb(245, 243, 239)" }} >
                                    {ordenAsc ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
                                    </IconButton>
                            </th>
                            <th>Producto</th>
                            <th className="align-right">Monto</th>
                            <th>Categoría</th>
                            <th>Método</th>
                            <th>Estado</th>
                            <th>Condición</th>
                            <th className="align-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterGastos.map((gasto) =>{
                         return (
                            
                            <tr key={gasto._id}>
                                <td data-label="Fecha"> {formatDate(gasto.fecha?.toString() || '')}</td>
                                <td data-label="Producto">{gasto.producto[0].toUpperCase() + gasto.producto.slice(1)}</td>
                                <td data-label="Monto" className="align-right gasto-monto">
                                    ${gasto.monto.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                </td>
                                <td data-label="Categoría">{gasto.categoria}</td>
                                <td data-label="Método">{gasto.metodo}</td>
                                <td data-label="Estado">
                                    <span className={badgeClass(gasto.estado)}>{gasto.estado}</span>
                                </td>
                                <td data-label="Condición">
                                    <span className={badgeClass(gasto.condicion)}>{gasto.condicion}</span>
                                </td>
                                <td data-label="Acciones" className="align-right">
                                    <div className="actions-container">
                                        <button 
                                            className="action-btn edit-btn" 
                                            aria-label="Editar gasto"
                                            onClick={() => handleEditGasto(gasto)}
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <Tooltip title='Eliminar' arrow>
                                            <button 
                                                className="action-btn delete-btn" 
                                                aria-label="Eliminar gasto"
                                                 onClick={() => openDeleteModal(
                                                    () => gasto._id && deleteGastos(gasto._id),
                                                    "Confirmar borrado",
                                                    "¿Estás seguro que deseas eliminar este producto?",
                                                    "Eliminar"
                                                )}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </Tooltip>
                                        
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            {/* Modal para edicion de gastos */}
            {editingId && (
                <div className="form-modal-overlay" onClick={handleCancelEdit}>
                    <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="form-modal-header">
                            <h3>Editar gasto</h3>
                            <button 
                                className="form-modal-close" 
                                onClick={handleCancelEdit}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="form-modal-body">
                            {/* Fecha */}
                            <div className="form-group">
                                <label>Fecha</label>
                                <input 
                                    type="date" 
                                    className="task-input"
                                    value={editData.fecha} 
                                    onChange={(e) => handleChange('fecha', e.target.value)} 
                                />
                            </div>

                            {/* Producto */}
                            <div className="form-group">
                                <label>Producto</label>
                                <input 
                                    type="text" 
                                    className="task-input"
                                    placeholder="Nombre del producto"
                                    value={editData.producto} 
                                    onChange={(e) => handleChange('producto', e.target.value)} 
                                />
                            </div>

                            {/* Monto */}
                            <div className="form-group">
                                <label>Monto</label>
                                <input 
                                    type="number" 
                                    className="task-input"
                                    placeholder="0.00"
                                    value={editData.monto} 
                                    onChange={(e) => handleChange('monto', parseFloat(e.target.value) || 0)} 
                                />
                            </div>

                            {/* Categoría */}
                            <div className="form-group">
                                <label>Categoría</label>
                                <select 
                                    className="task-input"
                                    value={editData.categoria} 
                                    onChange={(e) => handleChange('categoria', e.target.value)}
                                >
                                    <option value="">Seleccionar Categoria</option>
                                    {["Comida", "Automovil", "Transporte", "Vivienda", 'Servicios',
                                      "Salud", "Deporte", "Educacion", 'Accesorios', "Mascota","Indumentaria","Cosmetica",
                                      'Tecnologia', "Donacion", "Ocio", "Viajes", "Ahorro","Supermercado","Salidas", "Otro"  
                                    ].map(categoria => 
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    )}
                                </select>
                            </div>

                            {/* Método de pago */}
                            <div className="form-group">
                                <label>Método de pago</label>
                                <select 
                                    className="task-input"
                                    value={editData.metodo} 
                                    onChange={(e) => handleChange('metodo', e.target.value)}
                                >
                                    <option value="">Seleccionar método</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Crédito">Crédito</option>
                                    <option value="Débito">Débito</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>

                            {/* Condición */}
                            <div className="form-group">
                                <label>Condición</label>
                                <select 
                                    className="task-input"
                                    value={editData.condicion} 
                                    onChange={(e) => handleChange('condicion', e.target.value)}
                                >
                                    <option value="">Seleccionar Condición</option>
                                    {["Fijo", "Necesario", "Innecesario", "Inversion","Cuotas"].map(condicion => 
                                        <option key={condicion} value={condicion}>{condicion}</option>
                                    )}
                                </select>
                            </div>

                            {/* Estado */}
                            <div className="form-group">
                                <label>Estado</label>
                                <select 
                                    className="task-input"
                                    value={editData.estado} 
                                    onChange={(e) => handleChange('estado', e.target.value)}
                                >
                                    <option value="">Seleccionar Estado</option>
                                    {["Pagado", "Impago", "Deben", "Cuotas", "Devolver", "Cajero", "Inversion"].map(estado => 
                                        <option key={estado} value={estado}>{estado}</option>
                                    )}
                                </select>
                            </div>

                            {/* Botones de acción */}
                            <div className="task-modal-actions">
                                <button 
                                    className="task-btn task-btn-primary"
                                    onClick={() => handleSaveGasto(editingId)}
                                >
                                    <Plus size={18} />
                                    Guardar cambios
                                </button>

                                <button 
                                    className="task-btn task-btn-secondary"
                                    onClick={handleCancelEdit}
                                >
                                    <X size={18} />
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && ModalConfirm && (
                <ModalConfirm
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmModal}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    confirmText={modalConfig.confirmText}
                    cancelText="Cancelar"
                />
            )}
        </>
    )
}

export default GastosContainer