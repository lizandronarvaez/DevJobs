import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante");
import multer from "multer";
import shortid from "shortid";
// 
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Renderizado del formulario de la vista de vacantes
const formNuevaVacante = (req, res) => {
    res.render("nueva-vacante", {
        tituloPagina: "Nueva Vacante",
        tagLine: "Llena el formulario y publica tu vacante",
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

// Agrega una nueva vacante ala base de datos
const agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body)
    // autor de la vacante
    vacante.autor = req.user._id
    // Modificar el valor de las skill convirtiendolo en un string
    vacante.skills = req.body.skills.split(",")
    try {
        // Agregar una nueva vacante ala base de datos
        await vacante.save()
        // Una vez la vacante se genere se va a rediccionar a la pagina principal
        // res.redirect(`/vacantes/${nuevaVacante.url}`)
        res.redirect("/")

    } catch (error) {
        res.flash("error", "Hubo un error al crear la vacante")
        res.redirect("/")
    }
}

// Busca una vacante por su url en la BDMongo y la devuelve hacia el cliente
const findVacanteUrl = async (req, res, next) => {
    const { url } = req.params
    const vacante = await Vacante.findOne({ url }).populate("autor")
    if (!vacante) next();
    // Creamos la vista para la vacante
    res.render("vacante", {
        tituloPagina: vacante.titulo,
        barra: true,
        vacante
    })
}

// Permite editar la vacante para poder cambiar los datos una vez creada
const formEditarVacante = async (req, res, next) => {
    const { url } = req.params
    // Consultarmos la vacante en la base de datos
    const vacante = await Vacante.findOne({ url })
    // Sino existe esa vacante se aplica el next
    if (!vacante) next();

    res.render("editar-vacante", {
        vacante,
        tituloPagina: `Editar Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

const actualizarVacante = async (req, res, next) => {
    const { body } = req;
    const { url } = req.params;
    body.skills = body.skills.split(",");
    // Actualizar los datos de la vacante en la BDMongo en elos corchetes indicas la vacante que quieres actualizar, y con que lo quieres actualizar que es el body
    const actualizarVacante = await Vacante
        .findOneAndUpdate({ url }, body, { new: true, runValidators: true })
    if (!actualizarVacante) next();
    res.redirect(`/vacantes/${actualizarVacante.url}`)
}

// Eliminar una vacante
const eliminarVacante = async (req, res) => {
    const { id } = req.params
    // Eliminar vacante
    const vacante = await Vacante.findById(id);
    if (verificarAutor(vacante, req.user)) {
        // Si el usuario es quien es, se eliminara
        vacante.remove()
        res.status(200).send("Vacante eliminada correctamente");
    } else {
        // Sino es el usuario indicado,no sera permitido
        res.status(403).send("Error");

    }
}
const verificarAutor = (vacante = {}, usuario = {}) => {
    // Si el autor es igual al usuario autenticado realizara la verifiacion
    if (vacante.autor.equals(usuario._id)) {
        return true;
    }

    return false;
}

// CANDIDATOS
const subirCurriculum = (req, res, next) => {
    upload(req, res, error => {
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
            res.redirect("back");
            return;
        } else {
            return next();
        }
    });
}
// / Configuracion de multer
// En la configuracion de multer hay que ponerlo en orden ya que se ejecuta de arriba abajo
const uploads = path.join(__dirname, "../public/uploads/cv")
const configuracionMulter = {
    limits: { fileSize: 500000 },
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
        if (file.mimetype === "application/pdf") {
            // si el formato es correcto ejectura true
            cb(null, true);
        } else {
            // Si es falso ejectura false
            cb(new Error("Formato de archivo no valido."), false);
        }
    }
}
const upload = multer(configuracionMulter).single("cv");
// Contactar al reclutador
const contactar = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url });
    // sino existe la vacante a aplicar
    if (!vacante) return next();
    // candidato con sus datos
    const candidatoPuesto = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }
    // almacenar el candidato en la vacante
    vacante.candidatos.push(candidatoPuesto);
    // guardamos el candidato
    await vacante.save();

    // mensaje  y redireccion
    req.flash("correcto", "Se envio tu Cv correctamente");
    res.redirect("/");
}

// mostrar candidatos
const mostrarCandidatos = async (req, res, next) => {
    const { id } = req.params
    const { nombre, imagen } = req.user
    // Desestructuracion de la base datos
    const vacante = await Vacante.findById(id)
    const { candidatos } = vacante
    // condicional
    if (vacante.autor != req.user._id.toString()) {
        return next()
    }
    if (!vacante) return next()
    // redenrizacion
    res.render("candidatos", {
        tituloPagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre,
        imagen,
        candidatos
    })
}

// Buscar vacantes por medio del input
const buscarVacantesInput = async (req, res) => {
    const { query } = req.body
    const vacantes = await Vacante.find({
        $text: {
            $search: query
        }
    })

    // Buscar la vacante

    res.render("home", {
        tituloPagina: `Resultados para la busqueda: ${query}`,
        barra: true,
        vacantes
    })
}
export default {
    formNuevaVacante,
    agregarVacante,
    findVacanteUrl,
    formEditarVacante,
    actualizarVacante,
    eliminarVacante,
    subirCurriculum,
    contactar,
    mostrarCandidatos,
    buscarVacantesInput
}