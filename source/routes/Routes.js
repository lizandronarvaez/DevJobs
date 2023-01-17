import express from "express"
const route = express.Router();
// Importaremos los controladores de rutas
import mostrarTrabajos from "../controllers/IndexControllers.js"
import usuariosControllers from "../controllers/UsuariosControllers.js";
import VacantesControllers from "../controllers/VacantesControllers.js";
// Validadores y sanitizadores de datos
import validarDatosUsuarios from "../validators/validarDatosUsuarios.js";
import validarDatosVacantes from "../validators/validarDatosVacantes.js";
import validarEditarPerfil from "../validators/validarEditarPerfil.js";
// Autenticacion
import authController from "../controllers/AuthControllers.js";

// Controladores de ruta
route
    // Ruta Principal
    .get("/", mostrarTrabajos)
    // Crear Vacantes
    .get("/vacantes/nueva", authController.usuarioAutenticado, VacantesControllers.formNuevaVacante)
    .post("/vacantes/nueva", authController.usuarioAutenticado, validarDatosVacantes, VacantesControllers.agregarVacante)

    // Mostrar una vacante(muestra una sola)
    .get("/vacantes/:url", VacantesControllers.findVacanteUrl)

    // Editar o actualizar una vacante
    .get("/vacantes/editar/:url", authController.usuarioAutenticado, VacantesControllers.formEditarVacante)
    .post("/vacantes/editar/:url", authController.usuarioAutenticado, validarDatosVacantes, VacantesControllers.actualizarVacante)

    // Eliminar una vacante
    .delete("/vacantes/eliminar/:id", VacantesControllers.eliminarVacante)

    // Crear cuenta usuario
    .get("/crear-cuenta", usuariosControllers.formCrearUsuario)
    .post("/crear-cuenta", validarDatosUsuarios, usuariosControllers.crearCuentaUsuario)

    // Iniciar sesion usuario
    .get("/iniciar-sesion", usuariosControllers.formIniciarSesion)
    .post("/iniciar-sesion", authController.autenticarUsuario)

    // Cerrar Sesion usuario
    .get("/cerrar-sesion", authController.usuarioAutenticado, authController.cerrarSesion)

    // Reestablecer password
    .get("/reestablecer-password", authController.reestablecerPasswordForm)
    .post("/reestablecer-password", authController.reestablecerPassword)

    // Reestablecer password token
    .get("/reestablecer-password/:token", authController.verificarToken)
    .post("/reestablecer-password/:token", authController.cambiarPassword)

    // Administracion
    .get("/administracion", authController.usuarioAutenticado, authController.mostrarPanelAdministracion)

    // Editar perfil
    .get("/editar-perfil", authController.usuarioAutenticado, usuariosControllers.formEditarPerfil)
    .post("/editar-perfil", authController.usuarioAutenticado, validarEditarPerfil, usuariosControllers.subirImagen, usuariosControllers.editarPerfil)

    // Mensajes de los candidatos
    .post("/vacantes/:url", VacantesControllers.subirCurriculum, VacantesControllers.contactar)

    // Muestra los candidatos
    .get("/candidatos/:id", authController.usuarioAutenticado, VacantesControllers.mostrarCandidatos)

    // Busca las vacantes
    .post("/buscador", VacantesControllers.buscarVacantesInput)

export default route