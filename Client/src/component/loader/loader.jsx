
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./loader.css";
import { InfinitySpin } from 'react-loader-spinner'; 

const Loader = ({ setLoading }) => {
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
      navigate('/gasto'); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigate, setLoading]);

  return (
    <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <InfinitySpin
      visible={true}
      display="block"
      width="200"
      color="#4fa94d"
      ariaLabel="infinity-spin-loading"
    />
    <h2 style={{ color: '#ffff' }}>Espere un momento, por favor</h2>
  </div>
  );
}

export default Loader;
