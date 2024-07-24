exports.getViewBebidas = async (req, res, next) => {
  res.render("viewsComercios/viewBebidas", {
    pageTitle: "Food Rush | Bebidas",
    layout: "layoutCliente",
  });
};
exports.getViewMercados = async (req, res, next) => {
  res.render("viewsComercios/viewMercados", {
    pageTitle: "Food Rush | Mercados",
    layout: "layoutCliente",
  });
};
exports.getViewPostres_Cafe = async (req, res, next) => {
  res.render("viewsComercios/viewPostres_Cafe", {
    pageTitle: "Food Rush | Postres y Café",
    layout: "layoutCliente",
  });
};
exports.getViewRestaurantes = async (req, res, next) => {
  res.render("viewsComercios/viewRestaurantes", {
    pageTitle: "Food Rush | Restaurantes",
    layout: "layoutCliente",
  });
};
exports.getViewSalud = async (req, res, next) => {
  res.render("viewsComercios/viewSalud", {
    pageTitle: "Food Rush | Salud",
    layout: "layoutCliente",
  });
};
exports.getViewTiendas = async (req, res, next) => {
  res.render("viewsComercios/viewTiendas", {
    pageTitle: "Food Rush | Tiendas",
    layout: "layoutCliente",
  });
};
