import { useEffect, useMemo, useState } from 'react';
import './style/metas.css';
import { useMetas } from './hooks/useMetas';

import { MetaForm } from './ui/metaForm';
import { AporteModal } from './ui/aporteModal';

import type {
    IMeta,
    CrearMetaPayload,
    EditarMetaPayload,
    EstadoMeta
} from './types/type.meta';
import { PaginationComponent } from '../../../components/ui/pagination/pagination';
import { MetaCard } from './components/metaCard';

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

export const MetaMaster = () => {
    const {
        metas,
        loading,
        error,
        crearMeta,
        editarMeta,
        eliminarMeta,
        agregarAporte
    } = useMetas();

    const [filtroEstado, setFiltroEstado] = useState<EstadoMeta | 'todas'>('todas');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [formData, setFormData] = useState<IMeta | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);

    const [metaAportando, setMetaAportando] = useState<IMeta | null>(null);
    const [guardando, setGuardando] = useState<boolean>(false);

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

    const metasPaginadas = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return metasFiltradas.slice(start, start + ITEMS_PER_PAGE);
    }, [metasFiltradas, currentPage]);

    useEffect(() => {
        setCurrentPage(0);
    }, [filtroEstado, filtroCategoria]);

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

        const restantes = metasFiltradas.length - 1;
        const nuevasPaginas = Math.max(1, Math.ceil(restantes / ITEMS_PER_PAGE));
        if (currentPage >= nuevasPaginas) {
            setCurrentPage(nuevasPaginas - 1);
        }
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

    return (
        <div className="table-container">
            <div className="table-container">
                <h2 className="table-title">Mis Metas</h2>

                <div className="headers-actions">
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
                </div>
            </div>

            <div className="metas-page__toolbar">
                <div className="metas-page__filtros">
                    {(['todas', 'activa', 'pausada', 'completada', 'cancelada'] as const).map(
                        f => (
                            <button
                                key={f}
                                className={filtroEstado === f ? 'active' : ''}
                                onClick={() => setFiltroEstado(f)}
                            >
                                {f}
                            </button>
                        )
                    )}
                </div>

                <div className="metas-page__filtros">
                    <button
                        className={filtroCategoria === 'todas' ? 'active' : ''}
                        onClick={() => setFiltroCategoria('todas')}
                    >
                        todas
                    </button>
                    {categoriasDisponibles.map(cat => (
                        <button
                            key={cat}
                            className={filtroCategoria === cat ? 'active' : ''}
                            onClick={() => setFiltroCategoria(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                
            </div>



            {error && <p className="metas-page__error">{error}</p>}

            {loading && <p className="metas-page__loading">Cargando metas...</p>}

            {!loading && metasFiltradas.length === 0 && (
                <div className="metas-page__empty">
                    <p>No tenés metas todavía.</p>
                    <p>Creá una para empezar a ahorrar con un objetivo claro.</p>
                </div>
            )}

            

            <div className="metas-page__grid">
                {metasPaginadas.map(meta => (
                    <MetaCard
                        key={meta._id}
                        meta={meta}
                        onAportar={setMetaAportando}
                        onEditar={abrirEditar}
                        onEliminar={handleEliminar}
                    />
                ))}
            </div>

            <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageCount={pageCount} totalItems={0}  
            />

            <AporteModal
                meta={metaAportando}
                onClose={() => setMetaAportando(null)}
                onSubmit={handleAporte}
                loading={guardando}
            />
            
            
        </div>
        
    );
};