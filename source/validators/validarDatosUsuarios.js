const validarDatosUsuarios = (req, res, next) => {
    const { password } = req.body
    // Sanitizar las entradas de los campos
    req.sanitizeBody("nombre").escape();
    req.sanitizeBody("email").escape();
    req.sanitizeBody("password").escape();
    req.sanitizeBody("confirmarPassword").escape();
    //Validar las entradas
    req.checkBody("nombre", "Nombre es un campo obligatorio").notEmpty();
    req.checkBody("email", "Email es un campo obligatorio y valido").isEmail();
    req.checkBody("password", "Password es un campo obligatorio").notEmpty();
    req.checkBody("confirmarPassword", "Repetir Password es un campo obligatorio").notEmpty();
    req.checkBody("confirmarPassword", "El password es diferente").equals(password);
    const errores = req.validationErrors();
    // Ponemos un condicional para verifica si existen o no errores
    // Sino existen errores pasas al siguiente middleware

    if (!errores) return next()
    // Recargar la vista y informar los errores
    req.flash("error", errores.map(error => error.msg));
    // Renderizar la vista para informar los errores
    res.render("crear-cuenta", {
        tituloPagina: "Crea tu cuenta en DevJobs",
        tagLine: "Publica tus vacantes gratis,crea una cuenta y empieza ya!",
        mensajes: req.flash()
    });
}

export default validarDatosUsuarios