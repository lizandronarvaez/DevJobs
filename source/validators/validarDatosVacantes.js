const validarDatosVacantes = (req, res, next) => {

    // Sanitizar las entradas de datos
    req.sanitizeBody("titulo").escape();
    req.sanitizeBody("empresa").escape();
    req.sanitizeBody("ubicacion").escape();
    req.sanitizeBody("salario").escape();
    req.sanitizeBody("contrato").escape();
    req.sanitizeBody("skills").escape();

    // Validar las entradas de datos

    req.checkBody("titulo", "Agrega un nombre a la vacante").notEmpty();
    req.checkBody("empresa", "Agrega una empresa").notEmpty();
    req.checkBody("ubicacion", "Agrega una ubicacion").notEmpty();
    req.checkBody("contrato", "Seleccion un tipo de contrato").notEmpty();
    req.checkBody("skills", "Seleccion al menos una habilidad").notEmpty();

    // Cremos una variable donde guardaremos los errores en caso que existan
    const errores = req.validationErrors();
    // Sino existen errores realizara un next al siguiente middleware
    if (!errores) return next();
    // Si existen errores 
    req.flash("error", errores.map(error => error.msg));
    // 
    res.render("nueva-vacante", {
        tituloPagina: "Nueva vacante",
        tagLine: "Publica tus vacantes rellenando el formulario",
        mensajes: req.flash()
    })
}

export default validarDatosVacantes