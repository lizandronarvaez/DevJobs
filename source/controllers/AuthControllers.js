import passport from "passport";
import mongoose, { now } from "mongoose";
const Vacante = mongoose.model("Vacante");
const Usuario = mongoose.model("Usuarios");
import crypto from "crypto";
import enviarEmail from "../handlers/nodemailer.js"
// const Usuarios = mongoose.model("Usuarios")
/*Este controlador permite autenticar las contraseña y redireccionarte a la pagina solicitada 
  sino fuese correcta la autenticacion la autenticacion fallara y redirecccionara ala misma pagina
*/
const autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios"
})
// Funcion que comprueba que el usuario esta autenticado
const usuarioAutenticado = (req, res, next) => {
  // Si el usuario esta autenticado va a pasar al sigueinte middleware
  if (req.isAuthenticated()) {
    return next()
  }
  // Sino esta autenticado con sus credenciales se le rederigira a otra ruta
  res.redirect("/iniciar-sesion")
}
// Muestra el panel de control cuando el usuario se autentica
const mostrarPanelAdministracion = async (req, res) => {
  // Consultar el usuario autenticado
  const vacantes = await Vacante.find({ autor: req.user._id }).lean()
  // 
  res.render("administracion", {
    tituloPagina: "Administracion",
    tagLine: "Crear y administra tus vacantes desde aqui",
    vacantes,
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen
  })
}

// Cerrar sesion de usuario
const cerrarSesion = (req, res, next) => {
  // Cerramos la sesion con este metodo
  req.logout((error) => {
    if (error) return next(error)

    // Informamos al cliente que ha cerrado sesion
    req.flash("correcto", "Sesion Cerrada Correctamente")
    // Cuando la sesion este cerrada se rederigira al vista de iniciar sesion
    return res.redirect("/iniciar-sesion")
  });

}

// Reestablecer password
// @get
const reestablecerPasswordForm = (req, res, next) => {
  res.render("reestablecer-password", {
    tituloPagina: "Reestablece tu password",
    tagLine: "Si ya tienes cuenta, y olvidastes tu contraseña, reestablecela",

  })
}
// @post
const reestablecerPassword = async (req, res, next) => {

  const usuario = await Usuario.findOne({ email: req.body.email })
  // Si el usuario no existe
  if (!usuario) {
    req.flash("error", "El email no existe");
    return res.redirect("/reestablecer-password")
  }
  // en caso contrario genera el token
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 7200000
  // lo guarda en la base de datos
  await usuario.save();
  const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

  // Enviar email a usuario de reestablecer
  await enviarEmail({
    usuario,
    subject: "Reestablecimiento de contraseña",
    resetUrl,
    archivo: "reset-password"
  })

  // Enviarmos un mensaje que esta todo correcto
  req.flash("correcto", "Revisa tu email, para reestablecer la contraseña")
  res.redirect("/iniciar-sesion")
}

// comprobar si el token es valido
const verificarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({
    token,
    expiracion: {
      $gt: Date.now()
    }
  });
  // Si el tiempo de expiracion supero el tiempo
  if (!usuario) {
    req.flash("error", "El tiempo para reestablecer la contraseña, expiró")
  }
  // Sino el tiempo no supero
  res.render("nueva-contraseña", {
    tituloPagina: "Reestablece tu nueva password",
    tagLine: "Escribe tu nueva contraseña,para cambiarla",
  })
}

// @post
const cambiarPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmarPassword } = req.body;
  const usuario = await Usuario.findOne({
    token,
    expiracion: {
      $gt: Date.now()
    }
  });

  //Si el usuario no existe o el token no es valido
  if (!usuario) {
    req.flash("error", "El tiempo para reestablecer la contraseña, expiró")
  }
  // Guardar la nueva password en la base de datos
  usuario.password = password;
  // Hay que reestablecer el token y la expiracion una vez cambiada la contraseña
  usuario.token = undefined;
  usuario.expiracion = undefined;

  // Guardarmos en la base de datos la nueva contraseña
  await usuario.save();
  // Redireccionamos con un mensaje que la contrasña fue cambiada correctamente
  req.flash("correcto", "La contraseña ha sido actualiada correctamente");
  res.redirect("/iniciar-sesion")
}
export default {
  autenticarUsuario,
  mostrarPanelAdministracion,
  usuarioAutenticado,
  cerrarSesion,
  reestablecerPasswordForm,
  reestablecerPassword,
  verificarToken,
  cambiarPassword
}