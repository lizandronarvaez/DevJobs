import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
// Importamos el modelo de usuarios que utilizaremos para la autenticacion
const Usuarios = mongoose.model("Usuarios");

// Usamos password con la strategia que queremos implementar
passport.use(
    new LocalStrategy({
        // Utilizara estos dos nombres como autenticacion para validar
        usernameField: "email",
        passwordField: "password"
        // Se realizara la autencticacion de forma asyncrona
    },
        async (email, password, done) => {
            // -----------------------------------------------------------------------------------------------------
            // Luego buscara un usuario con el correo introducido en la base de datos y devolver un booleano
            const usuario = await Usuarios.findOne({ email })
            // Si no encuentra el usuario devolvera un mensaje
            if (!usuario) return done(null, false, {
                message: "El usuario no existe"
            })
            // --------------------------------------------------------------------------------------------------
            // Verificar la password si el usuario existe
            const verificarPassword = usuario.compararPassword(password)
            // Si la contraseña no es correcta
            if (!verificarPassword) return done(null, false, {
                message: "El password es incorrecto"
            })

            // El usuario es correcto y la contraseña es correcta
            return done(null, usuario)
        }))

passport.serializeUser((usuario, done) => done(null, usuario._id))
// 
passport.deserializeUser(async (id, done) => {
    const usuario = await Usuarios.findById(id)
    return done(null, usuario)
})

export default passport