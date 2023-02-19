// Escribiremos las rutas para los verbos
// Importamos el modelo para mostar las vacantes
import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante")
const mostrarTrabajos = async (req, res, next) => {
    // Buscando la vacante con la query FIND
    const vacantes = await Vacante.find().lean()

    if (!vacantes) return next()

    res.render("home", {
        tituloPagina: "Plataforma de Empleo Devs",
        tagLine: "Plataforma para subir y encontrar trabajos para Desarrollares Web",
        barra: true,
        boton: true,
        vacantes
    })
}
export default mostrarTrabajos