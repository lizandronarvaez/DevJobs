import mongoose from "mongoose"
const Usuario = mongoose.model("Usuarios");
import multer from "multer";
import shortid from "shortid";
// 
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import enviarEmail from "../handlers/nodemailer.js";
const __dirname = dirname(fileURLToPath(import.meta.url))

// Funcion para subir imagen
const subirImagen = (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    req.flash("error", "El archivo es muy grande")
                } else {
                    req.flash("error", error.message)
                }
            } else {
                req.flash("error", error.message);
            }
            res.redirect("/administracion");
            return;
        } else {
            return next();
        }

    });
}
// Configuracion de multer
const uploads = path.join(__dirname, "../public/uploads/perfiles")
// En la configuracion de multer hay que ponerlo en orden ya que se ejecuta de arriba abajo
const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploads)
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split("/")[1]
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    // Filtar archivos para que solo se suben determinados archivos que cumplan con la extension 
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            // si el formato es correcto ejectura true
            cb(null, true);
        } else {
            // Si es falso ejectura false
            cb(new Error("Formato de archivo no valido."), false);
        }
    }
}
const upload = multer(configuracionMulter).single("imagen");

// Vista de controlador crear usuario
const formCrearUsuario = (req, res) => {
    res.render("crear-cuenta", {
        tituloPagina: "Crea tu cuenta en DevJobs",
        tagLine: "Publica tus vacantes, crea una cuenta y empieza ya!",
    })
}
// Vista metodo post para crear el usuario
const crearCuentaUsuario = async (req, res, next) => {
    // Datos para crear el usuario en el modelo
    const usuario = new Usuario(req.body);
    // En caso contrario me guardaras el usuario en la base de datos
    try {
        const validarCuenta = `http://${req.headers.host}/validar-cuenta/${req.body.email}`
        const user = {
            email
        }
        await enviarEmail({
            usuario: user.email,
            subject: 'Confirma tu cuenta, por favor',
            validarCuenta,
            archivo: 'confirmar-cuenta'
        })

        await usuario.save();
        req.flash("correcto", "Usuario creado correctamente")
        res.redirect("/iniciar-sesion");
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/crear-cuenta");
    }
}
// Verificar la cuenta
const verificarCuenta = async (req, res) => {
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
    subirImagen,
    formCrearUsuario,
    crearCuentaUsuario,
    formIniciarSesion,
    editarPerfil,
    formEditarPerfil,
    verificarCuenta
}