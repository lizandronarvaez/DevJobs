import aa from"colors";import ra from"mongoose";import ta from"connect-mongo";import E from"mongoose";import{config as N}from"dotenv";import L from"colors";import A from"bcrypt";import P from"mongoose";P.Promise=global.Promise;var f=new P.Schema({email:{type:String,unique:!0,lowercase:!0,trim:!0},nombre:{type:String,required:"Agrega un nombre"},password:{type:String,required:!0,trim:!0},token:String,expiracion:Date,imagen:String,confirmarCuenta:{type:Number,default:0}});f.pre("save",async function(e){if(!this.isModified("password"))return e();let a=await A.hash(this.password,12);this.password=a,e()});f.post("save",function(e,a,r){e.name==="MongoError"&&e.code===11e3?r("No puedes registrarte con este correo, ya esta en uso"):r(e)});f.methods={compararPassword:function(e){return A.compareSync(e,this.password)}};var ka=P.model("Usuarios",f);import g from"mongoose";import M from"slug";import F from"shortid";g.Promise=global.Promise;var S=new g.Schema({titulo:{type:String,trim:!0},empresa:{type:String,trim:!0},ubicacion:{type:String,trim:!0},salario:{type:String,default:0,trim:!0},contrato:{type:String,trim:!0},descripcion:{type:String,trim:!0},url:{type:String,lowercase:!0},skills:[String],candidatos:[{nombre:{type:String,uppercase:!0},email:String,cv:String}],autor:{type:g.Schema.ObjectId,ref:"Usuarios"}});S.pre("save",function(e){let a=M(this.titulo);this.url=`${a}-${F.generate()}`,e()});S.index({titulo:"text"});var Aa=g.model("Vacante",S);N({path:"variables.env"});E.set("strictQuery",!1);E.connect(process.env.DATABASE,{useNewUrlParser:!0});E.connection.on("connected",e=>{console.log(e?L.red("No se pudo conectar a la base de datos",e):L.green("Servidor conectado a la base de datos correctamente"))});import p from"express";import Xe from"express";import J from"mongoose";var H=J.model("Vacante"),Q=async(e,a,r)=>{let t=await H.find().lean();if(!t)return r();a.render("home",{tituloPagina:"Plataforma de Empleo Devs",tagLine:"Plataforma para subir y encontrar trabajos para Desarrollares Web",barra:!0,boton:!0,vacantes:t})},z=Q;import re from"mongoose";import k from"multer";import te from"shortid";import{fileURLToPath as oe}from"url";import se,{dirname as ie}from"path";var d={host:"smtp.mailtrap.io",port:2525,auth:{user:"ee04cbd260a961",pass:"05a72070612c87"}};import G from"nodemailer";import W from"nodemailer-express-handlebars";import Z from"util";import{fileURLToPath as K}from"url";import Y,{dirname as X}from"path";var q=X(K(import.meta.url)),v=G.createTransport({host:d.host,port:d.port,auth:{user:d.auth.user,pass:d.auth.pass}}),ee=Y.join(q,"/../views/email");v.use("compile",W({viewEngine:{defaultLayout:!1},viewPath:ee,extName:".handlebars"}));var ae=async e=>{let a={from:"plataformaDevJob@hotmail.com",to:e.usuario.email,subject:e.subject,template:e.archivo,context:{resetUrl:e.resetUrl}};return Z.promisify(v.sendMail,v).call(v,a)},b=ae;var x=re.model("Usuarios"),ne=ie(oe(import.meta.url)),ce=(e,a,r)=>{me(e,a,t=>{if(t){t instanceof k.MulterError&&t.code==="LIMIT_FILE_SIZE"?e.flash("error","El archivo es muy grande"):e.flash("error",t.message),a.redirect("/administracion");return}else return r()})},ue=se.join(ne,"../public/uploads/perfiles"),le={limits:{fileSize:1e5},storage:k.diskStorage({destination:(e,a,r)=>{r(null,ue)},filename:(e,a,r)=>{let t=a.mimetype.split("/")[1];r(null,`${te.generate()}.${t}`)}}),fileFilter(e,a,r){a.mimetype==="image/jpeg"||a.mimetype==="image/png"?r(null,!0):r(new Error("Formato de archivo no valido."),!1)}},me=k(le).single("imagen"),de=(e,a)=>{a.render("crear-cuenta",{tituloPagina:"Crea tu cuenta en DevJobs",tagLine:"Publica tus vacantes, crea una cuenta y empieza ya!"})},pe=async(e,a,r)=>{let t=new x(e.body);try{let o=`http://${e.headers.host}/validar-cuenta/${e.body.email}`,c={email};await b({usuario:c.email,subject:"Confirma tu cuenta, por favor",validarCuenta:o,archivo:"confirmar-cuenta"}),await t.save(),e.flash("correcto","Usuario creado correctamente"),a.redirect("/iniciar-sesion")}catch(o){e.flash("error",o),a.redirect("/crear-cuenta")}},fe=async(e,a)=>{let r=await x.findOne({email:e.params.email});r?(r.confirmarCuenta=1,r.save(),e.flash("correcto","Tu cuenta se ha validado correctamente"),a.redirect("/iniciar-sesion")):(e.flash("error","Hubo un error en la validacion de la cuenta"),a.redirect("/nueva-cuenta"))},ge=(e,a)=>{a.render("iniciar-sesion",{tituloPagina:"Iniciar Sesion en DevJobs"})},ve=(e,a)=>{let r=e.user,{nombre:t,imagen:o}=e.user;a.render("editar-perfil",{tituloPagina:"Edita tu perfil en DevJobs",usuario:r,cerrarSesion:!0,nombre:t,imagen:o})},be=async(e,a)=>{let{_id:r}=e.user,t=await x.findById(r),{nombre:o,email:c,password:n}=e.body;t.nombre=o,t.email=c,n&&(t.password=n),e.file&&(t.imagen=e.file.filename),await t.save(),e.flash("correcto","Cambios guardados correctamente"),a.redirect("/administracion")},l={subirImagen:ce,formCrearUsuario:de,crearCuentaUsuario:pe,formIniciarSesion:ge,editarPerfil:be,formEditarPerfil:ve,verificarCuenta:fe};import ye from"mongoose";import V from"multer";import he from"shortid";import{fileURLToPath as we}from"url";import Pe,{dirname as Se}from"path";var m=ye.model("Vacante"),Ee=Se(we(import.meta.url)),xe=(e,a)=>{a.render("nueva-vacante",{tituloPagina:"Nueva Vacante",tagLine:"Llena el formulario y publica tu vacante",cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},ke=async(e,a)=>{let r=new m(e.body);r.autor=e.user._id,r.skills=e.body.skills.split(",");let t=await r.save();a.redirect("/")},Ve=async(e,a,r)=>{let{url:t}=e.params,o=await m.findOne({url:t}).populate("autor");o||r(),a.render("vacante",{tituloPagina:o.titulo,barra:!0,vacante:o})},Ue=async(e,a,r)=>{let{url:t}=e.params,o=await m.findOne({url:t});o||r(),a.render("editar-vacante",{vacante:o,tituloPagina:`Editar Vacante - ${o.titulo}`,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},Be=async(e,a,r)=>{let{body:t}=e,{url:o}=e.params;t.skills=t.skills.split(",");let c=await m.findOneAndUpdate({url:o},t,{new:!0,runValidators:!0});c||r(),a.redirect(`/vacantes/${c.url}`)},Ce=async(e,a)=>{let{id:r}=e.params,t=await m.findById(r);Ae(t,e.user)?(t.remove(),a.status(200).send("Vacante eliminada correctamente")):a.status(403).send("Error")},Ae=(e={},a={})=>!!e.autor.equals(a._id),Le=(e,a,r)=>{je(e,a,t=>{if(t){t instanceof V.MulterError&&t.code==="LIMIT_FILE_SIZE"?e.flash("error","El archivo es muy grande"):e.flash("error",t.message),a.redirect("back");return}else return r()})},ze=Pe.join(Ee,"../public/uploads/cv"),Re={limits:{fileSize:5e5},storage:V.diskStorage({destination:(e,a,r)=>{r(null,ze)},filename:(e,a,r)=>{let t=a.mimetype.split("/")[1];r(null,`${he.generate()}.${t}`)}}),fileFilter(e,a,r){a.mimetype==="application/pdf"?r(null,!0):r(new Error("Formato de archivo no valido."),!1)}},je=V(Re).single("cv"),$e=async(e,a,r)=>{let t=await m.findOne({url:e.params.url});if(!t)return r();let o={nombre:e.body.nombre,email:e.body.email,cv:e.file.filename};t.candidatos.push(o),await t.save(),e.flash("correcto","Se envio tu Cv correctamente"),a.redirect("/")},Ie=async(e,a,r)=>{let{id:t}=e.params,{nombre:o,imagen:c}=e.user,n=await m.findById(t),{candidatos:O}=n;if(n.autor!=e.user._id.toString()||!n)return r();a.render("candidatos",{tituloPagina:`Candidatos Vacante - ${n.titulo}`,cerrarSesion:!0,nombre:o,imagen:c,candidatos:O})},De=async(e,a)=>{let{query:r}=e.body,t=await m.find({$text:{$search:r}});a.render("home",{tituloPagina:`Resultados para la busqueda: ${r}`,barra:!0,vacantes:t})},u={formNuevaVacante:xe,agregarVacante:ke,findVacanteUrl:Ve,formEditarVacante:Ue,actualizarVacante:Be,eliminarVacante:Ce,subirCurriculum:Le,contactar:$e,mostrarCandidatos:Ie,buscarVacantesInput:De};var Te=(e,a,r)=>{let{password:t}=e.body;e.sanitizeBody("nombre").escape(),e.sanitizeBody("email").escape(),e.sanitizeBody("password").escape(),e.sanitizeBody("confirmarPassword").escape(),e.checkBody("nombre","Nombre es un campo obligatorio").notEmpty(),e.checkBody("email","Email es un campo obligatorio y valido").isEmail(),e.checkBody("password","Password es un campo obligatorio").notEmpty(),e.checkBody("confirmarPassword","Repetir Password es un campo obligatorio").notEmpty(),e.checkBody("confirmarPassword","El password es diferente").equals(t);let o=e.validationErrors();if(!o)return r();e.flash("error",o.map(c=>c.msg)),a.render("crear-cuenta",{tituloPagina:"Crea tu cuenta en DevJobs",tagLine:"Publica tus vacantes gratis,crea una cuenta y empieza ya!",mensajes:e.flash()})},R=Te;var _e=(e,a,r)=>{e.sanitizeBody("titulo").escape(),e.sanitizeBody("empresa").escape(),e.sanitizeBody("ubicacion").escape(),e.sanitizeBody("salario").escape(),e.sanitizeBody("contrato").escape(),e.sanitizeBody("skills").escape(),e.checkBody("titulo","Agrega un nombre a la vacante").notEmpty(),e.checkBody("empresa","Agrega una empresa").notEmpty(),e.checkBody("ubicacion","Agrega una ubicacion").notEmpty(),e.checkBody("contrato","Seleccion un tipo de contrato").notEmpty(),e.checkBody("skills","Seleccion al menos una habilidad").notEmpty();let t=e.validationErrors();if(!t)return r();e.flash("error",t.map(o=>o.msg)),a.render("nueva-vacante",{tituloPagina:"Nueva vacante",tagLine:"Publica tus vacantes rellenando el formulario",mensajes:e.flash()})},U=_e;var Oe=(e,a,r)=>{e.sanitizeBody("nombre").escape(),e.sanitizeBody("email").escape(),e.body.password&&e.sanitizeBody("password").escape(),e.checkBody("nombre","El nombre no puede ir vacio"),e.checkBody("email","El email no puede ir vacio");let t=e.validationErrors();if(!t)return r();e.flash("error",t.map(o=>o.msg)),a.render("editar-perfil",{tituloPagina:"Edita tu perfil en DevJobs",usuario,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen,mensajes:e.flash()})},j=Oe;import Me from"passport";import $ from"mongoose";import Ne from"crypto";var Fe=$.model("Vacante"),B=$.model("Usuarios"),Je=Me.authenticate("local",{successRedirect:"/administracion",failureRedirect:"/iniciar-sesion",failureFlash:!0,badRequestMessage:"Ambos campos son obligatorios"}),He=(e,a,r)=>{if(e.isAuthenticated())return r();a.redirect("/iniciar-sesion")},Qe=async(e,a)=>{let r=await Fe.find({autor:e.user._id}).lean();a.render("administracion",{tituloPagina:"Administracion",tagLine:"Crear y administra tus vacantes desde aqui",vacantes:r,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},Ge=(e,a,r)=>{e.logout(t=>t?r(t):(e.flash("correcto","Sesion Cerrada Correctamente"),a.redirect("/iniciar-sesion")))},We=(e,a,r)=>{a.render("reestablecer-password",{tituloPagina:"Reestablece tu password",tagLine:"Si ya tienes cuenta, y olvidastes tu contrase\xF1a, reestablecela"})},Ze=async(e,a,r)=>{let t=await B.findOne({email:e.body.email});if(!t)return e.flash("error","El email no existe"),a.redirect("/reestablecer-password");t.token=Ne.randomBytes(20).toString("hex"),t.expiracion=Date.now()+72e5,await t.save();let o=`http://${e.headers.host}/reestablecer-password/${t.token}`;await b({usuario:t,subject:"Reestablecimiento de contrase\xF1a",resetUrl:o,archivo:"reset-password"}),e.flash("correcto","Revisa tu email, para reestablecer la contrase\xF1a"),a.redirect("/iniciar-sesion")},Ke=async(e,a)=>{let{token:r}=e.params;await B.findOne({token:r,expiracion:{$gt:Date.now()}})||e.flash("error","El tiempo para reestablecer la contrase\xF1a, expir\xF3"),a.render("nueva-contrase\xF1a",{tituloPagina:"Reestablece tu nueva password",tagLine:"Escribe tu nueva contrase\xF1a,para cambiarla"})},Ye=async(e,a,r)=>{let{token:t}=e.params,{password:o,confirmarPassword:c}=e.body,n=await B.findOne({token:t,expiracion:{$gt:Date.now()}});n||e.flash("error","El tiempo para reestablecer la contrase\xF1a, expir\xF3"),n.password=o,n.token=void 0,n.expiracion=void 0,await n.save(),e.flash("correcto","La contrase\xF1a ha sido actualiada correctamente"),a.redirect("/iniciar-sesion")},i={autenticarUsuario:Je,mostrarPanelAdministracion:Qe,usuarioAutenticado:He,cerrarSesion:Ge,reestablecerPasswordForm:We,reestablecerPassword:Ze,verificarToken:Ke,cambiarPassword:Ye};var I=Xe.Router();I.get("/",z).get("/vacantes/nueva",i.usuarioAutenticado,u.formNuevaVacante).post("/vacantes/nueva",i.usuarioAutenticado,U,u.agregarVacante).get("/vacantes/:url",u.findVacanteUrl).get("/vacantes/editar/:url",i.usuarioAutenticado,u.formEditarVacante).post("/vacantes/editar/:url",i.usuarioAutenticado,U,u.actualizarVacante).delete("/vacantes/eliminar/:id",u.eliminarVacante).get("/crear-cuenta",l.formCrearUsuario).post("/crear-cuenta",R,l.crearCuentaUsuario).get("/iniciar-sesion",l.formIniciarSesion).post("/iniciar-sesion",i.autenticarUsuario).get("/cerrar-sesion",i.usuarioAutenticado,i.cerrarSesion).get("/verificar-cuenta/:email",l.verificarCuenta).get("/reestablecer-password",i.reestablecerPasswordForm).post("/reestablecer-password",i.reestablecerPassword).get("/reestablecer-password/:token",i.verificarToken).post("/reestablecer-password/:token",i.cambiarPassword).get("/administracion",i.usuarioAutenticado,i.mostrarPanelAdministracion).get("/editar-perfil",i.usuarioAutenticado,l.formEditarPerfil).post("/editar-perfil",i.usuarioAutenticado,j,l.subirImagen,l.editarPerfil).post("/vacantes/:url",u.subirCurriculum,u.contactar).get("/candidatos/:id",i.usuarioAutenticado,u.mostrarCandidatos).post("/buscador",u.buscarVacantesInput);var D=I;import oa from"handlebars";import sa from"express-handlebars";import{allowInsecurePrototypeAccess as ia}from"@handlebars/allow-prototype-access";import{config as na}from"dotenv";import ca from"cookie-parser";import ua from"express-session";var T={seleccionarSkills:(e=[],a)=>{let r=["HTML5","CSS","Apollo","Node","React JS","CSSGRID","FlexBox","JavaScript","React Hooks","Redux","GraphQL","TypeScript","Django","ORM","Sass","Laravel","Sequelize","Mongoose","SQL","MVC","PHP","Phyton","VueJs","Angular","WordPress"],t="";return r.forEach(o=>{t+=`<li ${e.includes(o)?'class="activo"':""}>${o}</li>`}),a.fn=t},tipoContrato:(e,a)=>a.fn(void 0).replace(new RegExp(`value="${e}"`),'$& selected="selected"'),mostrarAlertas:(e={},a)=>{let r=Object.keys(e),t="";return r.length&&e[r].forEach(o=>{t+=`<div class="${r} alerta"> ${o}</div>`}),a.fn=t}};import{fileURLToPath as la}from"url";import h,{dirname as ma}from"path";import da from"express-validator";import pa from"connect-flash";import y from"passport";import{Strategy as qe}from"passport-local";import ea from"mongoose";var _=ea.model("Usuarios");y.use(new qe({usernameField:"email",passwordField:"password"},async(e,a,r)=>{let t=await _.findOne({email:e});return t?t.compararPassword(a)?r(null,t):r(null,!1,{message:"El password es incorrecto"}):r(null,!1,{message:"El usuario no existe"})}));y.serializeUser((e,a)=>a(null,e._id));y.deserializeUser(async(e,a)=>{let r=await _.findById(e);return a(null,r)});var C=y;import fa from"http-errors";var ga=new ta({mongoUrl:process.env.DATABASE,mongooseConnection:ra.connection});na({path:"variables.env"});var w=ma(la(import.meta.url)),s=p();s.use(p.json());s.use(p.urlencoded({extended:!0}));s.use(da());var va=h.join(w,"/source/views/layouts"),ba=h.join(w,"/source/views"),ya=sa.create({defaulLayout:"main",layoutsDir:va,helpers:T,handlebars:ia(oa)});s.engine("handlebars",ya.engine);s.set("view engine","handlebars");s.set("views",ba);var ha=h.join(w,"/source/public"),wa=h.join(w,"/source/views/styles");s.use(p.static(ha));s.use(p.static(wa));s.use(ca());s.use(ua({secret:process.env.SECRETO,key:process.env.KEY,resave:!1,saveUninitialized:!1,store:ga}));s.use(C.initialize());s.use(C.session());s.use(pa());s.use((e,a,r)=>{a.locals.mensajes=e.flash(),r()});s.use("/",D);s.use((e,a,r)=>{r(fa(404,"Pagina no encontrada"))});s.use((e,a,r,t)=>{r.locals.mensaje=e.message;let o=e.status||500;r.locals.status=o,r.status(o),r.render("errores")});var Pa="0.0.0.0",Sa=process.env.PORT,Gr=process.env.PORT||800;s.listen(Sa,Pa,()=>{console.info(aa.blue("El servidor se ha iniciado correctamente"))});
