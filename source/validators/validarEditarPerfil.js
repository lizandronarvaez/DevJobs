const validaEditarPerfil = (req, res, next) => {
    // sanitizar los datos
    req.sanitizeBody("nombre").escape();
    req.sanitizeBody("email").escape();
    if (req.body.password) {
        req.sanitizeBody("password").escape()
    }

    // validar los datos

    req.checkBody("nombre", "El nombre no puede ir vacio");
    req.checkBody("email", "El email no puede ir vacio");
    // 
    const errores = req.validationErrors();
    // Sino existen errores al editar el perfil
    if (!errores) return next()
    req.flash("error", errores.map(error => error.msg));
    
    // En caso contratio
    res.render("editar-perfil", {
        tituloPagina: "Edita tu perfil en DevJobs",
        usuario,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes: req.flash()
    })
}

export default validaEditarPerfil