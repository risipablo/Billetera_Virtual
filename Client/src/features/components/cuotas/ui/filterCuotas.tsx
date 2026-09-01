import { useEffect, useMemo, useState } from "react";
import type { ICuota } from "../types/type.cuotas";
import { RotateCcw } from "lucide-react";

type Props = {
    cuotas: ICuota[]
    setFilterCuotas: React.Dispatch<React.SetStateAction<ICuota[]>>
}

export const FilterCuotas = ({cuotas, setFilterCuotas}: Props) => {
    const [completeFilter, setCompleteFilter] = useState<string>('todos')
    const [selectedMonth, setSelectedMonth] = useState<string>('todos')
    const [selectedYear, setSelectedYear] = useState<string>('todos')

    // Obtener años únicos de las cuotas
    const availableYears = useMemo(() => {
        const years = new Set<string>()
        cuotas.forEach(cuota => {
            if (cuota.fechaCompra) {
                const year = new Date(cuota.fechaCompra).getFullYear().toString()
                years.add(year)
            }
    
            cuota.fecha?.forEach(date => {
                if (date) {
                    const year = new Date(date).getFullYear().toString()
                    years.add(year)
                }
            })
        })
        return Array.from(years).sort()
    }, [cuotas])

    
    const availableMonths = useMemo(() => {
        const months = new Set<string>()
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        
        cuotas.forEach(cuota => {
            if (cuota.fechaCompra) {
                const month = new Date(cuota.fechaCompra).getMonth()
                months.add(monthNames[month])
            }
        
            cuota.fecha?.forEach(date => {
                if (date) {
                    const month = new Date(date).getMonth()
                    months.add(monthNames[month])
                }
            })
        })
        return Array.from(months)
    }, [cuotas])

    const filteredCuotas = useMemo(() => {
        let filtered = [...cuotas]

        
        if (completeFilter === 'completadas') {
            filtered = filtered.filter(g => g.completed === true)
        } else if (completeFilter === 'pendientes') {
            filtered = filtered.filter(g => g.completed === false)
        }

        
        if (selectedMonth !== 'todos') {
            const monthIndex = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                               .indexOf(selectedMonth)
            
            filtered = filtered.filter(cuota => {
                // Revisar fecha de compra
                if (cuota.fechaCompra) {
                    const month = new Date(cuota.fechaCompra).getMonth()
                    if (month === monthIndex) return true
                }
        
                return cuota.fecha?.some(date => {
                    if (date) {
                        return new Date(date).getMonth() === monthIndex
                    }
                    return false
                })
            })
        }

        
        if (selectedYear !== 'todos') {
            const yearNum = parseInt(selectedYear)
            filtered = filtered.filter(cuota => {
                
                if (cuota.fechaCompra) {
                    const year = new Date(cuota.fechaCompra).getFullYear()
                    if (year === yearNum) return true
                }
                
                return cuota.fecha?.some(date => {
                    if (date) {
                        return new Date(date).getFullYear() === yearNum
                    }
                    return false
                })
            })
        }

        return filtered
    }, [cuotas, completeFilter, selectedMonth, selectedYear])

    useEffect(() => {
        setFilterCuotas(filteredCuotas)
    }, [filteredCuotas, setFilterCuotas])

    const handleReset = () => {
        setCompleteFilter("todos")
        setSelectedMonth("todos")
        setSelectedYear("todos")
    }

    const hasActiveFilters = completeFilter !== 'todos' || 
                            selectedMonth !== 'todos' || 
                            selectedYear !== 'todos'

    return(
        <div className="filter-container">
            <div className="filter-group">
                
                <select 
                    className={`btn-toggle-view ${completeFilter !== 'todos' ? 'active' : ''}`}
                    value={completeFilter} 
                    onChange={(e) => setCompleteFilter(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    <option value="completadas">Logrado</option> 
                    <option value="pendientes">Pendientes</option>
                </select>

                
                <select 
                    className={`btn-toggle-view ${selectedMonth !== 'todos' ? 'active' : ''}`}
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="todos">Todos los meses</option>
                    {availableMonths.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>

                
                <select 
                    className={`btn-toggle-view ${selectedYear !== 'todos' ? 'active' : ''}`}
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="todos">Todos los años</option>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                
                {hasActiveFilters && (
                    <button 
                        onClick={handleReset}  
                        className="btn-toggle-view btn-reset"
                    >
                        <RotateCcw size={18} />
                        Limpiar filtros
                    </button>
                )}
            </div>

            
            {filteredCuotas.length > 0 && (
                <span className="filter-results-count">
                    Mostrando {filteredCuotas.length} de {cuotas.length} cuotas
                </span>
            )}
        </div>
    )
}