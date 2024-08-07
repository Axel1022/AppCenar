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
const compare = require("./helpers/compare");
const statusClass = require("./helpers/status");

// Configuración del motor de vistas
app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    //Ya quite el main por dejeto
    extname: "hbs",
    helpers: {
      compare: compare,
      statusClass: statusClass,
    },
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
const productosController = require("./routers/routersComercios/routerProductos");

//* --------------------------- Rutas de los roles y asociaciones ---------------------------
const Cliente = require("./models/modelCliente/cliente");
const Direccion = require("./models/modelCliente/direccion");
const Favorito = require("./models/modelCliente/favoritos");
const Pedido = require("./models/modelCliente/pedido");
const Comercio = require("./models/modelComercios/comercio");
const Producto = require("./models/modelComercios/producto");
const Categoria = require("./models/modelComercios/categoria");
const Admin = require("./models/modelAdmin/administrador");
const Delivey = require("./models/modelDelivery/delivery");
const PedidoProducto = require("./models/modelPedidoProducto/pedidoProducto");
const Itbis = require("./models/modelAdmin/itebis");

Cliente.hasMany(Direccion, { foreignKey: "clientId", as: "direccion" });
Direccion.belongsTo(Cliente, { foreignKey: "clientId", as: "cliente" });

Cliente.hasMany(Favorito, { foreignKey: "clientId", as: "favorito" });
Favorito.belongsTo(Cliente, { foreignKey: "clientId", as: "cliente" });

Comercio.hasMany(Favorito, { foreignKey: "tradeId", as: "favorito" });
Favorito.belongsTo(Comercio, { foreignKey: "tradeId", as: "comercio" });

Cliente.hasMany(Pedido, { foreignKey: "clientId", as: "pedido" });
Pedido.belongsTo(Cliente, { foreignKey: "clientId", as: "cliente" });

Direccion.hasMany(Pedido, { foreignKey: "directionId", as: "pedido" });
Pedido.belongsTo(Direccion, { foreignKey: "directionId", as: "direccion" });

Comercio.hasMany(Pedido, { foreignKey: "tradeId", as: "pedido" });
Pedido.belongsTo(Comercio, { foreignKey: "tradeId", as: "comercio" });

Comercio.hasMany(Producto, { foreignKey: "tradeId", as: "producto" });
Producto.belongsTo(Comercio, { foreignKey: "tradeId", as: "comercio" });

Comercio.hasMany(Categoria, { foreignKey: "tradeId", as: "categoria" });
Categoria.belongsTo(Comercio, { foreignKey: "tradeId", as: "comercio" });

Producto.belongsTo(Categoria, { foreignKey: "categoryId", as: "categoria" });
Categoria.hasMany(Producto, { foreignKey: "categoryId", as: "producto" });

Itbis.belongsTo(Admin, { foreignKey: "adminId", as: "itbs" });

Pedido.belongsToMany(Producto, {
  through: PedidoProducto,
  foreignKey: "pedidoId",
  as: "producto",
});

Producto.belongsToMany(Pedido, {
  through: PedidoProducto,
  foreignKey: "productId",
  as: "pedido",
});

Pedido.hasMany(PedidoProducto, {
  foreignKey: "pedidoId",
  as: "pedidoProductos",
});

Producto.hasMany(PedidoProducto, {
  foreignKey: "productId",
  as: "pedidoProductos",
});

PedidoProducto.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "producto",
});

PedidoProducto.belongsTo(Pedido, { foreignKey: "pedidoId", as: "pedido" });

Pedido.belongsTo(Delivey, { foreingKey: "deliverId", as: "delivery" });
Delivey.hasMany(Pedido, { foreignKey: "deliverId", as: "pedido" });
//? --------------------------- Homepages ---------------------------
app.use(loginController);
app.use(registrarController);
app.use(homeController);
app.use(clienteController);
app.use(comerciosController);
app.use(deliveryController);
app.use(categoriaController);
app.use(productosController);
app.use(errorController.get404);

conecctiondb
  .sync()
  .then((items) => {
    app.listen(puerto);
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
