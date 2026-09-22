import { useEffect, useMemo, useState } from 'react';
import './style/metas.css';
import { useMetas } from './hooks/useMetas';
import { MetaForm } from './ui/metaForm';
import { AporteModal } from './ui/aporteModal';
import { MetaCard } from './components/metaCard';
import { PaginationComponent } from '../../../components/ui/pagination/pagination';
import { useConfirmModal } from '../../hooks/useModalConfirm';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { Spinner } from '../../../components/ui/spinner/spinner';
import { Tooltip } from '@mui/material';
import { FilterX, Trash2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import type {
    IMeta,
    CrearMetaPayload,
    EditarMetaPayload,
    EstadoMeta
} from './types/type.meta';
import { InfoMetas } from '../../../components/ui/info/metasInfo';

const ITEMS_PER_PAGE = 3;

const FORM_VACIO: IMeta = {
    _id: '',
    userId: '',
    nombre: '',
    descripcion: '',
    montoObjetivo: 0,
    fecha: '',
    categoria: '',
    estado: 'activa',
    aportes: [],
    montoActual: 0,
    progreso: 0,
    createdAt: '',
    updatedAt: ''
};

const ESTADOS: { value: EstadoMeta | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todos los estados' },
    { value: 'activa', label: 'Activa' },
    { value: 'pausada', label: 'Pausada' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' }
];

export const MetaMaster = () => {
    const {
        metas,
        loading,
        error,
        crearMeta,
        editarMeta,
        eliminarMeta,
        agregarAporte,
        deleteFilteredMetas,
        allDeleteMetas
    } = useMetas();

    const [filtroEstado, setFiltroEstado] = useState<EstadoMeta | 'todas'>('todas');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [formData, setFormData] = useState<IMeta | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);

    const [metaAportando, setMetaAportando] = useState<IMeta | null>(null);
    const [guardando, setGuardando] = useState<boolean>(false);

    const { openModal, ModalComponent } = useConfirmModal();

    const categoriasDisponibles = useMemo(() => {
        const set = new Set<string>();
        metas.forEach(m => m.categoria && set.add(m.categoria));
        return Array.from(set);
    }, [metas]);

    const metasFiltradas = useMemo(() => {
        return metas.filter(m => {
            const okEstado = filtroEstado === 'todas' || m.estado === filtroEstado;
            const okCategoria =
                filtroCategoria === 'todas' || m.categoria === filtroCategoria;
            return okEstado && okCategoria;
        });
    }, [metas, filtroEstado, filtroCategoria]);

    const pageCount = Math.max(1, Math.ceil(metasFiltradas.length / ITEMS_PER_PAGE));

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = metasFiltradas.slice(offset, offset + ITEMS_PER_PAGE);

    const hasActiveFilters = Boolean(
        filtroEstado !== 'todas' || filtroCategoria !== 'todas'
    );

    useEffect(() => {
        setCurrentPage(0);
    }, [filtroEstado, filtroCategoria]);

    useEffect(() => {
        if (metasFiltradas.length > 0 && currentPage >= pageCount) {
            setCurrentPage(Math.max(0, pageCount - 1));
        }
    }, [metasFiltradas.length, pageCount, currentPage]);

    const abrirCrear = () => {
        setFormData({ ...FORM_VACIO });
        setIsEdit(false);
        setShowForm(true);
    };

    const abrirEditar = (meta: IMeta) => {
        setFormData({ ...meta });
        setIsEdit(true);
        setShowForm(true);
    };

    const cerrarForm = () => {
        setShowForm(false);
        setFormData(null);
        setIsEdit(false);
    };

    const handleSubmitForm = async () => {
        if (!formData) return;
        setGuardando(true);
        try {
            if (isEdit && formData._id) {
                const payload: EditarMetaPayload = {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    montoObjetivo: formData.montoObjetivo,
                    fecha: formData.fecha,
                    categoria: formData.categoria,
                    estado: formData.estado
                };
                await editarMeta(formData._id, payload);
            } else {
                const payload: CrearMetaPayload = {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    montoObjetivo: formData.montoObjetivo,
                    fecha: formData.fecha,
                    categoria: formData.categoria
                };
                await crearMeta(payload);
            }
            cerrarForm();
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (meta: IMeta) => {
        await eliminarMeta(meta._id);
    };

    const handleAporte = async (
        metaId: string,
        payload: { monto: number; nota?: string }
    ) => {
        setGuardando(true);
        try {
            await agregarAporte(metaId, payload);
        } finally {
            setGuardando(false);
        }
    };

    const getFilterDescription = () => {
        const parts: string[] = [];
        if (filtroEstado !== 'todas') parts.push(`Estado: ${filtroEstado}`);
        if (filtroCategoria !== 'todas') parts.push(`Categoría: ${filtroCategoria}`);
        return parts.length > 0 ? parts.join(' - ') : 'sin filtros';
    };

    const handleDeleteFiltered = async () => {
        const idsToDelete = metasFiltradas
            .map(m => m._id)
            .filter((id): id is string => Boolean(id));
        if (idsToDelete.length === 0) return;

        await deleteFilteredMetas(idsToDelete);
        setFiltroEstado('todas');
        setFiltroCategoria('todas');
        setCurrentPage(0);
    };

    if (loading) {
        return (
            <div className="notas-loading">
                <Spinner size="lg" label="Cargando metas..." />
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title"> 
                    <Tooltip title="Info gasto" arrow >
                            <InfoMetas />
                        </Tooltip>Mis Metas</h2>

                <div className="header-actions">
                    <MetaForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmitForm}
                        onCancel={cerrarForm}
                        Isloading={guardando}
                        isOpen={showForm}
                        onOpen={abrirCrear}
                        isEdit={isEdit}
                    />

                    <Tooltip title="Eliminar todas las metas" arrow>
                        <button
                            className="delete-all-btn"
                            onClick={() => openModal(
                                allDeleteMetas,
                                "Confirmar borrado",
                                `¿Estás seguro que deseas eliminar todas las metas (${metas.length})?`,
                                "Eliminar Todas"
                            )}
                        >
                            <Trash2 size={18} />
                            Eliminar Todas ({metas.length})
                        </button>
                    </Tooltip>

                    {hasActiveFilters && metasFiltradas.length > 0 && (
                        <Tooltip
                            title={`Eliminar solo las metas de: ${getFilterDescription()}`}
                            arrow
                        >
                            <button
                                className="delete-all-btn"
                                onClick={() => openModal(
                                    handleDeleteFiltered,
                                    "Eliminar metas filtradas",
                                    `¿Estás seguro que deseas eliminar todas las metas de "${getFilterDescription()}" (${metasFiltradas.length})?`,
                                    `Eliminar ${metasFiltradas.length} metas`
                                )}
                            >
                                <Trash2 size={18} />
                                <FilterX size={14} />
                                <span>Eliminar Filtradas ({metasFiltradas.length})</span>
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className="metas-page__toolbar">
                <select
                    className="metas-page__filtro-select"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value as EstadoMeta | 'todas')}
                    aria-label="Filtrar por estado"
                >
                    {ESTADOS.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <select
                    className="metas-page__filtro-select"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    aria-label="Filtrar por categoría"
                >
                    <option value="todas">Todas las categorías</option>
                    {categoriasDisponibles.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="metas-page__error">{error}</p>}

            {currentItems.length === 0 ? (
                <div className="notas-empty">
                    <p>
                        {metas.length === 0
                            ? 'No hay metas todavía'
                            : 'No hay metas que coincidan con el filtro seleccionado'}
                    </p>
                </div>
            ) : (
                <>
                    <span
                        className="filter-results-count"
                        style={{ marginBottom: 10, display: 'block' }}
                    >
                        Mostrando {metasFiltradas.length} de {metas.length} metas
                    </span>

                    <div className="metas-page__grid">
                        {currentItems.map(meta => (
                            <MetaCard
                                key={meta._id}
                                meta={meta}
                                onAportar={setMetaAportando}
                                onEditar={abrirEditar}
                                onEliminar={handleEliminar}
                            />
                        ))}
                    </div>
                </>
            )}

            {pageCount > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={metasFiltradas.length}
                    offset={offset}
                    pageCount={pageCount}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            )}

            <AporteModal
                meta={metaAportando}
                onClose={() => setMetaAportando(null)}
                onSubmit={handleAporte}
                loading={guardando}
            />

            <ModalComponent />
            <Toaster />
        </div>
    );
};