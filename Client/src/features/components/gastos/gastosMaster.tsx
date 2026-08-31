import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FilterX, Trash2 } from "lucide-react";
import { TransitionGroup } from "react-transition-group";
import { Button, Collapse, Tooltip, useMediaQuery } from "@mui/material";
import { UseGastos } from "./hooks/useGastos";
import type { IGastos } from "./types/type.gastos";
import { useGastosStats } from "./hooks/useGastosStats";
import { GastosForm } from "./ui/gastosForm";
import { GastosStats } from "./ui/gastosStats";
import { Buscador } from "./ui/buscador";
import { FilterGastos } from "./ui/filterGastos";
import { filterGastosBySearch } from "./utils/searchUtils";
import GastosContainer from "./gastosContainer";
import { ScrollTop } from "../../../components/ui/scrollTop";
import { PaginationComponent } from "../../../components/ui/pagination/pagination";
import { Toaster } from "react-hot-toast";
import axiosInstance from "../../../config/axiosConfig";
import { ModalConfirm } from "../../../components/ui/modalConfirm";
import { useConfirmModal } from "../../hooks/useModalConfirm";
import { GastosFijosMaster } from "../gastosFijos/gastosFijoMaster";

const GastosMaster = () => {
    const { gastos, setGastos, addGastos, deleteGastos, editGastos, loading, filterGastos, setFilterGastos, deleteFilteredGastos, allDeleteGastos } = UseGastos();

    const [limite, setLimite] = useState<string>("");
    const { lastSpend, totalMonto, limiteSpend } = useGastosStats(gastos, filterGastos, limite);
    const { openModal, ModalComponent } = useConfirmModal();

    const [formData, setFormData] = useState<IGastos>({
        fecha: '',
        producto: '',
        monto: 0,
        categoria: '',
        metodo: '',
        condicion: '',
        estado: ''
    });

    const isMobile = useMediaQuery('(max-width:500px)');
    const [showInputs, setShowInputs] = useState(true);

    const [activeFilter, setFilterActive] = useState<string>('');
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [monthFilter, setMonthFilter] = useState<string>('');
    const [yearFilter, setYearFilter] = useState<string>('');
    const [conditionsFilter, setConditionsFilter] = useState<string>('');
    const [metodoFilter, setMetodoFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');

    const [ordenAsc, setOrdenAsc] = useState<boolean>(true);

    const itemsToDisplay = filterGastos && filterGastos.length >= 0 ? filterGastos : gastos;
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 12;
    const pageCount = Math.ceil(itemsToDisplay.length / itemsPerPage);
    const offSet = currentPage * itemsPerPage;
    const currentItems = itemsToDisplay.slice(offSet, offSet + itemsPerPage);

    useEffect(() => {
        if (filterGastos !== gastos) {
            setCurrentPage(0);
        }
    }, [filterGastos, gastos]);

    useEffect(() => {
        const limiteGuardado = localStorage.getItem('limiteGasto');
        if (limiteGuardado) {
            setLimite(limiteGuardado);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('limiteGasto', String(limite));
        setShowInputs(isMobile);
    }, [limite, isMobile]);

    const searchGastos = (palabraClave: string) => {
        if (!palabraClave.trim()) {
            setFilterGastos(filterGastos || gastos);
            setFilterActive('');
            return;
        }

        const resultados = filterGastosBySearch(filterGastos || gastos, palabraClave);
        setFilterGastos(resultados);
        setFilterActive(palabraClave);
    };

    const handleSubmit = async () => {
        if (!formData.fecha || !formData.producto || !formData.monto ||
            !formData.categoria || !formData.metodo || !formData.condicion || !formData.estado) {
            alert('Todos los campos son requeridos');
            return;
        }

        const fechaEnvio = formData.fecha;

        await addGastos({
            fecha: fechaEnvio,
            producto: formData.producto,
            monto: formData.monto,
            categoria: formData.categoria,
            metodo: formData.metodo,
            condicion: formData.condicion,
            estado: formData.estado,
        });

        setFormData({
            fecha: '',
            producto: '',
            monto: 0,
            categoria: '',
            metodo: '',
            condicion: '',
            estado: ''
        });
    };

    const handleOrderByDate = () => {
        if (!filterGastos || filterGastos.length === 0) return;

        const getFechaParaOrdenar = (fecha: any): string => {
            if (!fecha) return '';

            if (fecha instanceof Date) {
                if (isNaN(fecha.getTime())) return '';
                const year = fecha.getFullYear();
                const month = String(fecha.getMonth() + 1).padStart(2, '0');
                const day = String(fecha.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            if (typeof fecha === 'string') {
                if (fecha.includes('T')) {
                    const parts = fecha.split('T')[0];
                    if (/^\d{4}-\d{2}-\d{2}$/.test(parts)) {
                        return parts;
                    }
                }
                if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                    return fecha;
                }
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
                    const [day, month, year] = fecha.split('/');
                    return `${year}-${month}-${day}`;
                }
                const date = new Date(fecha);
                if (!isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            }
            return '';
        };

        const ordenados = [...filterGastos].sort((a, b) => {
            const fechaA = getFechaParaOrdenar(a.fecha);
            const fechaB = getFechaParaOrdenar(b.fecha);

            if (!fechaA) return 1;
            if (!fechaB) return -1;

            return ordenAsc ? fechaA.localeCompare(fechaB) : fechaB.localeCompare(fechaA);
        });

        setFilterGastos(ordenados);
        setOrdenAsc(!ordenAsc);
        setCurrentPage(0);
    };

    type ExpenseFilterType = 'date' | 'month' | 'today' | 'year';

    const getFilterDescription = () => {
        const parts: string[] = [];

        if (activeFilter === 'fechas' || monthFilter || yearFilter) {
            const monthNames: Record<string, string> = {
                '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
                '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
                '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
            };
            if (monthFilter) parts.push(monthNames[monthFilter]);
            if (yearFilter) parts.push(yearFilter);
        }

        if (conditionsFilter) parts.push(`Condición: ${conditionsFilter}`);
        if (metodoFilter) parts.push(`Método: ${metodoFilter}`);
        if (estadoFilter) parts.push(`Estado: ${estadoFilter}`);

        return parts.length > 0 ? parts.join(' - ') : activeFilter;
    };

    const handleDeleteFiltered = async () => {
        const filterType = activeFilter as ExpenseFilterType;
        if (!filterType) return;

        await deleteFilteredGastos({
            filterType,
            ...(filterType === 'date' && { month: monthFilter, year: yearFilter })
        });
        setShowModalFilter(false);
        setFilterActive('');

        const response = await axiosInstance.get('/api/bills/filtered');
        setFilterGastos(response.data);
        setGastos(response.data);
    };

    const hasActiveFilters = Boolean(
        monthFilter || yearFilter || conditionsFilter || metodoFilter || estadoFilter || activeFilter 
    );

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Gastos Mensuales</h2>

                <div className="header-actions">
                    <GastosForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        isLoading={loading}
                    />

                    <Tooltip title="Eliminar todas las tareas" arrow>
                        <button
                            className="delete-all-btn"
                            onClick={() => openModal(
                                allDeleteGastos,
                                "Confirmar borrado",
                                `¿Estás seguro que deseas eliminar todos los gastos (${gastos.length})?`,
                                "Eliminar Todas"
                            )}
                        >
                            <Trash2 size={18} />
                            Eliminar Todas ({gastos.length})
                        </button>
                    </Tooltip>

                    {hasActiveFilters && filterGastos.length > 0 && (
                        <Tooltip title={`Eliminar solo los gastos de: ${getFilterDescription()}`} arrow>
                            <button
                                className="delete-all-btn"
                                onClick={() => openModal(
                                    handleDeleteFiltered,
                                    "Eliminar gastos filtrados",
                                    `¿Estás seguro que deseas eliminar todas las metas de "${getFilterDescription()}" (${filterGastos.length} metas)?`,
                                    `Eliminar ${filterGastos.length} metas`
                                )}
                            >
                                <Trash2 size={18} />
                                <FilterX size={14} />
                                <span>Eliminar Filtradas ({filterGastos.length})</span>
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>

            <GastosFijosMaster />
            <FilterGastos
                gastos={gastos}
                setFilterGastos={setFilterGastos}
                onFilterChange={({
                    monthFilter,
                    yearFilter,
                    conditions,
                    metodoFilter,
                    estadoFilter
                }) => {
                    setMonthFilter(monthFilter);
                    setYearFilter(yearFilter);
                    setConditionsFilter(conditions);
                    setMetodoFilter(metodoFilter);
                    setEstadoFilter(estadoFilter);

                    const hasFilters = monthFilter || yearFilter || conditions || metodoFilter || estadoFilter;
                    setFilterActive(hasFilters ? 'fechas' : '');
                }}
            />

            <Buscador filtrarDatos={searchGastos} />

            <Button
                onClick={() => setShowInputs(prev => !prev)}
                startIcon={showInputs ? <ChevronDown /> : <ChevronUp />}
                sx={{ margin: '1rem 0 .5rem' }}
            />

            <TransitionGroup>
                {!showInputs && (
                    <Collapse>
                        <GastosStats
                            lastSpend={lastSpend}
                            totalMonto={String((totalMonto).toLocaleString('es-AR', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }))}
                            limiteSpend={limiteSpend}
                            limite={limite}
                            setLimite={setLimite}
                            loading={loading}
                        />
                    </Collapse>
                )}
            </TransitionGroup>

            <GastosContainer
                gastos={gastos}
                filterGastos={currentItems}
                setFilterGastos={setFilterGastos}
                activeFilter={activeFilter}
                setGastos={setGastos}
                addGastos={addGastos}
                deleteGastos={deleteGastos}
                editGastos={editGastos}
                onSubmitGastos={handleSubmit}
                loading={loading}
                onOrderByDate={handleOrderByDate}
                ordenAsc={ordenAsc}
            />

            {pageCount > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={gastos.length}
                    offset={offSet}
                    pageCount={pageCount}
                    itemsPerPage={0}
                />
            )}

            <ModalComponent />

            {showModalFilter && (
                <ModalConfirm
                    isOpen={showModalFilter}
                    onClose={() => setShowModalFilter(false)}
                    onConfirm={handleDeleteFiltered}
                    title="Eliminar gastos filtrados"
                    message={`¿Estás seguro que deseas eliminar todas las metas de "${getFilterDescription()}" (${filterGastos.length} metas)?`}
                    confirmText={`Eliminar ${filterGastos.length} metas`}
                    cancelText="Cancelar"
                />
            )}

            <ScrollTop />
            <Toaster />
        </div>
    );
};

export default GastosMaster;