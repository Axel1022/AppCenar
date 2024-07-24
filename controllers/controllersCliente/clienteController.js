exports.getHome = async (req, res, next) => {
  res.render("viewsCliente/home", {
    pageTitle: "Food Rush | Cliente",
    layout: "layoutCliente",
  });
};
exports.getDirecciones = (req, res, next) => {
  res.render("viewsCliente/viewDirecciones", {
    pageTitle: "Food Rush | Direcciones",
    layout: "layoutCliente",
  });
};
exports.getFavoritos = (req, res, next) => {
  res.render("viewsCliente/viewFavoritos", {
    pageTitle: "Food Rush | Favoritos",
    layout: "layoutCliente",
  });
};
exports.getPerfil = (req, res, next) => {
  res.render("viewsCliente/viewPerfil", {
    pageTitle: "Food Rush | Perfil",
    layout: "layoutCliente",
  });
};
exports.getPedidos = (req, res, next) => {
  res.render("viewsCliente/viewPedidos", {
    pageTitle: "Food Rush | Pedidos",
    layout: "layoutCliente",
  });
};
