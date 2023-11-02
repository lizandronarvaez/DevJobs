import mongoose from "mongoose"
const Usuario = mongoose.model("Usuarios");
import enviarEmailUsuario from "../handlers/nodemailer.js"

// Vista de controlador crear usuario
const formCrearUsuario = (req, res) => {
    res.render("crear-cuenta", {
        tituloPagina: "Crea tu cuenta en DevJobs",
        tagLine: "Publica tus vacantes, crea una cuenta y empieza ya!",
    })
}

// Vista metodo post para crear el usuario
const crearCuentaUsuario = async (req, res) => {

    // Datos para crear el usuario en el modelo
    const createUser = new Usuario(req.body);
    const { email } = createUser;
    try {
        // 
        await createUser.save();
        const validarCuenta = `http://${req.headers.host}/verificar-cuenta/${email}`
        const usuario = await Usuario.findOne({ email})
        // console.log(usuario)
        await enviarEmailUsuario({
            usuario,
            subject: 'Confirma tu cuenta, por favor',
            validarCuenta,
            archivo: 'confirmar-cuenta'
        })
        req.flash("correcto", "Valida tu cuenta en el correo electronico con el que te haz registrado")
        res.redirect("/iniciar-sesion");
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/crear-cuenta");
    }

}
// // Verificar la cuenta
const confirmarCuenta = async (req, res) => {
    // Cambia el estado de la cuenta
    const usuario = await Usuario.findOne({ email: req.params.email })

    if (!usuario) {
        req.flash('error', 'Hubo un error en la validacion de la cuenta')
        res.redirect('/crear-cuenta')
    } else {
        usuario.confirmarCuenta = 1;
        usuario.save();
        req.flash('correcto', 'Tu cuenta se ha validado correctamente')
        res.redirect('/iniciar-sesion')
    }

}
// metodo para verificar que el usuario tiene la cuenta verifica
const verificarCuenta = async (req, res, next) => {
    const { email } = req.body;

    // Busca el usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        req.flash("error", "El email introducido no esta registrado");
        res.redirect("/crear-cuenta");
        return;
    }

    // si no esta verifica nos emite un error
    if (usuario.confirmarCuenta === 0) {
        req.flash("error", "Debes confirmar tu cuenta para iniciar sesion");
        res.redirect("/iniciar-sesion")
        return;
    }
    // si esta verificada para al sigueinte middlware
    next();
}
// Vista metodo para renderizar el formulario de iniciar sesion
const formIniciarSesion = (req, res) => {
    res.render("iniciar-sesion", {
        tituloPagina: "Iniciar Sesion en DevJobs"
    });
}
// 

// Permite al usuario editar su perfil
const formEditarPerfil = (req, res) => {
    const usuario = req.user;
    // Extramos los daros del usuario autenticado para colocarlos en el frontend
    const { nombre, imagen } = req.user;
    // 
    res.render("editar-perfil", {
        tituloPagina: "Edita tu perfil en DevJobs",
        usuario,
        cerrarSesion: true,
        nombre,
        imagen
    })
}

// Guardar cambios si el usuario cambia su perfil
const editarPerfil = async (req, res) => {
    // Consulta el usuario ala base de datos y lo extrae
    const { _id } = req.user
    const usuario = await Usuario.findById(_id)
    // Reescribe el usuario si lo datos son iguales o diferentes
    const { nombre, email, password } = req.body
    // Accedemos al valor de el usuario y lo reemplazamos con el valor de body
    usuario.nombre = nombre;
    usuario.email = email;
    if (password) {
        usuario.password = password;
    }
    if (req.file) {
        usuario.imagen = req.file.filename
    }
    // Se guarda el usuario con los nuevos datos
    await usuario.save();
    req.flash("correcto", "Cambios guardados correctamente")
    // Se redirige al usuario a otra pagina
    res.redirect("/administracion")
}
export default {
    formCrearUsuario,
    crearCuentaUsuario,
    formIniciarSesion,
    editarPerfil,
    formEditarPerfil,
    confirmarCuenta,
    verificarCuenta
}