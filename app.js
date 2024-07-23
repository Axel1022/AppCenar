const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const puerto = 8080;
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const conecctiondb = require("./contexts/appContext");

//* Configuración del motor de vistas
app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    //Ya quite el main por dejeto
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//* --------------------------- Rutas ---------------------------
const errorController = require("./controllers/404Controller");
const loginController = require("./routers/routersLoginRegistro/routerLogin");
const registrarController = require("./routers/routersLoginRegistro/routerRegistrar");
const homeController = require("./routers/routersAdmin/routerHomeAdmin");
const clienteController = require("./routers/routersCliente/routerCliente");



//* --------------------------- Rutas de los roles ---------------------------
const Cliente = require("./models/modelCliente/cliente");
const Delivery = require("./models/modelDelivery/delivery");
const Admin = require("./models/modelAdmin/administrador");
const Comercio = require("./models/modelComercios/comercio");



//? --------------------------- Homepages ---------------------------
app.use(loginController);
app.use(registrarController);
app.use(homeController);
app.use(clienteController);
app.use(errorController.get404);


//* --------------------------- Config de multer ---------------------------
app.use("/images", express.static(path.join(__dirname, "images")));
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "iamges");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
})

app.use(multer({storage: imageStorage}).single("image"));


// --------------------------- Config de la session ---------------------------
// app.use(session({secret: "appCenar4", resave: true, saveUnitialized: false}));

app.use(flash());

app.use((req, res, next) => {
  if(!req.session){
    return next();
  }
  if(!req.session.user){
    return next();
  }

  Cliente.findByPk(req.session.cliente.id)
  .then((user) => {
    req.user = user;
    next();
  })
  .catch((err) => {
    console.log(err);
  });
});


conecctiondb
  .sync({ force: true })
  .then((items) => {
    app.listen(puerto);
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
