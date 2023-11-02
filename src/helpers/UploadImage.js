import multer from "multer";
import shortid from "shortid";
// 
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url))
// Funcion para subir imagen
export const subirImagen = (req, res, next) => {
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
