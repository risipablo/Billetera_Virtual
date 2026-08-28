// Listado.tsx
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { Trash2 } from "lucide-react";
import { Container, Grid } from "@mui/material";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useListado } from "./hooks/useListado";
import type { IListado } from "./types/type.listado";;
import { ListadoForm } from "./ui/listadoForm";
import { Spinner } from "../../../components/ui/spinner/spinner";
import { useConfirmModal } from "../../hooks/useModalConfirm";
import "./style/listado.css";
import { ListadoCard } from "./ui/listadoCard";

export const Listado = () => {
    const {
        list,
        loading,
        addList,
        editList,
        deleteList,
        deleteAllList,
        addListNote,
        deleteNoteItem,
        editNoteItem,
        toggleCompleteList,
        toggleCompleteItem,
    } = useListado();

    const { openModal, ModalComponent } = useConfirmModal();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState<IListado>({
        titulo: '',
        fecha: '',
        descripcion: [],
    });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const pageCount = Math.ceil(list.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = list.slice(offset, offset + itemsPerPage);

    useEffect(() => {
        if (list.length > 0 && currentPage >= pageCount) {
            setCurrentPage(Math.max(0, pageCount - 1));
        }
    }, [list.length, pageCount, currentPage]);

    const handleAddList = () => {
        if (!formData.titulo?.trim() || !formData.fecha) {
            alert('Todos los campos son requeridos');
            return;
        }
        addList(formData.titulo.trim(), formData.fecha);
        setFormData({ titulo: '', fecha: '', descripcion: [] });
    };

    const handleDeleteAll = () => {
        deleteAllList();
        setShowDeleteModal(false);
    };

    if (loading) {
        return (
            <div className="listado-loading">
                <Spinner size="lg" label="Cargando listados..." />
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Listado de compras</h2>

                <div className="header-actions">
                    <ListadoForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleAddList}
                        isLoading={loading}
                    />

                    {list.length > 0 && (
                        <Tooltip title="Eliminar todos los listados" arrow>
                            <button
                                className="delete-all-btn"
                                onClick={() => openModal(
                                    deleteAllList,
                                    "Confirmar borrado",
                                    `¿Estás seguro que deseas eliminar todos los listados (${list.length})?`,
                                    "Eliminar todos"
                                )}
                            >
                                <Trash2 size={18} />
                                Eliminar todos ({list.length})
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Empty state */}
            {list.length === 0 && (
                <div className="listado-empty">
                    <p>No hay listados de compras disponibles</p>
                </div>
            )}

            {/* Grid de listados */}
            {list.length > 0 && (
                <Container style={{ marginTop: 30, padding: 0 }}>
                    <Grid container spacing={4}>
                        {currentItems.map((listItem) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listItem._id}>
                                <ListadoCard
                                    list={listItem}
                                    onToggleComplete={toggleCompleteList}
                                    onDelete={deleteList}
                                    onAddItem={addListNote}
                                    onToggleItem={toggleCompleteItem}
                                    onDeleteItem={deleteNoteItem}
                                    onEditItem={editNoteItem}
                                    onEditList={editList}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            {/* Paginación */}
            {pageCount > 1 && (
                <ReactPaginate
                    previousLabel="Anterior"
                    nextLabel="Siguiente"
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item previous"
                    previousLinkClassName="page-link"
                    nextClassName="page-item next"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item break"
                    breakLinkClassName="page-link"
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                />
            )}

            <ModalComponent />
            <Toaster />
        </div>
    );
};

export default Listado;