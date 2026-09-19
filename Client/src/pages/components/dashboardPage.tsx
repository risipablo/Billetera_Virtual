import { Link } from "react-router-dom";
import {
    Wallet,
    CalendarClock,
    Target,
    TrendingUp,
    TrendingDown,
    Minus,
    CheckCircle2,
    AlertTriangle,
    Trophy,
    Medal,
    Award,
    ArrowRight
} from "lucide-react";
import { useGastos } from "../../context/gastosContext";
import { useUser } from "../../features/hooks/useUser";
import "../../style/dashboard.css"
import { Spinner } from "../../components/ui/spinner/spinner";

const PODIO_ICONOS = [
    <Trophy size={16} className="dashboard-top__medal dashboard-top__medal--oro" />,
    <Medal size={16} className="dashboard-top__medal dashboard-top__medal--plata" />,
    <Award size={16} className="dashboard-top__medal dashboard-top__medal--bronce" />
];

export function DashboardPage() {
    const { user } = useUser();
    const {
        top3Gastos,
        top3Categorias,
        totalMes,
        totalMesAnterior,
        promedioGastos,
        estadosDePago,
        gastosImpagos,
        limiteInfo,
        setLimite,
        comparacionMes,
        loading
    } = useGastos();

    if (loading) {
        return (
            <div className="table-container">
                <Spinner size="lg" label="Cargando datos..." />
            </div>
        );
    }

    const top3 = top3Gastos();
    const top3Categoria = top3Categorias();
    const totalDelMes = totalMes();
    const mesAnterior = totalMesAnterior();
    const promedioDia = promedioGastos();
    const estadoPagos = estadosDePago();
    const impagos = gastosImpagos();
    const limite = limiteInfo();
    const comparacion = comparacionMes();

    const impagosVisibles = impagos.slice(0, 3);
    const restantes = impagos.length - impagosVisibles.length;

    const contextoKPI =
        estadoPagos.total === 0
            ? 'Sin gastos este mes'
            : estadoPagos.impagos === 0
            ? 'Todo al día'
            : `${estadoPagos.impagos} pendiente${estadoPagos.impagos !== 1 ? 's' : ''} · $${estadoPagos.montoPendiente.toLocaleString('es-AR')}`;

    const TrendIcon =
        comparacion.tendencia === 'up' ? TrendingUp
        : comparacion.tendencia === 'down' ? TrendingDown
        : Minus;

    return (
        <div className="table-container">
            <div className="dashboard-header">
                <h2 className="table-title">Hola, {user?.name || '?'}</h2>
                <p className="dashboard-subtitle">Aquí están tus registros de lo que va del mes</p>
            </div>

            
            <div className="dashboard-kpis">
                <div className="dashboard-card">
                    <div className="dashboard-card__icon dashboard-card__icon--blue">
                        <Wallet size={20} />
                    </div>
                    <div className="dashboard-card__body">
                        <span className="dashboard-card__label">Total del mes</span>

                        {totalDelMes > 0 ? (
                            <>
                                <p className="dashboard-card__value">
                                    ${totalDelMes.toLocaleString('es-AR')}
                                </p>

                                {comparacion.hayComparacion ? (
                                    <span className={`dashboard-trend dashboard-trend--${comparacion.tendencia}`}>
                                        <TrendIcon size={13} />
                                        {comparacion.diferencia > 0 ? '+' : ''}
                                        ${Math.abs(comparacion.diferencia).toLocaleString('es-AR')}
                                        {' '}({comparacion.variacion > 0 ? '+' : ''}
                                        {comparacion.variacion.toFixed(0)}%) vs. {comparacion.mesAnteriorNombre}
                                    </span>
                                ) : (
                                    <span className="dashboard-card__hint">Sin referencia del mes pasado</span>
                                )}

                                {mesAnterior > 0 && (
                                    <span className="dashboard-card__hint">
                                        Mes anterior: ${mesAnterior.toLocaleString('es-AR')}
                                    </span>
                                )}
                            </>
                        ) : (
                            <p className="dashboard-card__empty">No hay gastos registrados para este mes.</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card__icon dashboard-card__icon--purple">
                        <CalendarClock size={20} />
                    </div>
                    <div className="dashboard-card__body">
                        <span className="dashboard-card__label">Promedio por día</span>
                        {promedioDia > 0 ? (
                            <p className="dashboard-card__value">${promedioDia.toLocaleString('es-AR')}</p>
                        ) : (
                            <p className="dashboard-card__empty">No hay gastos registrados para este mes.</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-card dashboard-card--limite">
                    <div className="dashboard-card__icon dashboard-card__icon--amber">
                        <Target size={20} />
                    </div>
                    <div className="dashboard-card__body">
                        <span className="dashboard-card__label">Límite mensual</span>

                        <input
                            type="number"
                            className="dashboard-input"
                            value={limite.limite || ''}
                            onChange={(e) => setLimite(Number(e.target.value))}
                            placeholder="Definí tu límite mensual"
                            min={0}
                        />

                        {limite.limite > 0 ? (
                            <>
                                <p className="dashboard-card__value dashboard-card__value--small">
                                    ${limite.monto.toLocaleString('es-AR')} / ${limite.limite.toLocaleString('es-AR')}
                                </p>

                                <div className="dashboard-progress">
                                    <div
                                        className="dashboard-progress__fill"
                                        style={{
                                            width: `${Math.min(100, limite.porcentaje)}%`,
                                            background: limite.color
                                        }}
                                    />
                                </div>

                                <span className="dashboard-card__hint" style={{ color: limite.color, fontWeight: 600 }}>
                                    {limite.mensaje}
                                </span>
                            </>
                        ) : (
                            <span className="dashboard-card__hint">
                                Definí un límite para ver tu progreso mensual.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ============ Paneles secundarios ============ */}
            <div className="dashboard-panels">
                <div className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <CheckCircle2 size={17} />
                        <h3>Estado de pagos</h3>
                    </div>

                    {estadoPagos.total > 0 ? (
                        <>
                            <p className="dashboard-panel__stat">
                                {estadoPagos.pagados} / {estadoPagos.total}
                            </p>
                            <span className={`dashboard-chip ${estadoPagos.impagos === 0 ? 'dashboard-chip--ok' : 'dashboard-chip--warn'}`}>
                                {contextoKPI}
                            </span>

                            {impagos.length > 0 && (
                                <div className="dashboard-panel__list">
                                    <p className="dashboard-panel__list-title">Productos pendientes</p>
                                    <ul>
                                        {impagosVisibles.map(g => (
                                            <li key={g._id} className="dashboard-pendiente">
                                                <AlertTriangle size={14} />
                                                <strong>{g.producto}</strong>
                                                <span>${g.monto.toLocaleString('es-AR')}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {restantes > 0 && (
                                        <Link to="/gastos?estado=impago" className="dashboard-panel__link">
                                            +{restantes} más <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="dashboard-card__empty">Sin gastos este mes.</p>
                    )}
                </div>

                <div className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <Trophy size={17} />
                        <h3>Top 3 de gastos</h3>
                    </div>

                    {top3.length > 0 ? (
                        <ul className="dashboard-top">
                            {top3.map((topGasto, index) => (
                                <li
                                    key={topGasto.producto}
                                    className={`dashboard-top__item${index === 0 ? ' dashboard-top__item--primero' : ''}`}
                                >
                                    {PODIO_ICONOS[index]}
                                    <strong>{topGasto.producto}</strong>
                                    <span>${topGasto.monto.toLocaleString('es-AR')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="dashboard-card__empty">No hay gastos registrados para este mes.</p>
                    )}
                </div>

                <div className="dashboard-panel">
                    <div className="dashboard-panel__header">
                        <Award size={17} />
                        <h3>Top 3 de categorías</h3>
                    </div>

                    {top3Categoria.length > 0 ? (
                        <ul className="dashboard-top">
                            {top3Categoria.map((topGasto, index) => (
                                <li
                                    key={topGasto.categoria}
                                    className={`dashboard-top__item${index === 0 ? ' dashboard-top__item--primero' : ''}`}
                                >
                                    {PODIO_ICONOS[index]}
                                    <strong>{topGasto.categoria}</strong>
                                    <span>${topGasto.monto.toLocaleString('es-AR')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="dashboard-card__empty">No hay categorías con gastos este mes.</p>
                    )}
                </div>
            </div>
        </div>
    );
}