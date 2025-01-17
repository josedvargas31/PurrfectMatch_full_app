import { Router } from 'express';
import {
  listarMascotas,
  registrarMascota,
  actualizarMascota,
  eliminarMascota,
  buscarMascota,
  iniciarAdopcion,
  administrarAdopcion,
  listarMascotasConUsuarios,
  obtenerConteoPorEstado,
  listarMascotasEnProceso,
} from '../controllers/mascotas.controller.js';
import {
  validateRegistroMascota,
  validateActualizarMascota,
} from '../validation/mascota.validation.js';
import upload from '../config/multer.config.js';  // Importar configuración de multer
import { uploadImage, deleteImage } from '../controllers/imagenes.controller.js';

const mascotaRoutes = Router();

mascotaRoutes.get('/listar', listarMascotas);
mascotaRoutes.get('/listarMU', listarMascotasConUsuarios);
mascotaRoutes.get('/procesoAdopcion/:identificacion', listarMascotasEnProceso);
mascotaRoutes.get('/conteo/estado', obtenerConteoPorEstado);
mascotaRoutes.post('/registrar', upload.single('img'), uploadImage, validateRegistroMascota, registrarMascota);
mascotaRoutes.put('/actualizar/:id_mascota', upload.single('img'), uploadImage, validateActualizarMascota, actualizarMascota);
mascotaRoutes.delete('/eliminar/:id_mascota', eliminarMascota); 
mascotaRoutes.get('/buscar/:id_mascota', buscarMascota);
mascotaRoutes.post('/iniciar/:id_mascota', iniciarAdopcion);
mascotaRoutes.post('/administrar/:id_mascota', administrarAdopcion);


export default mascotaRoutes;
