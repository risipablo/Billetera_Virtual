
import "./loader.css";
import { useEffect } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

const Loader = ({ setLoading, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLoading, onComplete]);

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
};

export default Loader;