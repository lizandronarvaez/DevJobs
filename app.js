// Importamos las dependecias
import colors from "colors";
import mongoose from "mongoose"
import MongoStore from "connect-mongo";
import "./source/database/Config.js"
import express from "express";
import route from "./source/routes/Routes.js";
import Handlebars from "handlebars";
import expHbs from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import helpers from "./source/helpers/Handlebars.js"
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import ExpressValidator from "express-validator";
import flash from "connect-flash";
import passport from "./source/database/Passport.js"
import errorCreate from "http-errors"
// Mongostre con session
const store = new MongoStore({
    mongoUrl: process.env.DATABASE,
    mongooseConnection: mongoose.connection
})
// Dotenv
config({ path: "variables.env" })

// Sinxtaxis para esteblecer la ruta de las carpetas
const __dirname = dirname(fileURLToPath(import.meta.url))
// App Express
const app = express();
// Habilitamos body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Express validator
app.use(ExpressValidator())
// Estblecemos la ruta de la vista
const pathLayout = path.join(__dirname, "/source/views/layouts")
const pathViews = path.join(__dirname, "/source/views")
const hbs = expHbs.create({
    defaulLayout: "main",
    layoutsDir: pathLayout,
    helpers,
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
// hbs.getTemplates
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", pathViews)

// Establecemos las rutas estaticas
const Public = path.join(__dirname, "/source/public")
const css = path.join(__dirname, "/source/views/styles")
app.use(express.static(Public))
app.use(express.static(css))
// Cookie-parser  and Session
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))
// inicializar Passport
app.use(passport.initialize());
app.use(passport.session())
// Alertas y flash mesanges
app.use(flash())
// Middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash()
    next();
})
// Uso de las rutas
app.use("/", route)

// Renderizaciones de errores
app.use((req, res, next) => {
    next(errorCreate(404, "Pagina no encontrada"));
})

app.use((error, req, res, next) => {
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);

    res.render("errores")
})

// Dejar que railway asigen el puerto y el host automatico
const host = "0.0.0.0";
const port = process.env.PORT || 8000
// Funcion para levantar el servidor

app.listen(port, host, () => {
    console.info(colors.blue(`El servidor se ha iniciado correctamente`))

})
// const puerto=3000
// app.listen(puerto,()=>{
//     console.log(`http://localhost:${puerto}`)
// }) 