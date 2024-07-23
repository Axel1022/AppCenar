const path = require("path");

module.exports = {
  database: "FoodRush",
  username: null, // Correo
  password: null, //Contraseña
  params: {
    dialect: "sqlite",
    storage: path.join(__dirname, "../database", "FoodRush-db.sqlite"),
    define: {
      underscored: true,
    },
    logging: false,
  },
};
