import { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip, Collapse, IconButton } from "@mui/material";
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
    ArrowRight,
    CreditCard,
    Clock,
    ChevronDown
} from "lucide-react";
import { useGastos } from "../../context/gastosContext";
import { useUser } from "../../features/hooks/useUser";
import "../../style/dashboard.css"
import { Spinner } from "../../components/ui/spinner/spinner";
import { InfoDashboard } from "../../components/ui/info/dashboardInfo";
import { UseCuota } from "../../context/useCuotasContext";
import { WelcomeModal } from "../../components/ui/modalWelcome";

const PODIO_ICONOS = [
    <Trophy size={16} className="dashboard-top__medal dashboard-top__medal--oro" />,
    <Medal size={16} className="dashboard-top__medal dashboard-top__medal--plata" />,
    <Award size={16} className="dashboard-top__medal dashboard-top__medal--bronce" />
];

const PAGADAS_VISIBLES_INICIAL = 5;

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

    const {
        proximaCuota,
        cuotasPorVencer,
        cuotasVencidas,
        cuotasPagadasDelMes
    } = UseCuota()

    const [mostrarTodasPagadas, setMostrarTodasPagadas] = useState(false);

    if (loading) {
        return (
            <div className="table-container">
                <Spinner size="lg" label="Cargando datos..." />
            </div>
        );
    }

    const proxima = proximaCuota();
    const porVencer = cuotasPorVencer(7);
    const listaVencidas = cuotasVencidas();
    const pagadasDelMes = cuotasPagadasDelMes();

    const hayPorVencer = porVencer.length > 0 || Boolean(proxima);

    const pagadasIniciales = pagadasDelMes.slice(0, PAGADAS_VISIBLES_INICIAL);
    const pagadasExtra = pagadasDelMes.slice(PAGADAS_VISIBLES_INICIAL);

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

    const vencidasVisibles = listaVencidas.slice(0, 3);
    const vencidasRestantes = listaVencidas.length - vencidasVisibles.length;

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
            <WelcomeModal
                userName={user?.name || ''}
                userId={user?.id || user?.email || ''}
            />

            <div className="dashboard-header">
                <h2 className="table-title">
                    <Tooltip title="Info gasto" arrow>
                        <InfoDashboard />
                    </Tooltip>
                    Hola, {user?.name || '?'}
                </h2>
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
                                        ${(comparacion.diferencia).toLocaleString('es-AR')}
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

                <div className="dashboard-panel dashboard-panel--full">
                    <div className="dashboard-panel__header dashboard-panel__header--danger">
                        <AlertTriangle size={17} />
                        <h3>Cuotas vencidas</h3>
                    </div>

                    {listaVencidas.length > 0 ? (
                        <div className="dashboard-panel__list dashboard-panel__list--no-border">
                            <p className="dashboard-panel__list-title">Pagar cuanto antes</p>
                            <ul>
                                {vencidasVisibles.map((cuota, idx) => (
                                    <li
                                        key={`${cuota.cuotaId}-${cuota.numeroCuota}-${idx}`}
                                        className="dashboard-pendiente dashboard-pendiente--vencida"
                                    >
                                        <AlertTriangle size={14} />
                                        <div className="dashboard-pendiente__body">
                                            <strong>{cuota.titulo}</strong>
                                            <span className="dashboard-pendiente__meta">
                                                Cuota {cuota.numeroCuota}/{cuota.totalCuotas}
                                                {' · venció el '}
                                                {new Date(cuota.fecha).toLocaleDateString('es-AR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <span className="dashboard-pendiente__monto">
                                            ${cuota.precio.toLocaleString('es-AR')}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {vencidasRestantes > 0 && (
                                <Link to="/cuotas" className="dashboard-panel__link">
                                    +{vencidasRestantes} más <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    ) : (
                        <p className="dashboard-empty-ok">
                            <CheckCircle2 size={16} />
                            No tenés cuotas vencidas
                        </p>
                    )}
                </div>

                <div className="dashboard-panel dashboard-panel--full">
                    <div className="dashboard-panel__header">
                        <CreditCard size={17} />
                        <h3>Cuotas por vencer</h3>
                    </div>

                    {hayPorVencer ? (
                        <>
                            {porVencer.length > 0 && (
                                <span className="dashboard-chip dashboard-chip--warn">
                                    <Clock size={13} />
                                    {porVencer.length} por vencer
                                </span>
                            )}

                            {proxima && (
                                <div className="dashboard-cuota-proxima">
                                    <Clock size={14} />
                                    <div className="dashboard-cuota-proxima__info">
                                        <strong>{proxima.titulo}</strong>
                                        <span className="dashboard-cuota-proxima__meta">
                                            Cuota {proxima.numeroCuota}/{proxima.totalCuotas}
                                            {' · '}
                                            {new Date(proxima.fecha).toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <span className="dashboard-cuota-proxima__monto">
                                        ${proxima.precio.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            )}

                            <Link to="/cuotas" className="dashboard-panel__link">
                                Ver cuotas <ArrowRight size={14} />
                            </Link>
                        </>
                    ) : (
                        <p className="dashboard-empty-ok">
                            <CheckCircle2 size={16} />
                            No tenés cuotas por vencer
                        </p>
                    )}
                </div>

                <div className="dashboard-panel dashboard-panel--full">
                    <div className="dashboard-panel__header">
                        <CheckCircle2 size={17} />
                        <h3>Cuotas pagadas del mes</h3>
                    </div>

                    {pagadasDelMes.length > 0 ? (
                        <>
                            <p className="dashboard-panel__stat">
                                {pagadasDelMes.length} cuota{pagadasDelMes.length !== 1 ? 's' : ''} pagada{pagadasDelMes.length !== 1 ? 's' : ''}
                            </p>

                            <ul className="dashboard-pagadas">
                                {pagadasIniciales.map((cuota, idx) => (
                                    <li key={`${cuota.cuotaId}-${cuota.numeroCuota}-${idx}`} className="dashboard-pagada">
                                        <CheckCircle2 size={14} className="dashboard-pagada__icon" />
                                        <div className="dashboard-pagada__info">
                                            <strong>{cuota.titulo}</strong>
                                            <span className="dashboard-pagada__meta">
                                                Cuota {cuota.numeroCuota}/{cuota.totalCuotas}
                                                {' · '}
                                                {new Date(cuota.fecha).toLocaleDateString('es-AR', {
                                                    day: '2-digit',
                                                    month: 'short'
                                                })}
                                            </span>
                                        </div>
                                        <span className="dashboard-pagada__monto">
                                            ${cuota.precio.toLocaleString('es-AR')}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {pagadasExtra.length > 0 && (
                                <>
                                    <Collapse in={mostrarTodasPagadas} timeout="auto" unmountOnExit>
                                        <ul className="dashboard-pagadas dashboard-pagadas--extra">
                                            {pagadasExtra.map((cuota, idx) => (
                                                <li key={`${cuota.cuotaId}-${cuota.numeroCuota}-extra-${idx}`} className="dashboard-pagada">
                                                    <CheckCircle2 size={14} className="dashboard-pagada__icon" />
                                                    <div className="dashboard-pagada__info">
                                                        <strong>{cuota.titulo}</strong>
                                                        <span className="dashboard-pagada__meta">
                                                            Cuota {cuota.numeroCuota}/{cuota.totalCuotas}
                                                            {' · '}
                                                            {new Date(cuota.fecha).toLocaleDateString('es-AR', {
                                                                day: '2-digit',
                                                                month: 'short'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <span className="dashboard-pagada__monto">
                                                        ${cuota.precio.toLocaleString('es-AR')}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Collapse>

                                    <div
                                        className="dashboard-panel__toggle"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setMostrarTodasPagadas(v => !v)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setMostrarTodasPagadas(v => !v);
                                            }
                                        }}
                                    >
                                        <span>
                                            {mostrarTodasPagadas ? 'Ver menos' : `Ver ${pagadasExtra.length} más`}
                                        </span>
                                        <IconButton
                                            size="small"
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className={`dashboard-panel__toggle-icon${mostrarTodasPagadas ? ' dashboard-panel__toggle-icon--open' : ''}`}
                                        >
                                            <ChevronDown size={16} />
                                        </IconButton>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <p className="dashboard-card__empty">
                            Todavía no marcaste cuotas como pagadas este mes.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}