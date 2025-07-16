import express from "express";
import multer from "multer";
import { getPrepagas, getPrepagaById, addPrepaga, deletePrepagaById, updatePrepagaById} from '../controllers/prepagasController.js';
import { validacionToken } from "../middlewares/autenticacion.js";

const router = express.Router();

// Configuramos multer
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (request, file, cb) => {
        const fileName = Date.now()+'_'+file.originalname 
        cb(null, fileName )
    }
});
const upload = multer({storage: storage});

// Definimos las rutas
router.get('/', getPrepagas);
router.get('/:id', validacionToken, getPrepagaById);
router.post('/', validacionToken, upload.single('logo'), addPrepaga);
router.put('/:id', validacionToken, upload.single('logo'), updatePrepagaById);
router.delete('/:id', validacionToken, deletePrepagaById);

// Ruta para subir archivos
router.post('/upload', upload.single('logo'), uploadController);

export default router;