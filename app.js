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
const setLayout = require("./midelwares/setLayout");

// Configuración del motor de vistas
app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    //Ya quite el main por dejeto
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// --------------------------- Config de multer ---------------------------
app.use("/images", express.static(path.join(__dirname, "images")));
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

app.use(multer({ storage: imageStorage }).single("image"));

// --------------------------- Config de la session ---------------------------
app.use(session({ secret: "appCenar4", resave: true, saveUnitialized: false }));

app.use(flash());

app.use((req, res, next) => {
  if (!req.session || !req.session.user) {
    return next();
  }
  const user = req.session.user;

  let model;
  switch (user.role) {
    case "Cliente":
      model = Cliente;
      break;

    case "Delivery":
      model = Delivery;
      break;

    case "Comercio":
      model = Comercio;
      break;

    case "Administrador":
      model = Admin;
      break;

    default:
      return next();
  }
  model
    .findByPk(user.id)
    .then((foundUser) => {
      req.user = foundUser;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  const errors = req.flash("errors");
  const success = req.flash("success");
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.errorMessages = errors;
  res.locals.hasErrorMessages = errors.length > 0;
  res.locals.successMessages = success;
  res.locals.hasSuccessMessages = success.length > 0;
  next();
});

app.use(setLayout);

//* --------------------------- Rutas ---------------------------
const errorController = require("./controllers/404Controller");
const loginController = require("./routers/routersLoginRegistro/routerLogin");
const registrarController = require("./routers/routersLoginRegistro/routerRegistrar");
const homeController = require("./routers/routersAdmin/routerHomeAdmin");
const clienteController = require("./routers/routersCliente/routerCliente");
const comerciosController = require("./routers/routersComercios/routerComercios");
const deliveryController = require("./routers/routersDelivery/routerDelivery");
const categoriaController = require("./routers/routersComercios/routerCategoria");

//* --------------------------- Rutas de los roles y asociaciones ---------------------------
const Cliente = require("./models/modelCliente/cliente");
const Direccion = require("./models/modelCliente/direccion");
const Favorito = require("./models/modelCliente/favoritos");
const Pedido = require("./models/modelCliente/pedido");
const Comercio = require("./models/modelComercios/comercio");
const Producto = require("./models/modelComercios/producto");
const Categoria = require("./models/modelComercios/categoria");
const Admin = require("./models/modelAdmin/administrador");

Cliente.hasMany(Direccion, { foreignKey: "clientId" });
Direccion.belongsTo(Cliente, { foreignKey: "clientId" });

Cliente.hasMany(Favorito, { foreignKey: "clientId" });
Favorito.belongsTo(Cliente, { foreignKey: "clientId" });

Comercio.hasMany(Favorito, { foreignKey: "tradeId" });
Favorito.belongsTo(Comercio, { foreignKey: "tradeId" });

Cliente.hasMany(Pedido, { foreignKey: "clientId" });
Pedido.belongsTo(Cliente, { foreignKey: "clientId" });

Direccion.hasMany(Pedido, { foreignKey: "directionId" });
Pedido.belongsTo(Direccion, { foreignKey: "directionId" });

Comercio.hasMany(Pedido, { foreignKey: "tradeId" });
Pedido.belongsTo(Comercio, { foreignKey: "tradeId" });

Comercio.hasMany(Producto, { foreignKey: "tradeId" });
Producto.belongsTo(Comercio, { foreignKey: "tradeId" });

Comercio.hasMany(Categoria, { foreignKey: "tradeId" });
Categoria.belongsTo(Comercio, { foreignKey: "tradeId" });

Producto.belongsTo(Categoria, {foreignKey: "categoryId", as: "categoria"});

Categoria.hasMany(Producto, {foreignKey: "categoryId", as: "producto"});

//? --------------------------- Homepages ---------------------------
app.use(loginController);
app.use(registrarController);
app.use(homeController);
app.use(clienteController);
app.use(comerciosController);
app.use(deliveryController);
app.use(categoriaController);
app.use(errorController.get404);

conecctiondb
  .sync()
  .then((items) => {
    app.listen(puerto);
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
