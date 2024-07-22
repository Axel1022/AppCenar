const categoriaModel = require("../../models/modelComercios/comercio");

exports.getHome = async (req, res, next) => {
  //TODO: Mostrar todos los comercios
  const comercios = await categoriaModel.findAll();
  res.render("viewsCliente/home", {
    pageTitle: "App Cenar | Cliente",
    layout: "layoutCliente",
    Comercios: comercios.dataValues,
    HasComercios: comercios.length > 0,
  });
};
exports.getDirecciones = (req, res, next) => {
  res.render("viewsCliente/viewDirecciones", {
    pageTitle: "App Cenar | Direcciones",
    layout: "layoutCliente",
  });
};
exports.getFavoritos = (req, res, next) => {
  res.render("viewsCliente/viewFavoritos", {
    pageTitle: "App Cenar | Favoritos",
    layout: "layoutCliente",
  });
};
exports.getPerfil = (req, res, next) => {
  res.render("viewsCliente/viewPerfil", {
    pageTitle: "App Cenar | Perfil",
    layout: "layoutCliente",
  });
};
exports.getPedidos = (req, res, next) => {
  res.render("viewsCliente/viewPedidos", {
    pageTitle: "App Cenar | Pedidos",
    layout: "layoutCliente",
  });
};
