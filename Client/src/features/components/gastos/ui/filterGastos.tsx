import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Calendar, ChevronDown, Filter, RotateCcw, X } from "lucide-react"
import { Button, Tooltip } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';
import "../style/filters.css"
import type { IGastos } from "../types/type.gastos";


type Props = {
    gastos:IGastos[]
    setFilterGastos:React.Dispatch<React.SetStateAction<IGastos[]>>
    onFilterChange?:(filters:{dateFilter:string; monthFilter:string; yearFilter:string, conditions:string, metodoFilter:string, estadoFilter:string}) => void
}


export const FilterGastos = ({
    gastos,
    onFilterChange,
    setFilterGastos,
}:Props) => {

    const [showToday, setShowToday] = useState(false);
    const [dateFilter, setDateFilter] = useState<string>('')
    const [monthFilter, setMonthFilter] = useState<string>('')
    const [yearFilter, setYearFilter] = useState<string>('')

    const [tempMonth, setTempMonth] = useState<string>('')
    const [tempYear, setTempYear] = useState<string>('')
    const [pendingDate, setPendingDate] = useState<string>('')

    const [conditions, setConditions] = useState<string>('')
    const [metodoFilter, setMetodoFilter] = useState<string>('')
    const [estadoFilter, setEstadoFilter] = useState<string>('')

    
    const [dateOpen, setDateOpen] = useState(false)
    const [classifyOpen, setClassifyOpen] = useState(false)

    const dateRef = useRef<HTMLDivElement>(null)
    const classifyRef = useRef<HTMLDivElement>(null)

    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
                setDateOpen(false)
            }
            if (classifyRef.current && !classifyRef.current.contains(e.target as Node)) {
                setClassifyOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const normalDate = useCallback((dateInput: string | Date):string => {
        if(!dateInput) return ''
        const dateStr = typeof dateInput === 'object' ? dateInput.toISOString():dateInput
        if(dateStr.includes("T")){
            return dateStr.split("T")[0]
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }
        return dateStr;
    },[])

    const filteredBills = useMemo(() => {
        let filtered = [...gastos]

        if (conditions){
            filtered = filtered.filter(g => g.condicion === conditions)
        }
        if (metodoFilter){
            filtered = filtered.filter(g => g.metodo === metodoFilter)
        }
        if (estadoFilter){
            filtered = filtered.filter(g => g.estado === estadoFilter)
        }
        if(showToday){
            const todayStr = normalDate(new Date())
            return filtered.filter(t => normalDate(t.fecha) === todayStr)
        }
        if(dateFilter){
            filtered = filtered.filter(t => normalDate(t.fecha) === dateFilter)
        }
        if(monthFilter || yearFilter){
            filtered = filtered.filter(t => {
                const normalized = normalDate(t.fecha)
                const [year, month] = normalized.split('-');
                const matchMonth = monthFilter ? month === monthFilter : true;
                const matchYear = yearFilter ? year === yearFilter : true;
                return matchMonth && matchYear;
            })
        }
        return filtered
    },[gastos, showToday, dateFilter, conditions, estadoFilter, metodoFilter, monthFilter, yearFilter, normalDate])

    const mesActual = () => {
        const fecha = new Date();
        const mesNumero = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = String(fecha.getFullYear());
        setMonthFilter(mesNumero);
        setYearFilter(año);
        setDateFilter('');
        setShowToday(false);
    }

    const dateFiltersCount = [showToday, !!dateFilter, !!(monthFilter || yearFilter)].filter(Boolean).length
    const classifyFiltersCount = [!!conditions, !!metodoFilter, !!estadoFilter].filter(Boolean).length
    const hasActiveFilters = dateFiltersCount > 0 || classifyFiltersCount > 0

    useEffect(() => {
        setFilterGastos(filteredBills)
        if (onFilterChange) {
            onFilterChange({dateFilter, monthFilter, yearFilter, conditions, metodoFilter, estadoFilter});
        }
    },[filteredBills])

    const openDatePopover = () => {
        setPendingDate(dateFilter)
        setTempMonth(monthFilter)
        setTempYear(yearFilter)
        setDateOpen(true)
        setClassifyOpen(false)
    }

    const applyDateFilters = () => {
        setDateFilter(pendingDate)
        setMonthFilter(tempMonth)
        setYearFilter(tempYear)
        if (pendingDate || tempMonth || tempYear) {
            setShowToday(false)
        }
        setDateOpen(false)
    }

    const clearDateFilters = () => {
        setShowToday(false)
        setDateFilter('')
        setMonthFilter('')
        setYearFilter('')
        setPendingDate('')
        setTempMonth('')
        setTempYear('')
        setDateOpen(false)
    }

    const clearClassifyFilters = () => {
        setConditions('')
        setMetodoFilter('')
        setEstadoFilter('')
        setClassifyOpen(false)
    }

    const resetAllFilters = () => {
        clearDateFilters()
        clearClassifyFilters()
    }

    return(
        <>
            <div className="filter-buttons-group">
                <div className="filter-row">

    
                    <Tooltip title="Ir al mes actual" arrow>
                        <Button
                            variant="contained"
                            className="mui-shortcut-btn"
                            sx={{
                                fontFamily: "Montserrat, sans-serif",
                                backgroundColor: "#fff",
                                color: "#302f2fff",
                                minWidth: 0,
                                padding: "8px",
                                border: "1px solid var(--border)",
                                boxShadow: "none",
                                '&:hover': {
                                    backgroundColor: "#f0f0f0",
                                    boxShadow: "none",
                                }
                            }}
                            onClick={mesActual}
                        >
                            <DateRangeIcon sx={{ color: "#000" }} />
                        </Button>
                    </Tooltip>

    
                    <div className="filter-trigger-wrapper" ref={dateRef}>
                        <button
                            className={`btn-toggle-view ${dateFiltersCount > 0 ? 'active' : ''}`}
                            onClick={() => dateOpen ? setDateOpen(false) : openDatePopover()}
                        >
                            <Calendar size={16} />
                            Fecha
                            {dateFiltersCount > 0 && <span className="filter-badge">{dateFiltersCount}</span>}
                            <ChevronDown size={14} />
                        </button>

                        {dateOpen && (
                            <div className="filter-popover">
                                <div className="filter-popover-header">
                                    <span>Fecha</span>
                                    <button className="popover-close" onClick={() => setDateOpen(false)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <button
                                    className={`btn-toggle-view popover-full-btn ${showToday ? 'active' : ''}`}
                                    onClick={() => {
                                        const next = !showToday
                                        setShowToday(next)
                                        if (next) {
                                            setPendingDate('')
                                            setTempMonth('')
                                            setTempYear('')
                                        }
                                    }}
                                >
                                    <Calendar size={16} />
                                    {showToday ? 'Viendo solo hoy' : 'Ver Hoy'}
                                </button>

                                <p className="popover-label">Fecha específica</p>
                                <input
                                    type="date"
                                    className="filter-input popover-full-input"
                                    value={pendingDate}
                                    onChange={(e) => setPendingDate(e.target.value)}
                                />

                                <p className="popover-label">Mes y año</p>
                                <div className="popover-inline-group">
                                    <select
                                        className="filter-input"
                                        value={tempMonth}
                                        onChange={(e) => setTempMonth(e.target.value)}
                                    >
                                        <option value="">Mes</option>
                                        <option value="01">Enero</option>
                                        <option value="02">Febrero</option>
                                        <option value="03">Marzo</option>
                                        <option value="04">Abril</option>
                                        <option value="05">Mayo</option>
                                        <option value="06">Junio</option>
                                        <option value="07">Julio</option>
                                        <option value="08">Agosto</option>
                                        <option value="09">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                    </select>
                                    <select
                                        className="filter-input"
                                        value={tempYear}
                                        onChange={(e) => setTempYear(e.target.value)}
                                    >
                                        <option value="">Año</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                        <option value="2028">2028</option>
                                        <option value="2029">2029</option>
                                        <option value="2030">2030</option>
                                    </select>
                                </div>

                                <div className="popover-actions">
                                    <button className="task-btn task-btn-secondary" onClick={clearDateFilters}>
                                        Limpiar
                                    </button>
                                    <button className="task-btn task-btn-primary" onClick={applyDateFilters}>
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

    
                    <div className="filter-trigger-wrapper" ref={classifyRef}>
                        <button
                            className={`btn-toggle-view ${classifyFiltersCount > 0 ? 'active' : ''}`}
                            onClick={() => setClassifyOpen(!classifyOpen)}
                        >
                            <Filter size={16} />
                            Filtros
                            {classifyFiltersCount > 0 && <span className="filter-badge">{classifyFiltersCount}</span>}
                            <ChevronDown size={14} />
                        </button>

                        {classifyOpen && (
                            <div className="filter-popover">
                                <div className="filter-popover-header">
                                    <span>Clasificación</span>
                                    <button className="popover-close" onClick={() => setClassifyOpen(false)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <select
                                    className="filter-input popover-full-input"
                                    value={conditions}
                                    onChange={(e) => setConditions(e.target.value)}
                                >
                                    <option value="">Seleccionar Condición</option>
                                    {["Fijo", "Necesario", "Innecesario", "Sin Valor","Cuotas"].map(item =>
                                        <option key={item} value={item}>{item}</option>
                                    )}
                                </select>

                                <select
                                    className="filter-input popover-full-input"
                                    value={metodoFilter}
                                    onChange={(e) => setMetodoFilter(e.target.value)}
                                >
                                    <option value="">Seleccionar método</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Crédito">Crédito</option>
                                    <option value="Débito">Débito</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>

                                <select
                                    className="filter-input popover-full-input"
                                    value={estadoFilter}
                                    onChange={(e) => setEstadoFilter(e.target.value)}
                                >
                                    <option value="">Seleccionar Estado</option>
                                    {["Pagado", "Impago", "Deben", "Cuotas", "Devolver", "Cajero", "Inversion"].map(estado =>
                                        <option key={estado} value={estado}>{estado}</option>
                                    )}
                                </select>

                                <div className="popover-actions">
                                    <button className="task-btn task-btn-secondary" onClick={clearClassifyFilters}>
                                        Limpiar
                                    </button>
                                    <button className="task-btn task-btn-primary" onClick={() => setClassifyOpen(false)}>
                                        Listo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={resetAllFilters}
                            className="btn-toggle-view btn-reset"
                        >
                            <RotateCcw size={16} />
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}