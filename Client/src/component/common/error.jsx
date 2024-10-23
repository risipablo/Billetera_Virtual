import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que la siguiente renderización muestre la interfaz alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio externo si lo necesitas
    console.error("Error en el componente:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz alterna cuando ocurra un error
      return <h1>Algo salió mal. Por favor intenta de nuevo más tarde.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
