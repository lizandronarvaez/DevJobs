// Importaciones de modulos
import bcrypt from "bcrypt"
import mongoose from "mongoose";
mongoose.Promise = global.Promise;
// Creamos el esquema de modulo de usuarios
const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: "Agrega un nombre",

    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expiracion: Date,
    imagen: String
})
// Metodo para hashear la password

// .pre---antes que se guarde me haces esto
usuariosSchema.pre("save", async function (next) {
    // Verifica si la password esta hasheada
    if (!this.isModified("password")) {
        return next()
    }
    // Sino esta hasheada se va a realizar el hasheo
    const hassPassword = await bcrypt.hash(this.password, 12)
    this.password = hassPassword;
    next();
})
// Verifica un error al registrar un usuario
usuariosSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
        next("No puedes registrarte con este correo, ya esta en uso")
    } else {
        next(error)
    }
})
// Metodo para autenticar usuario
usuariosSchema.methods = {
    // Funcion que permite comparar la contraseñas en la base datos con la introducida
    compararPassword: function (password) {
        // Retornara true o false
        return bcrypt.compareSync(password, this.password)
    }
}
export default mongoose.model("Usuarios", usuariosSchema);