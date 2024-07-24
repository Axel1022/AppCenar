const modelCliente = require("../../models/modelCliente/cliente");
const modelDirecciones = require("../../models/modelCliente/direccion");
exports.getHome = async (req, res, next) => {
  res.render("viewsCliente/home", {
    pageTitle: "Food Rush | Cliente",
    layout: "layoutCliente",

  });
};
exports.getDirecciones = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en direcciones, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!

  const direcciones = await modelDirecciones.findAll({
    where: { clientId: 1 },
  });

  res.render("viewsCliente/viewDirecciones", {
    pageTitle: "Food Rush | Direcciones",
    layout: "layoutCliente",
    Direcciones: direcciones,
    hasDireccions: direcciones.length > 0
  });
};
exports.getFavoritos = (req, res, next) => {
  res.render("viewsCliente/viewFavoritos", {
    pageTitle: "Food Rush | Favoritos",
    layout: "layoutCliente",
  });
};
exports.getPerfil = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en el perfil, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!

  const cliente = await modelCliente.findOne({ where: { id: 1 } });
  console.log(cliente.dataValues);

  res.render("viewsCliente/viewPerfil", {
    pageTitle: "Food Rush | Perfil",
    layout: "layoutCliente",
    Cliente: cliente.dataValues,
  });
};
exports.getPedidos = (req, res, next) => {
  res.render("viewsCliente/viewPedidos", {
    pageTitle: "Food Rush | Pedidos",
    layout: "layoutCliente",
  });
};
