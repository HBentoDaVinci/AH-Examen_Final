import express from "express";
import { getUsuarios, getUsuarioByEmail, getUsuarioById, addUsuario, deleteUsuarioById, updateUsuarioById, auth } from "../controllers/usuariosController.js";
import { validacionToken } from "../middlewares/autenticacion.js";
import upload from '../middlewares/upload.js';
import { uploadController } from "../controllers/uploadController.js";

const router = express.Router();

// Definimos las rutas
router.get('/', validacionToken, getUsuarios);
router.get('/:id', validacionToken, getUsuarioById);
router.post('/', upload.single('avatar'), addUsuario);
router.post('/auth', auth);
router.put('/:id', validacionToken, upload.single('avatar'), updateUsuarioById);
router.delete('/:id', validacionToken, deleteUsuarioById);
//router.put('/:id', upload.single('file'), updateUserById);

// Ruta para subir archivos
router.post('/uploads', upload.single('avatar'), uploadController);

export default router;