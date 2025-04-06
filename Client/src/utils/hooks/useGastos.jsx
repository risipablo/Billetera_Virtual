import { useEffect, useMemo, useState } from "react";
import Cash from "../../assets/cash.mp3";
import Ok from '../../assets/ok.mp3';
import { useNavigate } from 'react-router-dom';
import gastoService from "../service/gastoService";
import { Debounce } from '../../component/common/debounce';

export const useGastos = () => {
  const [gastos, setGastos] = useState([])
  const [gastosFiltrados, setGastosFiltrados] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState({})
  const [limite, setLimite] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [play] = useSound(Cash);
  const [play2] = useSound(Ok);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGastos = async () => {
        try {
            const data = await gastoService.getGastos(token);
            setGastos(data);
            setGastosFiltrados(data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                toast.error('Usuario no autorizado, por favor inicia sesión', { position: 'top-right' });
                navigate('/');
            }
        }
    };

    if (token) {
        fetchGastos();
    } else {
        navigate('/');
    }

    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(storedIsAdmin);
  }, [token, navigate]);

  const addGasto = async (gasto) => {
    try {
      const nuevoGasto = await gastoService.addGasto(gasto, token)
      setGastos((prev) => [...prev, nuevoGasto])
      setGastosFiltrados((prev) => [...prev, nuevoGasto])
      play()
      toast.success('Gasto agregado correctamente', { position: 'top-right' });
    } catch (err) {
      console.error(err)
    }
  };

  const deleteGasto = async (id) => {
    try {
      await gastoService.deleteGasto(id, token)
      setGastos((prev) => prev.filter((gasto) => gasto._id !== id))
      setGastosFiltrados((prev) => prev.filter((gasto) => gasto._id !== id))
      play2()
      toast.success('Gasto eliminado correctamente', { position: 'top-right' });
    } catch (err) {
      console.error(err)
    }
  };

  const editGasto = async (id, gasto) => {
    try{
      const updateGasto = await gastoService.editGasto(id, gasto, token)
      setGastos((prev) => prev.map((gasto) => (gasto._id === id ? updateGasto : gasto)))
      setGastosFiltrados((prev) => prev.map((gasto) => (gasto._id === id ? updateGasto : gasto)))
      cancelEdit()
      play2()
      toast.success('Gasto editado correctamente', { position: 'top-right' });
    } catch (err) {
      console.error(err)
    }
  }

  const editGastos = (gasto) => {
    setEditingId(gasto._id);
    setEditingData(gasto);
  };

  const cancelEdit = () => {
    setEditingId(null)
    setEditingData({})
  }


  const handleAddGastoDebounced = useMemo(() => Debounce(addGasto,100), [addGasto])
  const handleSaveEditDebounced = useMemo(() => Debounce(editGasto, 300), [editGasto]);
  
  useEffect(() => {
    const limiteGuardado = localStorage.getItem('limiteGasto');
    if (limiteGuardado) setLimite(parseInt(limiteGuardado));
  }, []);

  useEffect(() => {
    localStorage.setItem('limiteGasto', limite);
  }, [limite]);

  return {
    gastos,
    gastosFiltrados,
    setGastosFiltrados,
    addGasto,
    deleteGasto,
    editGastos,
    cancelEdit,
    editingId,
    editingData,
    setEditingData,
    handleAddGastoDebounced,
    handleSaveEditDebounced,
    limite,
    setLimite,
    isAdmin,
  };

}

