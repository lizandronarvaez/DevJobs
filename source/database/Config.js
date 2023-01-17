import mongoose from "mongoose"
import { config } from "dotenv"
import colors from "colors"
config({ path: "variables.env" })

// Sixtaxis de consulta al servidor mongoose
mongoose.set('strictQuery', false);
// conexion ala base de datos
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
})
// comprueba la conexion ala base de datos
mongoose.connection
    .on("connected", (error) => {
        if (!error) {
            console.log(colors.green("Servidor conectado a la base de datos correctamente"))
        } else {
            console.log(colors.red("No se pudo conectar a la base de datos", error))

        }
    })

// Aqui se importaras los modelos de la base de datos
import "../models/Usuarios.js"
import "../models/Vacantes.js";