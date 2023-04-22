import ra from"colors";import ta from"mongoose";import oa from"connect-mongo";import x from"mongoose";import{config as N}from"dotenv";import L from"colors";import A from"bcrypt";import P from"mongoose";P.Promise=global.Promise;var g=new P.Schema({email:{type:String,unique:!0,lowercase:!0,trim:!0},nombre:{type:String,required:"Agrega un nombre"},password:{type:String,required:!0,trim:!0},token:String,expiracion:Date,imagen:String,confirmarCuenta:{type:Number,default:0}});g.pre("save",async function(e){if(!this.isModified("password"))return e();this.password=await A.hash(this.password,12),e()});g.post("save",function(e,r,a){e.name==="MongoError"&&e.code===11e3?a("No puedes registrarte con este correo, ya esta en uso"):a(e)});g.methods={compararPassword:function(e){return A.compareSync(e,this.password)}};var ka=P.model("Usuarios",g);import v from"mongoose";import M from"slug";import F from"shortid";v.Promise=global.Promise;var E=new v.Schema({titulo:{type:String,trim:!0},empresa:{type:String,trim:!0},ubicacion:{type:String,trim:!0},salario:{type:String,default:0,trim:!0},contrato:{type:String,trim:!0},descripcion:{type:String,trim:!0},url:{type:String,lowercase:!0},skills:[String],candidatos:[{nombre:{type:String,uppercase:!0},email:String,cv:String}],autor:{type:v.Schema.ObjectId,ref:"Usuarios"}});E.pre("save",function(e){let r=M(this.titulo);this.url=`${r}-${F.generate()}`,e()});E.index({titulo:"text"});var La=v.model("Vacante",E);N({path:"variables.env"});x.set("strictQuery",!1);x.connect(process.env.DATABASE,{useNewUrlParser:!0});x.connection.on("connected",e=>{console.log(e?L.red("No se pudo conectar a la base de datos",e):L.green("Servidor conectado a la base de datos correctamente"))});import f from"express";import qe from"express";import J from"mongoose";var H=J.model("Vacante"),Q=async(e,r,a)=>{let t=await H.find().lean();if(!t)return a();r.render("home",{tituloPagina:"Plataforma de Empleo Devs",tagLine:"Plataforma para subir y encontrar trabajos para Desarrollares Web",barra:!0,boton:!0,vacantes:t})},z=Q;import re from"mongoose";import C from"multer";import te from"shortid";import{fileURLToPath as oe}from"url";import se,{dirname as ie}from"path";var d={host:"sandbox.smtp.mailtrap.io",port:2525,auth:{user:"ee04cbd260a961",pass:"05a72070612c87"}};import G from"nodemailer";import W from"nodemailer-express-handlebars";import Z from"util";import{fileURLToPath as K}from"url";import Y,{dirname as X}from"path";var q=X(K(import.meta.url)),b=G.createTransport({host:d.host,port:d.port,auth:{user:d.auth.user,pass:d.auth.pass}}),ee=Y.join(q,"/../views/email");b.use("compile",W({viewEngine:{defaultLayout:!1},viewPath:ee,extName:".handlebars"}));var ae=async e=>{let r={from:"plataformaDevJob@hotmail.com",to:e.usuario.email,subject:e.subject,template:e.archivo,context:{resetUrl:e.resetUrl,validarCuenta:e.validarCuenta}};return Z.promisify(b.sendMail,b).call(b,r)},y=ae;var p=re.model("Usuarios"),ne=ie(oe(import.meta.url)),ce=(e,r,a)=>{me(e,r,t=>{if(t){t instanceof C.MulterError&&t.code==="LIMIT_FILE_SIZE"?e.flash("error","El archivo es muy grande"):e.flash("error",t.message),r.redirect("/administracion");return}else return a()})},ue=se.join(ne,"../public/uploads/perfiles"),le={limits:{fileSize:1e5},storage:C.diskStorage({destination:(e,r,a)=>{a(null,ue)},filename:(e,r,a)=>{let t=r.mimetype.split("/")[1];a(null,`${te.generate()}.${t}`)}}),fileFilter(e,r,a){r.mimetype==="image/jpeg"||r.mimetype==="image/png"?a(null,!0):a(new Error("Formato de archivo no valido."),!1)}},me=C(le).single("imagen"),de=(e,r)=>{r.render("crear-cuenta",{tituloPagina:"Crea tu cuenta en DevJobs",tagLine:"Publica tus vacantes, crea una cuenta y empieza ya!"})},pe=async(e,r)=>{try{let o=new p(e.body);e.flash("correcto","Valida tu cuenta en el correo electronico con el que te haz registrado"),r.redirect("/iniciar-sesion"),await o.save()}catch(o){e.flash("error",o.message),r.redirect("/crear-cuenta")}let a=`http://${e.headers.host}/verificar-cuenta/${e.body.email}`,t=await p.findOne({email:e.body.email});await y({usuario:t,subject:"Confirma tu cuenta, por favor",validarCuenta:a,archivo:"confirmar-cuenta"})},fe=async(e,r)=>{let a=await p.findOne({email:e.params.email});a?(a.confirmarCuenta=1,a.save(),e.flash("correcto","Tu cuenta se ha validado correctamente"),r.redirect("/iniciar-sesion")):(e.flash("error","Hubo un error en la validacion de la cuenta"),r.redirect("/crear-cuenta"))},ge=async(e,r,a)=>{let{email:t}=e.body;if((await p.findOne({email:t})).confirmarCuenta===0){e.flash("error","Debes confirmar tu cuenta para iniciar sesion"),r.redirect("/iniciar-sesion");return}a()},ve=(e,r)=>{r.render("iniciar-sesion",{tituloPagina:"Iniciar Sesion en DevJobs"})},be=(e,r)=>{let a=e.user,{nombre:t,imagen:o}=e.user;r.render("editar-perfil",{tituloPagina:"Edita tu perfil en DevJobs",usuario:a,cerrarSesion:!0,nombre:t,imagen:o})},ye=async(e,r)=>{let{_id:a}=e.user,t=await p.findById(a),{nombre:o,email:u,password:m}=e.body;t.nombre=o,t.email=u,m&&(t.password=m),e.file&&(t.imagen=e.file.filename),await t.save(),e.flash("correcto","Cambios guardados correctamente"),r.redirect("/administracion")},c={subirImagen:ce,formCrearUsuario:de,crearCuentaUsuario:pe,formIniciarSesion:ve,editarPerfil:ye,formEditarPerfil:be,confirmarCuenta:fe,verificarCuenta:ge};import he from"mongoose";import k from"multer";import we from"shortid";import{fileURLToPath as Se}from"url";import Pe,{dirname as Ee}from"path";var l=he.model("Vacante"),xe=Ee(Se(import.meta.url)),Ce=(e,r)=>{r.render("nueva-vacante",{tituloPagina:"Nueva Vacante",tagLine:"Llena el formulario y publica tu vacante",cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},ke=async(e,r)=>{let a=new l(e.body);a.autor=e.user._id,a.skills=e.body.skills.split(",");let t=await a.save();r.redirect("/")},Ve=async(e,r,a)=>{let{url:t}=e.params,o=await l.findOne({url:t}).populate("autor");o||a(),r.render("vacante",{tituloPagina:o.titulo,barra:!0,vacante:o})},Ue=async(e,r,a)=>{let{url:t}=e.params,o=await l.findOne({url:t});o||a(),r.render("editar-vacante",{vacante:o,tituloPagina:`Editar Vacante - ${o.titulo}`,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},Be=async(e,r,a)=>{let{body:t}=e,{url:o}=e.params;t.skills=t.skills.split(",");let u=await l.findOneAndUpdate({url:o},t,{new:!0,runValidators:!0});u||a(),r.redirect(`/vacantes/${u.url}`)},Ae=async(e,r)=>{let{id:a}=e.params,t=await l.findById(a);Le(t,e.user)?(t.remove(),r.status(200).send("Vacante eliminada correctamente")):r.status(403).send("Error")},Le=(e={},r={})=>!!e.autor.equals(r._id),ze=(e,r,a)=>{Re(e,r,t=>{if(t){t instanceof k.MulterError&&t.code==="LIMIT_FILE_SIZE"?e.flash("error","El archivo es muy grande"):e.flash("error",t.message),r.redirect("back");return}else return a()})},je=Pe.join(xe,"../public/uploads/cv"),$e={limits:{fileSize:5e5},storage:k.diskStorage({destination:(e,r,a)=>{a(null,je)},filename:(e,r,a)=>{let t=r.mimetype.split("/")[1];a(null,`${we.generate()}.${t}`)}}),fileFilter(e,r,a){r.mimetype==="application/pdf"?a(null,!0):a(new Error("Formato de archivo no valido."),!1)}},Re=k($e).single("cv"),De=async(e,r,a)=>{let t=await l.findOne({url:e.params.url});if(!t)return a();let o={nombre:e.body.nombre,email:e.body.email,cv:e.file.filename};t.candidatos.push(o),await t.save(),e.flash("correcto","Se envio tu Cv correctamente"),r.redirect("/")},Ie=async(e,r,a)=>{let{id:t}=e.params,{nombre:o,imagen:u}=e.user,m=await l.findById(t),{candidatos:O}=m;if(m.autor!=e.user._id.toString()||!m)return a();r.render("candidatos",{tituloPagina:`Candidatos Vacante - ${m.titulo}`,cerrarSesion:!0,nombre:o,imagen:u,candidatos:O})},Te=async(e,r)=>{let{query:a}=e.body,t=await l.find({$text:{$search:a}});r.render("home",{tituloPagina:`Resultados para la busqueda: ${a}`,barra:!0,vacantes:t})},n={formNuevaVacante:Ce,agregarVacante:ke,findVacanteUrl:Ve,formEditarVacante:Ue,actualizarVacante:Be,eliminarVacante:Ae,subirCurriculum:ze,contactar:De,mostrarCandidatos:Ie,buscarVacantesInput:Te};var _e=(e,r,a)=>{let{password:t}=e.body;e.sanitizeBody("nombre").escape(),e.sanitizeBody("email").escape(),e.sanitizeBody("password").escape(),e.sanitizeBody("confirmarPassword").escape(),e.checkBody("nombre","Nombre es un campo obligatorio").notEmpty(),e.checkBody("email","Email es un campo obligatorio y valido").isEmail(),e.checkBody("password","Password es un campo obligatorio").notEmpty(),e.checkBody("confirmarPassword","Repetir Password es un campo obligatorio").notEmpty(),e.checkBody("confirmarPassword","Las contrase\xF1as no coinciden").equals(t);let o=e.validationErrors();if(!o)return a();e.flash("error",o.map(u=>u.msg)),r.render("crear-cuenta",{tituloPagina:"Crea tu cuenta en DevJobs",tagLine:"Publica tus vacantes gratis,crea una cuenta y empieza ya!",mensajes:e.flash()})},j=_e;var Oe=(e,r,a)=>{e.sanitizeBody("titulo").escape(),e.sanitizeBody("empresa").escape(),e.sanitizeBody("ubicacion").escape(),e.sanitizeBody("salario").escape(),e.sanitizeBody("contrato").escape(),e.sanitizeBody("skills").escape(),e.checkBody("titulo","Agrega un nombre a la vacante").notEmpty(),e.checkBody("empresa","Agrega una empresa").notEmpty(),e.checkBody("ubicacion","Agrega una ubicacion").notEmpty(),e.checkBody("contrato","Seleccion un tipo de contrato").notEmpty(),e.checkBody("skills","Seleccion al menos una habilidad").notEmpty();let t=e.validationErrors();if(!t)return a();e.flash("error",t.map(o=>o.msg)),r.render("nueva-vacante",{tituloPagina:"Nueva vacante",tagLine:"Publica tus vacantes rellenando el formulario",mensajes:e.flash()})},V=Oe;var Me=(e,r,a)=>{e.sanitizeBody("nombre").escape(),e.sanitizeBody("email").escape(),e.body.password&&e.sanitizeBody("password").escape(),e.checkBody("nombre","El nombre no puede ir vacio"),e.checkBody("email","El email no puede ir vacio");let t=e.validationErrors();if(!t)return a();e.flash("error",t.map(o=>o.msg)),r.render("editar-perfil",{tituloPagina:"Edita tu perfil en DevJobs",usuario,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen,mensajes:e.flash()})},$=Me;import Fe from"passport";import R from"mongoose";import Je from"crypto";var Ne=R.model("Vacante"),U=R.model("Usuarios"),He=Fe.authenticate("local",{successRedirect:"/administracion",failureRedirect:"/iniciar-sesion",failureFlash:!0,badRequestMessage:"Ambos campos son obligatorios"}),Qe=(e,r,a)=>{if(e.isAuthenticated())return a();r.redirect("/iniciar-sesion")},Ge=async(e,r)=>{let a=await Ne.find({autor:e.user._id}).lean();r.render("administracion",{tituloPagina:"Administracion",tagLine:"Crear y administra tus vacantes desde aqui",vacantes:a,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},We=(e,r,a)=>{e.logout(t=>t?a(t):(e.flash("correcto","Sesion Cerrada Correctamente"),r.redirect("/iniciar-sesion")))},Ze=(e,r)=>{r.render("reestablecer-password",{tituloPagina:"Reestablece tu password",tagLine:"Si ya tienes cuenta, y olvidastes tu contrase\xF1a, reestablecela"})},Ke=async(e,r)=>{let a=await U.findOne({email:e.body.email});if(!a)return e.flash("error","El email no existe"),r.redirect("/reestablecer-password");a.token=Je.randomBytes(20).toString("hex"),a.expiracion=Date.now()+72e5,await a.save();let t=`http://${e.headers.host}/reestablecer-password/${a.token}`;await y({usuario:a,subject:"Reestablecimiento de contrase\xF1a",resetUrl:t,archivo:"reset-password"}),e.flash("correcto","Revisa tu email, para reestablecer la contrase\xF1a"),r.redirect("/iniciar-sesion")},Ye=async(e,r)=>{let{token:a}=e.params;await U.findOne({token:a,expiracion:{$gt:Date.now()}})||e.flash("error","El tiempo para reestablecer la contrase\xF1a, expir\xF3"),r.render("nueva-contrase\xF1a",{tituloPagina:"Reestablece tu nueva password",tagLine:"Escribe tu nueva contrase\xF1a,para cambiarla"})},Xe=async(e,r)=>{let{token:a}=e.params,{password:t}=e.body,o=await U.findOne({token:a,expiracion:{$gt:Date.now()}});o||e.flash("error","El tiempo para reestablecer la contrase\xF1a, expir\xF3"),o.password=t,o.token=void 0,o.expiracion=void 0,await o.save(),e.flash("correcto","La contrase\xF1a ha sido actualiada correctamente"),r.redirect("/iniciar-sesion")},i={autenticarUsuario:He,mostrarPanelAdministracion:Ge,usuarioAutenticado:Qe,cerrarSesion:We,reestablecerPasswordForm:Ze,reestablecerPassword:Ke,verificarToken:Ye,cambiarPassword:Xe};var D=qe.Router();D.get("/",z).get("/vacantes/nueva",i.usuarioAutenticado,n.formNuevaVacante).post("/vacantes/nueva",i.usuarioAutenticado,V,n.agregarVacante).get("/vacantes/:url",n.findVacanteUrl).get("/vacantes/editar/:url",i.usuarioAutenticado,n.formEditarVacante).post("/vacantes/editar/:url",i.usuarioAutenticado,V,n.actualizarVacante).delete("/vacantes/eliminar/:id",n.eliminarVacante).get("/crear-cuenta",c.formCrearUsuario).post("/crear-cuenta",j,c.crearCuentaUsuario).get("/iniciar-sesion",c.formIniciarSesion).post("/iniciar-sesion",c.verificarCuenta,i.autenticarUsuario).get("/cerrar-sesion",i.usuarioAutenticado,i.cerrarSesion).get("/verificar-cuenta/:email",c.confirmarCuenta).get("/reestablecer-password",i.reestablecerPasswordForm).post("/reestablecer-password",i.reestablecerPassword).get("/reestablecer-password/:token",i.verificarToken).post("/reestablecer-password/:token",i.cambiarPassword).get("/administracion",i.usuarioAutenticado,i.mostrarPanelAdministracion).get("/editar-perfil",i.usuarioAutenticado,c.formEditarPerfil).post("/editar-perfil",i.usuarioAutenticado,$,c.subirImagen,c.editarPerfil).post("/vacantes/:url",n.subirCurriculum,n.contactar).get("/candidatos/:id",i.usuarioAutenticado,n.mostrarCandidatos).post("/buscador",n.buscarVacantesInput);var I=D;import sa from"handlebars";import ia from"express-handlebars";import{allowInsecurePrototypeAccess as na}from"@handlebars/allow-prototype-access";import{config as ca}from"dotenv";import ua from"cookie-parser";import la from"express-session";var T={seleccionarSkills:(e=[],r)=>{let a=["HTML5","CSS","Apollo","Node","React JS","CSSGRID","FlexBox","JavaScript","React Hooks","Redux","GraphQL","TypeScript","Django","ORM","Sass","Laravel","Sequelize","Mongoose","SQL","MVC","PHP","Phyton","VueJs","Angular","WordPress"],t="";return a.forEach(o=>{t+=`<li ${e.includes(o)?'class="activo"':""}>${o}</li>`}),r.fn=t},tipoContrato:(e,r)=>r.fn(void 0).replace(new RegExp(`value="${e}"`),'$& selected="selected"'),mostrarAlertas:(e={},r)=>{let a=Object.keys(e),t="";return a.length&&e[a].forEach(o=>{t+=`<div class="${a} alerta"> ${o}</div>`}),r.fn=t}};import{fileURLToPath as ma}from"url";import w,{dirname as da}from"path";import pa from"express-validator";import fa from"connect-flash";import h from"passport";import{Strategy as ea}from"passport-local";import aa from"mongoose";var _=aa.model("Usuarios");h.use(new ea({usernameField:"email",passwordField:"password"},async(e,r,a)=>{let t=await _.findOne({email:e});return t?t.compararPassword(r)?a(null,t):a(null,!1,{message:"El password es incorrecto"}):a(null,!1,{message:"El email introducido, no esta registrado"})}));h.serializeUser((e,r)=>r(null,e._id));h.deserializeUser(async(e,r)=>{let a=await _.findById(e);return r(null,a)});var B=h;import ga from"http-errors";var va=new oa({mongoUrl:process.env.DATABASE,mongooseConnection:ta.connection});ca({path:"variables.env"});var S=da(ma(import.meta.url)),s=f();s.use(f.json());s.use(f.urlencoded({extended:!0}));s.use(pa());var ba=w.join(S,"/source/views/layouts"),ya=w.join(S,"/source/views"),ha=ia.create({defaulLayout:"main",layoutsDir:ba,helpers:T,handlebars:na(sa)});s.engine("handlebars",ha.engine);s.set("view engine","handlebars");s.set("views",ya);var wa=w.join(S,"/source/public"),Sa=w.join(S,"/source/views/styles");s.use(f.static(wa));s.use(f.static(Sa));s.use(ua());s.use(la({secret:process.env.SECRETO,key:process.env.KEY,resave:!1,saveUninitialized:!1,store:va}));s.use(B.initialize());s.use(B.session());s.use(fa());s.use((e,r,a)=>{r.locals.mensajes=e.flash(),a()});s.use("/",I);s.use((e,r,a)=>{a(ga(404,"Pagina no encontrada"))});s.use((e,r,a,t)=>{a.locals.mensaje=e.message;let o=e.status||500;a.locals.status=o,a.status(o),a.render("errores")});var Pa="0.0.0.0",Ea=process.env.PORT||8e3;s.listen(Ea,Pa,()=>{console.info(ra.blue("El servidor se ha iniciado correctamente"))});
