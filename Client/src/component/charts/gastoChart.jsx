import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import { motion } from 'framer-motion';
import { Skeleton } from "@mui/material";
import "./chart.css"
import { useCallback, useEffect, useMemo, useState } from 'react';



const GastoChart = ({ gastos, loading,mesSeleccionado}) => {
    const isLoading = loading || !gastos || gastos.length === 0;

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // ajusta de font size donuts para mobile
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Gastos por mes
    const spentMonth = useMemo(() => {
        return gastos.reduce((acc, gasto) => {
            const mes = gasto.mes;
            const monto = gasto.monto;
            const conditions = gasto.condicion.toLowerCase();

            // verificar las condiciones del metodo de pago
            const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas']

            if (conditionsReduce.includes(conditions)) {
                return acc;
                // no suma en los gastos
            }

            if (!acc[mes]) acc[mes] = 0;
            acc[mes] += monto;

            return acc;
        }, {})
    },[gastos])


    const spentMonthMax = useMemo(()=> {
        return Object.keys(spentMonth).reduce((max,key) => {
            return spentMonth[key] > spentMonth[max] ? key : max;
        }, Object.keys(spentMonth)[0])
    },[spentMonth])

    const dataSpentMonth = useMemo(() => ({
        labels: Object.keys(spentMonth),
        datasets: [{
            label: 'Total de Gastos',
            data: Object.values(spentMonth), 
            backgroundColor: Object.keys(spentMonth).map((producto) => 
                producto === spentMonthMax ? 'rgba(209, 25, 25, 0.7)' : 'rgba(164, 11, 235,0.7)'),
            borderWidth: 0.5, 
            borderRadius: 5,  
            hoverBackgroundColor: Object.keys(spentMonth).map((producto) => 
                producto === spentMonthMax ? 'rgba(200, 25, 25)' : 'rgba(160, 11, 235)'),
            barPercentage: 1, 
        }]
    }), [spentMonth, spentMonthMax]);

     // Función optimizada para tooltips
    const tooltipLabelCallback = useCallback(function(tooltipItem) {
        return `Monto: $ ${tooltipItem.raw.toLocaleString()} `;
    }, []);

    
    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...Object.values(spentMonth)) * 1.2, 
                title: { display: true, text: 'Monto', font: { size: 18, family: 'Poppins, sans-serif' }, color: '#333' },
                ticks: { color: '#666' },
                grid: { color: 'rgba(200, 200, 200, 0.3)' }
            },
            x: {
                title: { display: true, text: 'Mes', font: { size: 14, family: 'Poppins, sans-serif' }, color: '#333' },
                ticks: { color: '#666' },
                grid: { display: false }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { color: '#333', font: { size: 18 } }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 18, weight: 'bold' },
                bodyFont: { size: 14 },
                borderColor: '#666',
                borderWidth: 1,
                callbacks: { label: tooltipLabelCallback }
            }
        },
        animation: { duration: 1500, easing: 'easeInOutCubic' },
        barPercentage: 0.9,
        categoryPercentage: 0.8,
    }), [spentMonth, tooltipLabelCallback]);

    const totalMes = spentMonth[spentMonthMax]

    // Por año
    const spentYear = useMemo(() => {
        return gastos.reduce((acc,gasto) => {

            const year = gasto.año;
            const monto = gasto.monto;
            const conditions = gasto.condicion.toLowerCase()

            const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas']

            if(conditionsReduce.includes(conditions)) {
                return acc;
            }

            if(!acc[year])
                acc[year] = 0
            acc[year] += monto
            return acc

        },{}) 
    }, [gastos])
        

    // Año con mayor gasto
    const spentYearMax = useMemo(() => {
        return Object.keys(spentYear).reduce((max,key) => {
        return spentYear[key] > spentYear[max] ? key: max
        }, Object.keys(spentYear)[0])
    },[spentYear])
      
      
    const dataSpentYear = useMemo(() => (
        {
        labels: Object.keys(spentYear),
        datasets: [{
            label: '',
            data: Object.values(spentYear),
            borderColor: Object.keys(spentYear).map((producto) => producto === spentYearMax ? 'rgba(82, 74, 230)' : 'rgba(82, 74, 230)'),
            borderWidth: 2,
            pointStyle: 'circle',
            pointRadius: 2,
            fill: false, 
            hoverBackgroundColor: Object.keys(spentYear).map((producto) => producto === spentYearMax ? 'rgba(82, 74, 230)' : 'rgba(82, 74, 230)'),
            }]
        }
    ),[spentYear,spentYearMax]) 
    
    
    const optionsYear = {
        responsive: true,
        maintainAspectRatio: false, 
       
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...Object.values(spentYear)) * 1.2, 
                title: {
                    display: true,
                    text: 'Monto',
                    font: {
                        size: 18, 
                        family: 'Poppins, sans-serif',
                    },
                    color: '#333', 
                },
                ticks: {
                    color: '#666', 
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Año',
                    font: {
                        size: 14,
                        family: 'Poppins, sans-serif',
                    },
                    color: '#333', 
                },
                ticks: {
                    color: '#666', 
                },
                grid: {
                    display: false, 
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#333', 
                    font: {
                        size: 18,
                    },
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 18,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 14,
                },
                borderColor: '#666',
                borderWidth: 1,
                callbacks: {
                    label: function(tooltipItem) {
                        return `Monto:  $ ${tooltipItem.raw.toLocaleString()} `;
                    }
                }
            },
        },
        animation: {
            duration: 1500, 
            easing: 'easeInOutCubic',
        },
        barPercentage: 0.9,
        categoryPercentage: 0.8,
    };


    // Gasto de productos
    const spentProduct = useMemo(() => {
        return gastos.reduce((acc,gasto) => {

            const producto = gasto.producto;
            const monto = gasto.monto;
            const conditions = gasto.condicion.toLowerCase();

            const conditionsReduce2 = ['cajero', 'inversion', 'deben', 'cuotas']

            if(conditionsReduce2.includes(conditions)) {
                return acc;
            }


            if(!acc[producto])
                acc[producto] = 0
            acc[producto] += monto
            return acc
        },{})
    },[gastos]) 

    const maxProducto = useMemo(() => {
        return Object.keys(spentProduct).reduce((max,key) => {
            return spentProduct[key] > spentProduct[max] ? key : max;
        }, Object.keys(spentProduct)[0])
    },[spentProduct]) 
    

    const top5Product = useMemo(() => {
            return Object.entries(spentProduct).sort((a,b) => {
            return b[1] -a[1]
        }).slice(0,5)
    },[spentProduct])

    const totalProducto = spentProduct[maxProducto]


    const dataSpentProduct = useMemo(() => (
        {
            labels: Object.keys(spentProduct),
            datasets: [
                {
                    label: 'Total de Ventas',
                    data: Object.values(spentProduct),
                    backgroundColor:
                        Object.keys(spentProduct).map((producto) => 
                        producto === maxProducto ? 'rgba(209, 25, 25, 0.7)': 'rgba(47, 39, 206,0.6)')
                    ,
                    borderColor: 'rgba(255, 255, 255, 1)', 
                    borderWidth: 5, 
                    hoverOffset: 10, 
                }
            ]
        }) ,[spentProduct, maxProducto])
    
    const optionsDonut = {
        responsive: true,
        cutout: '20%', // Hace la dona más delgada
        plugins: {
            legend: {
                display: true,
                position: 'left',
                labels: {
                    // color: '#050505', 
                    color: 
                    Object.keys(spentProduct).map((producto) => producto === maxProducto ? 'rgba(209, 25, 25, 0.7)': 'rgba(0,0,0)') ,
                    font: {
                        size: isMobile ? 12 : 18, // Ajuste del tamaño a 12px en móviles
                    },
                    padding: 12, // Espacio entre etiquetas
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro del tooltip
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 12,
                },
                borderColor: '#666',
                borderWidth: 1,
                callbacks: {
                    label: function(tooltipItem) {
                        return `Monto: $ ${tooltipItem.raw.toLocaleString()} `;
                    }
                }
            },
        },
        animation: {
            animateScale: true, 
            animateRotate: true,
        },
    };


    // Metodos de pagos
    const spentMetodo = useMemo(() => {
        return gastos.reduce((acc,gasto) => {

        const metodo = gasto.metodo;
        const monto = gasto.monto;
        const conditions = gasto.condicion.toLowerCase();

        const conditionsReduce2 = ['cajero', 'inversion', 'deben']
        if (conditionsReduce2.includes(conditions)){
            return acc;
        }

        if(!acc[metodo])
            acc[metodo] = 0
        acc[metodo] += monto
        return acc
        },{})
    },[gastos])
    


    const metodoMax = useMemo(() => {
            return Object.keys(spentMetodo).reduce((max,key) => {
            return spentMetodo[key] > spentMetodo[max] ? key : max;
        }, Object.keys(spentMetodo)[0])
    },[spentMetodo])

  

    const totalMetodoMax = spentMetodo[metodoMax] // se obtiene el objeto spentMetodo y metodoMax como clave 

    const dataSpentMetodo = useMemo(() => (
        {
        labels: Object.keys(spentMetodo),
        datasets: [
            {
                label: 'Total de Ventas',
                data: Object.values(spentMetodo),
                backgroundColor: Object.keys(spentMetodo).map((producto) =>  producto === metodoMax ? 'rgba(209, 25, 25, 0.7)': 'rgba(47, 39, 206,0.6)' || 'rgba(243, 124, 260, 0.6)' ) ,
                borderColor: 'rgba(255, 255, 255)', 
                borderWidth: 8, 
                hoverOffset: 8, 
            }
        ]
    }), [spentMetodo, metodoMax])
    

    const optionsDonut2 = {
        responsive: true,
        cutout: '70%', 
        plugins: {
            legend: {
                display: true,
                position: 'left',
                labels: {
                    color: '#333', 
                    font: {
                        size: isMobile ? 12 : 18,
                    },
                    padding: isMobile ? 1  : 20, 
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0)',
                titleFont: {
                    size: 12,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 16,
                },
                borderColor: '#666',
                borderWidth: 1,
                callbacks: {
                    label: function(tooltipItem) {
                        return `Monto: $ ${tooltipItem.raw.toLocaleString()} `;
                    }
                }
            },
        },
        animation: {
            animateScale: true, 
            animateRotate: true,
        },
    };


    // Metodos de necesario e innecesario
    const condicionGasto = useMemo(() => {
        return gastos.reduce((acc,gasto) => {
            const condicion = gasto.necesario;
            const monto = gasto.monto;
            const conditions = gasto.condicion.toLowerCase();

            const conditionsReduce2 = ['cajero', 'inversion', 'deben', 'cuotas' ]
            if (conditionsReduce2.includes(conditions)){
                return acc;
            }

            if(!acc[condicion])
                acc[condicion] = 0
            acc[condicion] += monto
            return acc

        },{})
    }, [gastos])

    const condicionMax = useMemo(() => {
            return Object.keys(condicionGasto).reduce((max,key) => {
            return condicionGasto[key] > condicionGasto[max] ? key : max
        }, Object.keys(condicionGasto)[0])
    },[condicionGasto])



    const dataSpentCondicion = useMemo(() => (
        {
        labels: Object.keys(condicionGasto),
        datasets: [
            {
                label: 'Total de Ventas',
                data: Object.values(condicionGasto),
                backgroundColor: Object.keys(condicionGasto).map((producto) =>  producto === condicionMax ? 'rgba(209, 25, 25, 0.7)': 'rgba(47, 39, 206,0.6)' || 'rgba(243, 124, 260, 0.6)' ) ,
                borderColor: 'rgba(255, 255, 255)', 
                borderWidth: 8, 
                hoverOffset: 8, 
            }
        ]
    }), [condicionGasto, condicionMax])
    

    const optionDonut3 = {
        responsive: true,
        cutout: '70%', 
        plugins: {
            legend: {
                display: true,
                position: 'left',
                labels: {
                    color: '#333', 
                    font: {
                        size: isMobile ? 12 : 18,
                    },
                    padding: isMobile ? 1  : 20, 
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0)',
                titleFont: {
                    size: 12,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 16,
                },
                borderColor: '#666',
                borderWidth: 1,
                callbacks: {
                    label: function(tooltipItem) {
                        return `Monto: $ ${tooltipItem.raw.toLocaleString()} `;
                    }
                }
            },
        },
        animation: {
            animateScale: true, 
            animateRotate: true,
        },
    };

    const SpentcondicionMax = condicionGasto[condicionMax]


    // Metodo de inversion
    const inversion = useMemo(() => {
       return  gastos.reduce((acc,gasto) => {
        const estado = gasto.mes;
        const monto = gasto.monto;
        const conditions = gasto.condicion.toLowerCase();

        const conditionsReduce2 = ['pagado', 'impago', 'deben', 'cuotas', 'devolver', 'cajero']
        if (conditionsReduce2.includes(conditions)){
            return acc;
        }
        
        if(!acc[estado])
            acc[estado] = 0
        acc[estado] += monto
        return acc

        },{})
    },[gastos])
    

    const maxInversion = useMemo(() => {
        return Object.keys(inversion).reduce((max,key) => {
        return inversion[key] > inversion[max] ? key : max;
        }, Object.keys(inversion)[0])
    },[inversion])
    

    const dataSpentIncersion = useMemo(() =>(
         {
        labels: Object.keys(inversion),
        datasets: [
            {
                label: 'Total de Inversion',
                data: Object.values(inversion),
                backgroundColor: Object.keys(inversion).map((producto) =>  producto === maxInversion ? 'rgba(42, 185, 64, 0.7)': 'rgba(215, 165, 39, 0.6)' || 'rgba(243, 124, 260, 0.6)' ) ,
                borderColor: 'rgba(255, 255, 255)', 
                borderWidth: 8, 
                hoverOffset: 8, 
            }
        ]
    }),[inversion,maxInversion])

    const options2 = {
        responsive: true,
        maintainAspectRatio: false, // Permite que el gráfico se adapte mejor a la pantalla
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...Object.values(spentMonth)) * 1.2, 
                title: {
                    display: true,
                    text: 'Monto',
                    font: {
                        size: 18, 
                        family: 'Poppins, sans-serif',
                    },
                    color: '#333', 
                },
                ticks: {
                    color: '#666', 
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Mes',
                    font: {
                        size: 14,
                        family: 'Poppins, sans-serif',
                    },
                    color: '#333', 
                },
                ticks: {
                    color: '#666', 
                },
                grid: {
                    display: false, 
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#333', 
                    font: {
                        size: 18,
                    },
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 18,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 14,
                },
                borderColor: '#666',
                borderWidth: 1,
                callbacks: {
                    label: function(tooltipItem) {
                        return `Monto:  $ ${tooltipItem.raw.toLocaleString()} `;
                    }
                }
            },
        },
        animation: {
            duration: 1500, 
            easing: 'easeInOutCubic',
        },
        barPercentage: 0.9,
        categoryPercentage: 0.8,
    };

    const totalInversion = useMemo(() => {
        return gastos.reduce((acc,gasto) => {
        const conditions = gasto.condicion.toLowerCase();

            const conditionsReduce2 = ['pagado', 'impago', 'deben', 'cuotas', 'devolver', 'cajero']
            if (conditionsReduce2.includes(conditions)){
                return acc;
            }

           return  acc + gasto.monto
            
        },0
    )},[gastos])


    // Promedio de gastos por año
    const promedioGasto = useMemo(() => {
        return !mesSeleccionado ? // si se seleciona un mes esta funcion pasa a tener un valor nulo
        gastos.reduce((acc,gasto) => {
            const conditions = gasto.condicion.toLowerCase();
            const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas'];

            if (conditionsReduce.includes(conditions))
                return acc;


                return acc  + gasto.monto 
        },0) / 12 : null

    })
    

    // Promedio de gastos por dia durante el mes
    const promedioDiaMes = useMemo(() => {
        return mesSeleccionado ?
        gastos.reduce((acc,gasto) => {
            const conditions = gasto.condicion.toLowerCase();
            const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas'];

            if (conditionsReduce.includes(conditions))
                return acc;

            if (gasto.mes.toLowerCase() === mesSeleccionado.toLowerCase())
            {
                return acc + gasto.monto
            }
            return acc
        },0) / 30 : null
    },[gastos])
     

    const totalGasto = useMemo(() => {
        return gastos.reduce((acc,gasto) => {
        let total = 0;
            const monto = gasto.monto

            const condiciones = gasto.condicion.toLowerCase()
            const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas']
            if (conditionsReduce.includes(condiciones)){
                return acc
            }

            total += monto

            return acc + total
            
    },0
    )},[gastos])  

    return (
        <div className="chart-container">

        {/* Resumen Financiero */}
        <motion.div className="card promedios"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 style={{padding:'1.2rem 0'}}>Resumen Financiero</h2>
            <ul className="metrics-list">
            <li><h3>Total de gastos</h3><p>$ {(totalGasto || 0).toLocaleString('en-US')}</p></li>
            <li><h3>Dinero Invertido</h3><p>$ {(totalInversion || 0).toLocaleString('en-US')}</p></li>
            {
                !mesSeleccionado ? (
                    <li><h3>Promedio de gasto por mes</h3><p>$ {(promedioGasto || 0).toLocaleString('en-US')}</p></li>
                ) : (
                    <li><h3>Promedio de gasto por mes</h3><p>$ {(promedioGasto || 0).toLocaleString('en-US')}</p></li>
                )
            }
            
            
            <li><h3>Promedio de gasto por dia</h3><p>$ {(promedioDiaMes || 0).toLocaleString('en-US')}</p></li>
            
            <li>
            <h3>Productos con más gastos</h3>
                <div className="top-products-list">
                    {top5Product.map(([producto, monto]) => (
                    <p key={producto}>
                        {producto} : ${monto.toLocaleString('en-US')}
                    </p>
                    ))}
                </div>
            </li>
            
            </ul>
        </motion.div>

        <div className="charts-grid">
        {/*  Gastos por Mes */}
                <motion.div className="card chart"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Gastos por Mes</h2>
                    <div className="chart-box">
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Bar data={dataSpentMonth} options={options} />
                    )}
                    </div>
                    <div className="info-chart">
                    <h3>Mes con mayor gasto: </h3>
                        <p className="dato1">{spentMonthMax}</p>
                        <p className="dato2">$ {(totalMes || 0).toLocaleString('en-US')}</p>
                                        
                    
                    </div>
                </motion.div>

                {/* Categorías de Gastos */}
                <motion.div className="card chart"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <h2>Distribución por Productos</h2>
                    <div className="chart-box">
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Doughnut data={dataSpentProduct} options={optionsDonut} />
                    )}
                    </div>
                    <div className="info-chart">
                        <h3>Producto con mayor gasto: </h3>
                        <p className="dato1">{maxProducto}</p>
                        <p className="dato2">$ {(totalProducto || 0).toLocaleString('en-US')}</p>
                    </div>
                </motion.div>

                

                {/*  Métodos de Pago */}
                <motion.div className="card chart"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2>Métodos de Pago</h2>
                    <div className="chart-box">
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Doughnut data={dataSpentMetodo} options={optionsDonut2} />
                    )}
                    </div>
                    <div className="info-chart">
                        <h3>Método más utilizado: </h3>
                        <p className="dato1">{metodoMax}</p>
                        <p className="dato2">$ {(totalMetodoMax || 0).toLocaleString('en-US')}</p>
                    </div>

                </motion.div>

                {/* Condicion de gasto */}

                <motion.div className="card chart"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2>Promedio de utilidad</h2>
                    <div className="chart-box">
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Doughnut data={dataSpentCondicion} options={optionDonut3} />
                    )}
                    </div>
                    <div className="info-chart">
                        <h3>Método más utilizado: </h3>
                        <p className="dato1">{condicionMax}</p>
                        <p className="dato2">$ {(SpentcondicionMax || 0).toLocaleString('en-US')}</p>
                    </div>

                </motion.div>

                {/*  Tendencias Anuales */}
                <motion.div className="card chart"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Gastos Anuales</h2>
                    <div className="chart-box">
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Bar data={dataSpentYear} options={optionsYear} />
                    )}
                    </div>
                </motion.div>

                {/*  Inversiones */}
                <motion.div className="card chart"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2>Inversiones</h2>
                    <div className="chart-box">
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Bar data={dataSpentIncersion} options={options2} />
                    )}
                    </div>
                </motion.div>
        </div>

        </div>

    );
}

export default GastoChart;




























// const condicionMetodo = gastos.reduce((acc,gasto) => {
//     const mes = gasto.mes;
//     const monto = gasto.monto;
//     const conditions = gasto.condicion.toLowerCase()

//     const conditionsReduce = ['pagado', 'impago','inversion']
//     if (conditionsReduce.includes(conditions)){
//         return acc;
//     }

//     if(!acc[mes])
//         acc[mes] = 0
//     acc[mes] += monto
//     return acc
    
// },{})

// const condicionMetodoMax = Object.keys(condicionMetodo).reduce((max,key) => {
//     return condicionMetodo[key] > condicionMetodo[max] ? key : max;
// },Object.keys(condicionMetodo)[0])


// const dataCondicionMetodo = {
//     labels: Object.keys(condicionMetodo),
//     datasets: [
//         {
//             label: 'Total de Valores',
//             data: Object.values(condicionMetodo),
//             backgroundColor: Object.keys(condicionMetodo).map((producto) =>  producto === condicionMetodoMax ? 'rgba(71, 42, 185, 0.7)': 'rgba(171, 39, 215, 0.6)' || 'rgba(243, 124, 260, 0.6)' ) ,
//             borderColor: 'rgba(255, 255, 255)', 
//             borderWidth: 8, 
//             hoverOffset: 8, 
//         }
//     ]
// }

// const options3 = {
//     responsive: true,
//     maintainAspectRatio: false, // Permite que el gráfico se adapte mejor a la pantalla
//     scales: {
//         y: {
//             beginAtZero: true,
//             suggestedMax: Math.max(...Object.values(spentMonth)) * 1.2, 
//             title: {
//                 display: true,
//                 text: 'Monto',
//                 font: {
//                     size: 18, 
//                     family: 'Poppins, sans-serif',
//                 },
//                 color: '#333', 
//             },
//             ticks: {
//                 color: '#666', 
//             },
//             grid: {
//                 color: 'rgba(200, 200, 200, 0.3)',
//             }
//         },
//         x: {
//             title: {
//                 display: true,
//                 text: 'Mes',
//                 font: {
//                     size: 14,
//                     family: 'Poppins, sans-serif',
//                 },
//                 color: '#333', 
//             },
//             ticks: {
//                 color: '#666', 
//             },
//             grid: {
//                 display: false, 
//             }
//         }
//     },
//     plugins: {
//         legend: {
//             display: true,
//             position: 'top',
//             labels: {
//                 color: '#333', 
//                 font: {
//                     size: 18,
//                 },
//             }
//         },
//         tooltip: {
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             titleFont: {
//                 size: 18,
//                 weight: 'bold',
//             },
//             bodyFont: {
//                 size: 14,
//             },
//             borderColor: '#666',
//             borderWidth: 1,
//             callbacks: {
//                 label: function(tooltipItem) {
//                     return `Monto:  $ ${tooltipItem.raw.toLocaleString()} `;
//                 }
//             }
//         },
//     },
//     animation: {
//         duration: 1500, 
//         easing: 'easeInOutCubic',
//     },
//     barPercentage: 0.9,
//     categoryPercentage: 0.8,
// };
