const path = require("path");

module.exports = {
  database: "AppCenar",
  username: null, // Correo
  password: null, //Contraseña
  params: {
    dialect: "sqlite",
    storage: path.join(__dirname, "../database", "AppCenar-db.sqlite"),
    define: {
      underscored: true,
    },
    logging: false,
  },
};
