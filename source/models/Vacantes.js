import mongoose from "mongoose";
mongoose.Promise = global.Promise
import slug from "slug";
import shortid from "shortid";

const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true,
    },
    skills: [String],
    candidatos: [{
        nombre: {
            type: String,
            uppercase: true,
        },
        email: String,
        cv: String,
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuarios",
    }
})
// 
vacantesSchema.pre("save", function (next) {
    const URL = slug(this.titulo);
    this.url = `${URL}-${shortid.generate()}`;
    next();

})

// Crear un indice para la busqueda
vacantesSchema.index({ titulo: "text" });
export default mongoose.model("Vacante", vacantesSchema)