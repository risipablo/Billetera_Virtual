import { useState, useEffect } from "react";
import { Container, Grid, Tooltip } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { Spinner } from "../../../components/ui/spinner/spinner";
import { useConfirmModal } from "../../hooks/useModalConfirm";
import { PaginationComponent } from "../../../components/ui/pagination/pagination";
import { CuotaForm } from "./components/cuotaForm";
import { CuotaCard } from "./components/cuotaCard";
import "./style/cuotas.css";
import { useCuotas } from "./hooks/useCuota";
import { FilterX, Trash2 } from "lucide-react";
import { FilterCuotas } from "./ui/filterCuotas";
import { ModalConfirm } from "../../../components/ui/modalConfirm";

export const CuotasMaster = () => {
    const {
        cuotas,
        filteredCuotas,
        setFilteredCuotas,
        loading,
        addCuotas,
        addCuotaItem,
        deleteCuota,
        deleteFilteredCuotas,
        deleteCuotaItem,
        allDeleteCuotas,
        editCuota,
        editCuotaItem,
        toggleCompleteCuota,
        toggleCompleteItem
    } = useCuotas();

    const { openModal, ModalComponent } = useConfirmModal();
    const [formData, setFormData] = useState({
        titulo: '',
        cuotas: '',
        monto: '',
        fecha: '',
        categoria:''
    });

    const [activeFilter, setFilterActive] = useState<string>('');
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedYear, setSelecetYear] = useState<string>('');
    const [completeFilter, setCompleteFilter] = useState<string>('')
    const [selecetCategoria,setSelecetCategoria]= useState<string>('');
    
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    
    const pageCount = Math.ceil(filteredCuotas.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredCuotas.slice(offset, offset + itemsPerPage);

    
    useEffect(() => {
        if (filteredCuotas.length > 0 && currentPage >= pageCount) {
            setCurrentPage(Math.max(0, pageCount - 1));
        }
    }, [filteredCuotas.length, pageCount, currentPage]);

    const handleAddNota = () => {
        if (!formData.titulo.trim() || !formData.cuotas || !formData.monto || !formData.fecha || !formData.categoria) {
            alert('Todos los campos son requeridos');
            return;
        }

        addCuotas({
            titulo: formData.titulo.trim(),
            cuotas: Number(formData.cuotas),
            monto: Number(formData.monto),
            fecha: formData.fecha,
            categoria:formData.categoria
        });

        setFormData({
            titulo: '',
            cuotas: '',
            monto: '',
            fecha: '',
            categoria:''
        });
    };
    


    const getFilterDescription = () => {
        const parts: string[] = [];

        if (activeFilter === 'fechas' || selectedMonth || selectedYear) {
            const monthNames: Record<string, string> = {
                '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
                '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
                '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
            };
            if (selectedMonth) parts.push(monthNames[selectedMonth]);
            if (selectedYear) parts.push(selectedYear);
        }

        if (completeFilter) parts.push(`Condicion: ${completeFilter}`);
        if (selecetCategoria) parts.push(`Condicion: ${selecetCategoria}`);
        

        return parts.length > 0 ? parts.join(' - ') : activeFilter;
    };

    const handleDeleteFiltered = async () => {
        const idsToDelete = filteredCuotas
            .map(g => g._id)
            .filter((id): id is string => Boolean(id));
        if (idsToDelete.length === 0) return;

        await deleteFilteredCuotas(idsToDelete);
        setShowModalFilter(false);
        setFilterActive('');
    };

    const hasActiveFilters = Boolean(
        selectedMonth || selectedYear || completeFilter|| selecetCategoria || activeFilter 
    );


    if (loading) {
        return (
            <div className="notas-loading">
                <Spinner size="lg" label="Cargando cuotas..." />
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Notas</h2>
                <div className="header-actions">
                    <CuotaForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleAddNota}
                        isLoading={loading}
                    />

                    <Tooltip title="Eliminar todos los productos" arrow>
                        <button
                            className="delete-all-btn"
                            onClick={() => openModal(
                                allDeleteCuotas,
                                "Confirmar borrado",
                                `¿Estás seguro que deseas eliminar todos los gastos (${cuotas.length})?`,
                                "Eliminar Todas"
                            )}
                        >
                            <Trash2 size={18} />
                            Eliminar Todas ({cuotas.length})
                        </button>
                    </Tooltip>


                    {hasActiveFilters && filteredCuotas.length > 0 && (
                        <Tooltip title={`Eliminar solo los productos de: ${getFilterDescription()}`} arrow>
                            <button
                                className="delete-all-btn"
                                onClick={() => openModal(
                                    handleDeleteFiltered,
                                    "Eliminar productos filtrados",
                                    `¿Estás seguro que deseas eliminar todas las productos de "${getFilterDescription()}" (${filteredCuotas.length})?`,
                                    `Eliminar ${filteredCuotas.length} metas`
                                )}
                            >
                                <Trash2 size={18} />
                                <FilterX size={14} />
                                <span>Eliminar Filtradas ({filteredCuotas.length})</span>
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>

            
            <FilterCuotas
                cuotas={cuotas}
                setFilterCuotas={setFilteredCuotas}
                onFilterChange={({
                    selectedMonth,selectedYear,selecetCategoria,completeFilter
                })=> {
                    setCompleteFilter(completeFilter)
                    setSelecetYear(selectedYear)
                    setSelectedMonth(selectedMonth)
                    setSelecetCategoria(selecetCategoria)

                    const hasFilters = selectedMonth ||selectedYear || selecetCategoria || completeFilter;
                    setFilterActive(hasFilters ? 'fechas' : '');
                }}
            />


            {currentItems.length === 0 ? (
                <div className="notas-empty">
                    <p>
                        {cuotas.length === 0 
                            ? 'No hay cuotas que pagar' 
                            : 'No hay cuotas que coincidan con el filtro seleccionado'}
                    </p>
                    
                </div>
            ) : (
                <Container style={{ marginTop: 30, padding: 0 }}>
                    {filteredCuotas.length > 0 && (
                        <span className="filter-results-count" style={{marginBottom: 10, display: 'block'}}>
                            Mostrando {filteredCuotas.length} de {cuotas.length} productos
                        </span>
                    )}
                    <Grid container spacing={4}>
                        {currentItems.map((cuota) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cuota._id}>
                                <CuotaCard
                                    cuota={cuota}
                                    onToggleComplete={toggleCompleteCuota}
                                    onDelete={deleteCuota}
                                    onEdit={editCuota}
                                    onAddItem={addCuotaItem}
                                    onToggleItem={toggleCompleteItem}
                                    onDeleteItem={deleteCuotaItem}
                                    onEditItem={editCuotaItem}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            
            {pageCount > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={filteredCuotas.length}
                    offset={offset}
                    pageCount={pageCount}
                    itemsPerPage={itemsPerPage}
                />
            )}

            
            {showModalFilter && (
                <ModalConfirm
                    isOpen={showModalFilter}
                    onClose={() => setShowModalFilter(false)}
                    onConfirm={handleDeleteFiltered}
                    title="Eliminar gastos filtrados"
                    message={`¿Estás seguro que deseas eliminar todas las metas de "${getFilterDescription()}" (${filteredCuotas.length} metas)?`}
                    confirmText={`Eliminar ${filteredCuotas.length} metas`}
                    cancelText="Cancelar"
                />
            )}

            <ModalComponent />
            <Toaster />
        </div>
    );
};

export default CuotasMaster;