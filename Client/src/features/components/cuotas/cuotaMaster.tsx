
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
import { Trash2 } from "lucide-react";

export const CuotasMaster = () => {
    const {
        cuotas,
        loading,
        addCuotas,
        addCuotaItem,
        deleteCuota,
        deleteCuotaItem,
        allDeleteCuotas,
        editCuota,
        editCuotaItem,
        toggleCompleteCuota,
        toggleCompleteItem
    } = useCuotas();

    const { openModal,ModalComponent } = useConfirmModal();
    const [formData, setFormData] = useState({
        titulo: '',
        cuotas: '',
        monto: '',
        fecha: '',
    });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    const pageCount = Math.ceil(cuotas.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = cuotas.slice(offset, offset + itemsPerPage);

    useEffect(() => {
        if (cuotas.length > 0 && currentPage >= pageCount) {
            setCurrentPage(Math.max(0, pageCount - 1));
        }
    }, [cuotas.length, pageCount, currentPage]);

    const handleAddNota = () => {
        if (!formData.titulo.trim() || !formData.cuotas || !formData.monto || !formData.fecha) {
            alert('Todos los campos son requeridos');
            return;
        }

        addCuotas({
            titulo: formData.titulo.trim(),
            cuotas: Number(formData.cuotas),
            monto: Number(formData.monto),
            fecha: formData.fecha,
        });

        setFormData({
            titulo: '',
            cuotas: '',
            monto: '',
            fecha: '',
        });
    };

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

                    <Tooltip title="Eliminar todas las tareas" arrow>
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
                </div>
            </div>

            {cuotas.length === 0 ? (
                <div className="notas-empty">
                    <p>No hay cuotas que pagar </p>
                </div>
            ) : (
                <Container style={{ marginTop: 30, padding: 0 }}>
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
                    totalItems={cuotas.length}
                    offset={offset}
                    pageCount={pageCount}
                    itemsPerPage={itemsPerPage}
                />
            )}

            

            <ModalComponent />
            <Toaster />
        </div>
    );
};

export default CuotasMaster;