const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const conecctiondb = require("./contexts/appContext"); //Lo usaremos mas adelante
const multer = require("multer"); //Lo usaremos mas adelante
const { v4: uuidv4 } = require("uuid"); //Lo usaremos mas adelante
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

//* --------------------------- Rutas ---------------------------
//? --------------------------- Homepages ---------------------------


app.use(express.static(path.join(__dirname, "public")));
app.listen(puerto);
