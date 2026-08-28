

export const formatDate = (dateString: string | Date): string => {
    if (!dateString) return '';


      if (dateString instanceof Date) {
        const day = String(dateString.getDate()).padStart(2, '0');
        const month = String(dateString.getMonth() + 1).padStart(2, '0');
        const year = dateString.getFullYear();
        return `${day}/${month}/${year}`;
    }

       if (typeof dateString === 'string' && dateString.includes('T')) {
        const parts = dateString.split('T')[0].split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
    }
    
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('T')[0].split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
    }
    

    
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    } catch (e) {
        console.error('Error formateando fecha:', dateString);
    }

    return String(dateString);
};


export const buscarPorFecha = (fechaStr: string | Date, palabra: string): boolean => {
    if (!fechaStr || !palabra) return false;

    let fechaNormalizada = fechaStr;
    if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
        fechaNormalizada = fechaStr.split('T')[0];
    }

    const date = fechaNormalizada instanceof Date ? fechaNormalizada : new Date(fechaNormalizada);
    if (isNaN(date.getTime())) return false;

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const meses: Record<string, string> = {
        '01': 'enero',
        '02': 'febrero',
        '03': 'marzo',
        '04': 'abril',
        '05': 'mayo',
        '06': 'junio',
        '07': 'julio',
        '08': 'agosto',
        '09': 'septiembre',
        '10': 'octubre',
        '11': 'noviembre',
        '12': 'diciembre'
    };

    const nombreMes = meses[month] || '';
    const fechaFormateada = `${day}/${month}/${year}`;
    const termino = palabra.trim().toLowerCase();

    return (
        nombreMes.includes(termino) ||
        year.includes(termino) ||
        `${nombreMes} ${year}`.includes(termino) ||
        `${month}/${year}`.includes(termino) ||
        fechaFormateada.includes(termino)
    );
};