
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
    <div className="loader">
    <InfinitySpin
      visible={true}
      display="flex"
      height="200"
      width="200"
      color="rgb(157, 10, 236)"
      ariaLabel="infinity-spin-loading"
    />
    <h2>Espere un momento, por favor</h2>
  </div>
  );
}

export default Loader;
