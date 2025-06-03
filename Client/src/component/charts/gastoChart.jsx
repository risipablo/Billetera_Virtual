
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import { motion } from 'framer-motion';
import { Skeleton } from "@mui/material";
import "./chart.css"


const GastoChart = ({ gastos, loading}) => {
     const isLoading = loading || !gastos || gastos.length === 0;
    

    const isMobile = window.innerWidth <= 768; // ajusta de font size donuts para mobile

    // Gastos por mes
    const spentMonth = gastos.reduce((acc, gasto) => {
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

    const spentMonthMax = Object.keys(spentMonth).reduce((max,key) => {
        return spentMonth[key] > spentMonth[max] ? key : max;
    }, Object.keys(spentMonth)[0])

    const dataSpentMonth = {
        labels: Object.keys(spentMonth),
        datasets: [
            {
                label: 'Total de Gastos',
                data: Object.values(spentMonth), 
                backgroundColor: Object.keys(spentMonth).map((producto) => producto === spentMonthMax ? 'rgba(209, 25, 25, 0.7)' : 'rgba(164, 11, 235,0.7)'),
                borderWidth: 0.5, 
                borderRadius: 5,  
                hoverBackgroundColor: Object.keys(spentMonth).map((producto) => producto === spentMonthMax ? 'rgba(200, 25, 25)' : 'rgba(160, 11, 235)'),
                barPercentage: 1, 
            }
        ]
    };

    const options = {
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

    const totalMes = spentMonth[spentMonthMax]

      // Por año
      const spentYear = gastos.reduce((acc,gasto) => {

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

      // Año con mayor gasto
      const spentYearMax = Object.keys(spentMonth).reduce((max,key) => {
        return spentYear[key] > spentYear[max] ? key: max
      }, Object.keys(spentYear)[0])
      

      
      const dataSpentYear = {
        labels: Object.keys(spentYear),
        datasets: [
          {
            label: '',
            data: Object.values(spentYear),
            borderColor: Object.keys(spentYear).map((producto) => producto === spentYearMax ? 'rgba(82, 74, 230)' : 'rgba(82, 74, 230)'),
            borderWidth: 2,
            pointStyle: 'circle',
            pointRadius: 2,
            fill: false, 
            hoverBackgroundColor: Object.keys(spentYear).map((producto) => producto === spentYearMax ? 'rgba(82, 74, 230)' : 'rgba(82, 74, 230)'),
          }
        ]
      };
      
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
    const spentProduct = gastos.reduce((acc,gasto) => {

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

    const maxProducto = Object.keys(spentProduct).reduce((max,key) => {
        return spentProduct[key] > spentProduct[max] ? key : max;
    }, Object.keys(spentProduct)[0])

    const totalProducto = spentProduct[maxProducto]


    const dataSpentProduct = {
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
    };

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
    const spentMetodo = gastos.reduce((acc,gasto) => {

        const metodo = gasto.metodo;
        const monto = gasto.monto;
        const conditions = gasto.condicion.toLowerCase();

        const conditionsReduce2 = ['cajero', 'inversion', 'deben', 'cuotas']
        if (conditionsReduce2.includes(conditions)){
            return acc;
        }

        if(!acc[metodo])
            acc[metodo] = 0
        acc[metodo] += monto
        return acc
    },{})


    const metodoMax = Object.keys(spentMetodo).reduce((max,key) => {
        return spentMetodo[key] > spentMetodo[max] ? key : max;
    }, Object.keys(spentMetodo)[0])


    const totalMetodoMax = spentMetodo[metodoMax]// se obtiene el objeto spentMetode y metodoMax como clave 

    const dataSpentMetodo = {
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
    }

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


    // Metodo de inversion

    const inversion = gastos.reduce((acc,gasto) => {
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

    const maxInversion = Object.keys(inversion).reduce((max,key) => {
        return inversion[key] > inversion[max] ? key : max;
    }, Object.keys(inversion)[0])


    const dataSpentIncersion = {
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
    }

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



    const totalInversion = gastos.reduce((acc,gasto) => {
        const conditions = gasto.condicion.toLowerCase();

            const conditionsReduce2 = ['pagado', 'impago', 'deben', 'cuotas', 'devolver', 'cajero']
            if (conditionsReduce2.includes(conditions)){
                return acc;
            }

           return  acc + gasto.monto
            
        },0
    )

        const promedioGasto = gastos.reduce((acc, gasto) => {
            const condiciones = gasto.condicion.toLowerCase();
            const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas'];
            
            if (conditionsReduce.includes(condiciones)) {
                return acc;
            }
            
            return acc + gasto.monto;
        }, 0) / 12;


   const promedioPorDia = gastos.reduce((acc,gasto) => {
        const monto = gasto.monto;
        const condiciones = gasto.condicion.toLowerCase()

        const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas']
        if (conditionsReduce.includes(condiciones)){
            return acc
        }

        const total = monto / 365

        return acc + total
   }, 0)

   const totalGasto = gastos.reduce((acc,gasto) => {
    let total = 0;
        const monto = gasto.monto

        const condiciones = gasto.condicion.toLowerCase()
        const conditionsReduce = ['cajero', 'inversion', 'deben', 'cuotas']
        if (conditionsReduce.includes(condiciones)){
            return acc
        }

        total += monto

        return acc + total
        
   },0)

    return (
        <div className="chart-container">
            {/* Gastos por mes */}
            <motion.div 
                className="month-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2>Gastos por mes</h2>
                <div className="bar-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Bar data={dataSpentMonth} options={options} />
                    )}
                </div>
            </motion.div>

            {/* Productos por mes */}
            <motion.div 
                className="product-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <h2>Productos por mes</h2>
                <div className="doughnut-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Doughnut data={dataSpentProduct} options={optionsDonut} />
                    )}
                </div>
            </motion.div>

            {/* Metodos de pago */}
            <motion.div 
                className="product-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <h2>Metodos de pago</h2>
                <div className="doughnut-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Doughnut data={dataSpentMetodo} options={optionsDonut2} />
                    )}
                </div>
            </motion.div>

            {/* Gastos por año */}
            <motion.div 
                className="month-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2>Gastos por año</h2>
                <div className="bar-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Bar data={dataSpentYear} options={optionsYear} />
                    )}
                </div>
            </motion.div>

            {/* Inversion */}
            <motion.div 
                className="product-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <h2>Inversion</h2>
                <div className="doughnut-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    {isLoading ? (
                        <Skeleton variant="circular" width={180} height={180} />
                    ) : (
                        <Bar data={dataSpentIncersion} options={options2} />
                    )}
                </div>
            </motion.div>

            {/* Promedios y totales */}
            <motion.div 
                className="promedios-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >

                <div>
                    <h3>Total de gastos</h3>
                    <div className="content-row">
                      
                        <p>$ {(totalGasto || 0).toLocaleString('en-US')}</p>
                    </div>
                </div>


                <div>
                    <h3>Promedio de gasto por dia </h3>
                    <div className="content-row">
                      
                        <p>$ {(promedioPorDia || 0).toLocaleString('en-US')}</p>
                    </div>
                </div>
               

                <div>
                    <h3>Promedio de gasto por mes</h3>
                    <div className="content-row">
                      
                        <p>$ {(promedioGasto || 0).toLocaleString('en-US')}</p>
                    </div>
                </div>
               
                <div>
                    <h3>Producto mayor gastado</h3>
                    <div className="content-row">
                        <p>{maxProducto}</p>
                        <p>$ {(totalProducto || 0).toLocaleString('en-US')}</p>
                    </div>
                </div>
                
                <div>
                    <h3>Método de pago más usado</h3>
                    <div className="content-row">
                        <p>{metodoMax}</p>
                        <p>$ {(totalMetodoMax || 0).toLocaleString('en-US')}</p>
                    </div>
                </div>
               
                <div>
                    <h3>Mes más gastado</h3>
                    <div className="content-row">
                        <p>{spentMonthMax}</p>
                        <p>$ {(totalMes || 0).toLocaleString('en-US')}</p>
                    </div>
                </div>

                
                <div>
                    <h3>Dinero Invertido</h3>
                    <div className="content-row">
                        <p>$ {(totalInversion || 0).toLocaleString('en-US')}</p>
                        
                    </div>
                </div>
                
            </motion.div>
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
