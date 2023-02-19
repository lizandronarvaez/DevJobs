import ea from"colors";import aa from"mongoose";import ra from"connect-mongo";import S from"mongoose";import{config as N}from"dotenv";import A from"colors";import B from"bcrypt";import w from"mongoose";w.Promise=global.Promise;var f=new w.Schema({email:{type:String,unique:!0,lowercase:!0,trim:!0},nombre:{type:String,required:"Agrega un nombre"},password:{type:String,required:!0,trim:!0},token:String,expiracion:Date,imagen:String});f.pre("save",async function(e){if(!this.isModified("password"))return e();let a=await B.hash(this.password,12);this.password=a,e()});f.post("save",function(e,a,r){e.name==="MongoError"&&e.code===11e3?r("No puedes registrarte con este correo, ya esta en uso"):r(e)});f.methods={compararPassword:function(e){return B.compareSync(e,this.password)}};var xa=w.model("Usuarios",f);import g from"mongoose";import O from"slug";import F from"shortid";g.Promise=global.Promise;var P=new g.Schema({titulo:{type:String,trim:!0},empresa:{type:String,trim:!0},ubicacion:{type:String,trim:!0},salario:{type:String,default:0,trim:!0},contrato:{type:String,trim:!0},descripcion:{type:String,trim:!0},url:{type:String,lowercase:!0},skills:[String],candidatos:[{nombre:{type:String,uppercase:!0},email:String,cv:String}],autor:{type:g.Schema.ObjectId,ref:"Usuarios"}});P.pre("save",function(e){let a=O(this.titulo);this.url=`${a}-${F.generate()}`,e()});P.index({titulo:"text"});var Aa=g.model("Vacante",P);N({path:"variables.env"});S.set("strictQuery",!1);S.connect(process.env.DATABASE,{useNewUrlParser:!0});S.connection.on("connected",e=>{console.log(e?A.red("No se pudo conectar a la base de datos",e):A.green("Servidor conectado a la base de datos correctamente"))});import p from"express";import Ye from"express";import J from"mongoose";var H=J.model("Vacante"),Q=async(e,a,r)=>{let t=await H.find().lean();if(!t)return r();a.render("home",{tituloPagina:"Plataforma de Empleo Devs",tagLine:"Plataforma para subir y encontrar trabajos para Desarrollares Web",barra:!0,boton:!0,vacantes:t})},C=Q;import G from"mongoose";import E from"multer";import W from"shortid";import{fileURLToPath as Z}from"url";import K,{dirname as Y}from"path";var L=G.model("Usuarios"),X=Y(Z(import.meta.url)),q=(e,a,r)=>{re(e,a,t=>{if(t){t instanceof E.MulterError&&t.code==="LIMIT_FILE_SIZE"?e.flash("error","El archivo es muy grande"):e.flash("error",t.message),a.redirect("/administracion");return}else return r()})},ee=K.join(X,"../public/uploads/perfiles"),ae={limits:{fileSize:1e5},storage:E.diskStorage({destination:(e,a,r)=>{r(null,ee)},filename:(e,a,r)=>{let t=a.mimetype.split("/")[1];r(null,`${W.generate()}.${t}`)}}),fileFilter(e,a,r){a.mimetype==="image/jpeg"||a.mimetype==="image/png"?r(null,!0):r(new Error("Formato de archivo no valido."),!1)}},re=E(ae).single("imagen"),te=(e,a)=>{a.render("crear-cuenta",{tituloPagina:"Crea tu cuenta en DevJobs",tagLine:"Publica tus vacantes gratis,crea una cuenta y empieza ya!"})},oe=async(e,a,r)=>{let t=new L(e.body);try{await t.save(),e.flash("correcto","Usuario creado correctamente"),a.redirect("/iniciar-sesion")}catch(o){e.flash("error",o),a.redirect("/crear-cuenta")}},se=(e,a)=>{a.render("iniciar-sesion",{tituloPagina:"Iniciar Sesion en DevJobs"})},ie=(e,a)=>{let r=e.user,{nombre:t,imagen:o}=e.user;a.render("editar-perfil",{tituloPagina:"Edita tu perfil en DevJobs",usuario:r,cerrarSesion:!0,nombre:t,imagen:o})},ne=async(e,a)=>{let{_id:r}=e.user,t=await L.findById(r),{nombre:o,email:l,password:n}=e.body;t.nombre=o,t.email=l,n&&(t.password=n),e.file&&(t.imagen=e.file.filename),await t.save(),e.flash("correcto","Cambios guardados correctamente"),a.redirect("/administracion")},m={subirImagen:q,formCrearUsuario:te,crearCuentaUsuario:oe,formIniciarSesion:se,editarPerfil:ne,formEditarPerfil:ie};import ce from"mongoose";import x from"multer";import le from"shortid";import{fileURLToPath as ue}from"url";import me,{dirname as de}from"path";var u=ce.model("Vacante"),pe=de(ue(import.meta.url)),fe=(e,a)=>{a.render("nueva-vacante",{tituloPagina:"Nueva Vacante",tagLine:"Llena el formulario y publica tu vacante",cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},ge=async(e,a)=>{let r=new u(e.body);r.autor=e.user._id,r.skills=e.body.skills.split(",");let t=await r.save();a.redirect("/")},be=async(e,a,r)=>{let{url:t}=e.params,o=await u.findOne({url:t}).populate("autor");o||r(),a.render("vacante",{tituloPagina:o.titulo,barra:!0,vacante:o})},ve=async(e,a,r)=>{let{url:t}=e.params,o=await u.findOne({url:t});o||r(),a.render("editar-vacante",{vacante:o,tituloPagina:`Editar Vacante - ${o.titulo}`,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},ye=async(e,a,r)=>{let{body:t}=e,{url:o}=e.params;t.skills=t.skills.split(",");let l=await u.findOneAndUpdate({url:o},t,{new:!0,runValidators:!0});l||r(),a.redirect(`/vacantes/${l.url}`)},he=async(e,a)=>{let{id:r}=e.params,t=await u.findById(r);we(t,e.user)?(t.remove(),a.status(200).send("Vacante eliminada correctamente")):a.status(403).send("Error")},we=(e={},a={})=>!!e.autor.equals(a._id),Pe=(e,a,r)=>{xe(e,a,t=>{if(t){t instanceof x.MulterError&&t.code==="LIMIT_FILE_SIZE"?e.flash("error","El archivo es muy grande"):e.flash("error",t.message),a.redirect("back");return}else return r()})},Se=me.join(pe,"../public/uploads/cv"),Ee={limits:{fileSize:5e5},storage:x.diskStorage({destination:(e,a,r)=>{r(null,Se)},filename:(e,a,r)=>{let t=a.mimetype.split("/")[1];r(null,`${le.generate()}.${t}`)}}),fileFilter(e,a,r){a.mimetype==="application/pdf"?r(null,!0):r(new Error("Formato de archivo no valido."),!1)}},xe=x(Ee).single("cv"),ke=async(e,a,r)=>{let t=await u.findOne({url:e.params.url});if(!t)return r();let o={nombre:e.body.nombre,email:e.body.email,cv:e.file.filename};t.candidatos.push(o),await t.save(),e.flash("correcto","Se envio tu Cv correctamente"),a.redirect("/")},Ve=async(e,a,r)=>{let{id:t}=e.params,{nombre:o,imagen:l}=e.user,n=await u.findById(t),{candidatos:M}=n;if(n.autor!=e.user._id.toString()||!n)return r();a.render("candidatos",{tituloPagina:`Candidatos Vacante - ${n.titulo}`,cerrarSesion:!0,nombre:o,imagen:l,candidatos:M})},Ue=async(e,a)=>{let{query:r}=e.body,t=await u.find({$text:{$search:r}});a.render("home",{tituloPagina:`Resultados para la busqueda: ${r}`,barra:!0,vacantes:t})},c={formNuevaVacante:fe,agregarVacante:ge,findVacanteUrl:be,formEditarVacante:ve,actualizarVacante:ye,eliminarVacante:he,subirCurriculum:Pe,contactar:ke,mostrarCandidatos:Ve,buscarVacantesInput:Ue};var Be=(e,a,r)=>{let{password:t}=e.body;e.sanitizeBody("nombre").escape(),e.sanitizeBody("email").escape(),e.sanitizeBody("password").escape(),e.sanitizeBody("confirmarPassword").escape(),e.checkBody("nombre","Nombre es un campo obligatorio").notEmpty(),e.checkBody("email","Email es un campo obligatorio y valido").isEmail(),e.checkBody("password","Password es un campo obligatorio").notEmpty(),e.checkBody("confirmarPassword","Repetir Password es un campo obligatorio").notEmpty(),e.checkBody("confirmarPassword","El password es diferente").equals(t);let o=e.validationErrors();if(!o)return r();e.flash("error",o.map(l=>l.msg)),a.render("crear-cuenta",{tituloPagina:"Crea tu cuenta en DevJobs",tagLine:"Publica tus vacantes gratis,crea una cuenta y empieza ya!",mensajes:e.flash()})},z=Be;var Ae=(e,a,r)=>{e.sanitizeBody("titulo").escape(),e.sanitizeBody("empresa").escape(),e.sanitizeBody("ubicacion").escape(),e.sanitizeBody("salario").escape(),e.sanitizeBody("contrato").escape(),e.sanitizeBody("skills").escape(),e.checkBody("titulo","Agrega un nombre a la vacante").notEmpty(),e.checkBody("empresa","Agrega una empresa").notEmpty(),e.checkBody("ubicacion","Agrega una ubicacion").notEmpty(),e.checkBody("contrato","Seleccion un tipo de contrato").notEmpty(),e.checkBody("skills","Seleccion al menos una habilidad").notEmpty();let t=e.validationErrors();if(!t)return r();e.flash("error",t.map(o=>o.msg)),a.render("nueva-vacante",{tituloPagina:"Nueva vacante",tagLine:"Publica tus vacantes rellenando el formulario",mensajes:e.flash()})},k=Ae;var Ce=(e,a,r)=>{e.sanitizeBody("nombre").escape(),e.sanitizeBody("email").escape(),e.body.password&&e.sanitizeBody("password").escape(),e.checkBody("nombre","El nombre no puede ir vacio"),e.checkBody("email","El email no puede ir vacio");let t=e.validationErrors();if(!t)return r();e.flash("error",t.map(o=>o.msg)),a.render("editar-perfil",{tituloPagina:"Edita tu perfil en DevJobs",usuario,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen,mensajes:e.flash()})},R=Ce;import Me from"passport";import I from"mongoose";import Fe from"crypto";var d={host:"smtp.mailtrap.io",port:2525,auth:{user:"ee04cbd260a961",pass:"05a72070612c87"}};import Le from"nodemailer";import ze from"nodemailer-express-handlebars";import Re from"util";import{fileURLToPath as je}from"url";import Ie,{dirname as $e}from"path";var De=$e(je(import.meta.url)),b=Le.createTransport({host:d.host,port:d.port,auth:{user:d.auth.user,pass:d.auth.pass}}),Te=Ie.join(De,"/../views/email");b.use("compile",ze({viewEngine:{defaultLayout:!1},viewPath:Te,extName:".handlebars"}));var _e=async e=>{let a={from:"plataformaDevJob@hotmail.com",to:e.usuario.email,subject:e.subject,template:e.archivo,context:{resetUrl:e.resetUrl}};return Re.promisify(b.sendMail,b).call(b,a)},j=_e;var Oe=I.model("Vacante"),V=I.model("Usuarios"),Ne=Me.authenticate("local",{successRedirect:"/administracion",failureRedirect:"/iniciar-sesion",failureFlash:!0,badRequestMessage:"Ambos campos son obligatorios"}),Je=(e,a,r)=>{if(e.isAuthenticated())return r();a.redirect("/iniciar-sesion")},He=async(e,a)=>{let r=await Oe.find({autor:e.user._id}).lean();a.render("administracion",{tituloPagina:"Administracion",tagLine:"Crear y administra tus vacantes desde aqui",vacantes:r,cerrarSesion:!0,nombre:e.user.nombre,imagen:e.user.imagen})},Qe=(e,a,r)=>{e.logout(t=>t?r(t):(e.flash("correcto","Sesion Cerrada Correctamente"),a.redirect("/iniciar-sesion")))},Ge=(e,a,r)=>{a.render("reestablecer-password",{tituloPagina:"Reestablece tu password",tagLine:"Si ya tienes cuenta, y olvidastes tu contrase\xF1a, reestablecela"})},We=async(e,a,r)=>{let t=await V.findOne({email:e.body.email});if(!t)return e.flash("error","El email no existe"),a.redirect("/reestablecer-password");t.token=Fe.randomBytes(20).toString("hex"),t.expiracion=Date.now()+72e5,await t.save();let o=`http://${e.headers.host}/reestablecer-password/${t.token}`;await j({usuario:t,subject:"Reestablecimiento de contrase\xF1a",resetUrl:o,archivo:"reset-password"}),e.flash("correcto","Revisa tu email, para reestablecer la contrase\xF1a"),a.redirect("/iniciar-sesion")},Ze=async(e,a)=>{let{token:r}=e.params;await V.findOne({token:r,expiracion:{$gt:Date.now()}})||e.flash("error","El tiempo para reestablecer la contrase\xF1a, expir\xF3"),a.render("nueva-contrase\xF1a",{tituloPagina:"Reestablece tu nueva password",tagLine:"Escribe tu nueva contrase\xF1a,para cambiarla"})},Ke=async(e,a,r)=>{let{token:t}=e.params,{password:o,confirmarPassword:l}=e.body,n=await V.findOne({token:t,expiracion:{$gt:Date.now()}});n||e.flash("error","El tiempo para reestablecer la contrase\xF1a, expir\xF3"),n.password=o,n.token=void 0,n.expiracion=void 0,await n.save(),e.flash("correcto","La contrase\xF1a ha sido actualiada correctamente"),a.redirect("/iniciar-sesion")},i={autenticarUsuario:Ne,mostrarPanelAdministracion:He,usuarioAutenticado:Je,cerrarSesion:Qe,reestablecerPasswordForm:Ge,reestablecerPassword:We,verificarToken:Ze,cambiarPassword:Ke};var $=Ye.Router();$.get("/",C).get("/vacantes/nueva",i.usuarioAutenticado,c.formNuevaVacante).post("/vacantes/nueva",i.usuarioAutenticado,k,c.agregarVacante).get("/vacantes/:url",c.findVacanteUrl).get("/vacantes/editar/:url",i.usuarioAutenticado,c.formEditarVacante).post("/vacantes/editar/:url",i.usuarioAutenticado,k,c.actualizarVacante).delete("/vacantes/eliminar/:id",c.eliminarVacante).get("/crear-cuenta",m.formCrearUsuario).post("/crear-cuenta",z,m.crearCuentaUsuario).get("/iniciar-sesion",m.formIniciarSesion).post("/iniciar-sesion",i.autenticarUsuario).get("/cerrar-sesion",i.usuarioAutenticado,i.cerrarSesion).get("/reestablecer-password",i.reestablecerPasswordForm).post("/reestablecer-password",i.reestablecerPassword).get("/reestablecer-password/:token",i.verificarToken).post("/reestablecer-password/:token",i.cambiarPassword).get("/administracion",i.usuarioAutenticado,i.mostrarPanelAdministracion).get("/editar-perfil",i.usuarioAutenticado,m.formEditarPerfil).post("/editar-perfil",i.usuarioAutenticado,R,m.subirImagen,m.editarPerfil).post("/vacantes/:url",c.subirCurriculum,c.contactar).get("/candidatos/:id",i.usuarioAutenticado,c.mostrarCandidatos).post("/buscador",c.buscarVacantesInput);var D=$;import ta from"handlebars";import oa from"express-handlebars";import{allowInsecurePrototypeAccess as sa}from"@handlebars/allow-prototype-access";import{config as ia}from"dotenv";import na from"cookie-parser";import ca from"express-session";var T={seleccionarSkills:(e=[],a)=>{let r=["HTML5","CSS","Apollo","Node","React JS","CSSGRID","FlexBox","JavaScript","React Hooks","Redux","GraphQL","TypeScript","Django","ORM","Sass","Laravel","Sequelize","Mongoose","SQL","MVC","PHP","Phyton","VueJs","Angular","WordPress"],t="";return r.forEach(o=>{t+=`<li ${e.includes(o)?'class="activo"':""}>${o}</li>`}),a.fn=t},tipoContrato:(e,a)=>a.fn(void 0).replace(new RegExp(`value="${e}"`),'$& selected="selected"'),mostrarAlertas:(e={},a)=>{let r=Object.keys(e),t="";return r.length&&e[r].forEach(o=>{t+=`<div class="${r} alerta"> ${o}</div>`}),a.fn=t}};import{fileURLToPath as la}from"url";import y,{dirname as ua}from"path";import ma from"express-validator";import da from"connect-flash";import v from"passport";import{Strategy as Xe}from"passport-local";import qe from"mongoose";var _=qe.model("Usuarios");v.use(new Xe({usernameField:"email",passwordField:"password"},async(e,a,r)=>{let t=await _.findOne({email:e});return t?t.compararPassword(a)?r(null,t):r(null,!1,{message:"El password es incorrecto"}):r(null,!1,{message:"El usuario no existe"})}));v.serializeUser((e,a)=>a(null,e._id));v.deserializeUser(async(e,a)=>{let r=await _.findById(e);return a(null,r)});var U=v;import pa from"http-errors";var fa=new ra({mongoUrl:process.env.DATABASE,mongooseConnection:aa.connection});ia({path:"variables.env"});var h=ua(la(import.meta.url)),s=p();s.use(p.json());s.use(p.urlencoded({extended:!0}));s.use(ma());var ga=y.join(h,"/source/views/layouts"),ba=y.join(h,"/source/views"),va=oa.create({defaulLayout:"main",layoutsDir:ga,helpers:T,handlebars:sa(ta)});s.engine("handlebars",va.engine);s.set("view engine","handlebars");s.set("views",ba);var ya=y.join(h,"/source/public"),ha=y.join(h,"/source/views/styles");s.use(p.static(ya));s.use(p.static(ha));s.use(na());s.use(ca({secret:process.env.SECRETO,key:process.env.KEY,resave:!1,saveUninitialized:!1,store:fa}));s.use(U.initialize());s.use(U.session());s.use(da());s.use((e,a,r)=>{a.locals.mensajes=e.flash(),r()});s.use("/",D);s.use((e,a,r)=>{r(pa(404,"Pagina no encontrada"))});s.use((e,a,r,t)=>{r.locals.mensaje=e.message;let o=e.status||500;r.locals.status=o,r.status(o),r.render("errores")});var wa="0.0.0.0",Pa=process.env.PORT,Hr=process.env.PORT||800;s.listen(Pa,wa,()=>{console.info(ea.blue("El servidor se ha iniciado correctamente"))});
