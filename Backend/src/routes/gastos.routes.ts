import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { addGastos, deleteAllGastos, deleteGasto, deleteGastosByIds, editGasto, getGastos } from "../controllers/gastos.Controller";


const router = Router();

router.get('/bills',protect, getGastos);
router.post('/bills', protect,addGastos);
router.delete('/bills/bulk', protect, deleteGastosByIds);
router.delete('/bills', protect, deleteAllGastos);

router.delete('/bills/:id', protect, deleteGasto);
router.patch('/bills/:id', protect ,editGasto);

export default router;