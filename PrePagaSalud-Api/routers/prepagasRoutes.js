import express from "express";
import { getPrepagas, getPrepagaById, addPrepaga, deletePrepagaById, updatePrepagaById} from '../controllers/prepagasController.js';
import { validacionToken } from "../middlewares/autenticacion.js";
import upload from '../middlewares/upload.js';
import { uploadController } from "../controllers/uploadController.js";

const router = express.Router();

// Definimos las rutas
router.get('/', getPrepagas);
router.get('/:id', validacionToken, getPrepagaById);
router.post('/', validacionToken, addPrepaga);
router.put('/:id', validacionToken, updatePrepagaById);
// router.post('/', validacionToken, upload.single('logo'), addPrepaga);
// router.put('/:id', validacionToken, upload.single('logo'), updatePrepagaById);
router.delete('/:id', validacionToken, deletePrepagaById);

// Ruta para subir archivos
router.post('/uploads', upload.single('logo'), uploadController);

export default router;