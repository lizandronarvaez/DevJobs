import emailConfig from "../database/Mailtrap.js";
import nodemailer from "nodemailer";
import handlebars from "nodemailer-express-handlebars";
import util from "util";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url))

// Esta es la forma de crear el transporter
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass
    }
});

// Creamos el handleabrs para el usuario
const viewPath = path.join(__dirname, "/../views/email")
transport.use("compile", handlebars({
    viewEngine: {
        defaultLayout: false
    },
    viewPath,
    extName: ".handlebars"
}));


const enviarEmailUsuario = async (opciones) => {

    // console.log(opciones)
    // Creamos la configuracion para enviar el email al usuario
    const opcionesEmail = {
        from: "plataformaDevJob@hotmail.com",
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl,
            validarCuenta:opciones.validarCuenta
        }
    }
    // Creamos el callback para hacer el envio
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail)
}

export default enviarEmailUsuario