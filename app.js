const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const puerto = 8080;
const app = express();

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
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//* --------------------------- Rutas ---------------------------
const errorController = require("./controllers/404Controller");
const loginController = require("./routers/routersLoginRegistro/routerLogin");
const registrarController = require("./routers/routersLoginRegistro/routerRegistrar");
const homeController = require("./routers/routersAdmin/routerHomeAdmin");
const clienteController = require("./routers/routersCliente/routerCliente");

//? --------------------------- Homepages ---------------------------
app.use(loginController);
app.use(registrarController);
app.use(homeController);
app.use(clienteController);
app.use(errorController.get404);





app.listen(puerto);
