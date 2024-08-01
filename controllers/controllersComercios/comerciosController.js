const Comercios = require("../../models/modelComercios/comercio");
const Pedidos = require("../../models/modelComercios/comercio");
const Productos = require("../../models/modelComercios/producto");
const verificUseer = require("../../utils/verificUserLog");

exports.getHome = async (req, res, next) => {
  res.render("viewsComercios/home", {
    pageTitle: "Food Rush | Bebidas",
    //layout: "layoutCliente",
  });
};

exports.getViewBebidas = async (req, res, next) => {
  res.render("viewsComercios/viewBebidas", {
    pageTitle: "Food Rush | Bebidas",
    //layout: "layoutCliente",
  });
};

exports.getViewMercados = async (req, res, next) => {
  res.render("viewsComercios/viewMercados", {
    pageTitle: "Food Rush | Mercados",
    //layout: "layoutCliente",
  });
};

exports.getViewPostres_Cafe = async (req, res, next) => {
  res.render("viewsComercios/viewPostres_Cafe", {
    pageTitle: "Food Rush | Postres y Café",
    // layout: "layoutCliente",
  });
};

exports.getViewRestaurantes = async (req, res, next) => {
  const rsultRest = await Comercios.findAll({
    where: { typeTrade: "Restaurante" },
  });
  res.render("viewsComercios/viewRestaurantes", {
    pageTitle: "Food Rush | Restaurantes",
    // layout: "layoutCliente",
    Cantidad: rsultRest.length,
    Restaurantes: rsultRest,
    has: rsultRest.length > 0,
  });
};

exports.getViewSalud = async (req, res, next) => {
  const items = await Comercios.findAll({
    where: { typeTrade: "Salud" },
  });
  rsultRest = items.map((comercio) => comercio.dataValues);

  // console.log("Resultado de la busqueda: ", rsultRest);
  res.render("viewsComercios/viewSalud", {
    pageTitle: "Food Rush | Salud",
    //layout: "layoutCliente",
    Farmacias: rsultRest,
    Cantidad: rsultRest.length,
    has: rsultRest.length > 0,
  });
};

exports.getViewTiendas = async (req, res, next) => {
  res.render("viewsComercios/viewTiendas", {
    pageTitle: "Food Rush | Tiendas",
    // layout: "layoutCliente",
  });
};

exports.getViewListProductsAndConfirmar = async (req, res, next) => {
  try {
    verificUseer(req, res, next);
    const comercioID = req.params.id;
    console.log("El id del comercio recibido: ", comercioID);

    const items = await Productos.findAll({ where: { tradeId: comercioID } });
    const comercio = await Comercios.findOne({ where: { id: comercioID } });

    if (!comercio) {
      console.error("No se encontró el comercio con id: ", comercioID);
      return res.status(404).send("Comercio no encontrado");
    }

    const rsultRest = items.map((producto) => producto.dataValues);

    res.render("viewsComercios/viewListProductosAndConfirmar", {
      pageTitle: "Food Rush | Realizar pedido",
      Productos: rsultRest,
      has: rsultRest.length > 0,
      Comercio: comercio.dataValues,
    });
  } catch (error) {
    console.error("Error en getViewListProductsAndConfirmar: ", error);
    next(error);
  }
};

exports.getComercios = async (req, res, next) => {
  const comercioId = req.session.user.id;
  const usuario = req.session.user.role;

  if (usuario !== "comercio") {
    req.flash("errors", "You dont have access to this area");
    return res.redirect("/login");
  }

  try {
    const comercio = await Comercios.findByPk(comercioId);

    if (!comercio) {
      req.flash("errors", "Comercio no encontrado");
      return res.redirect("/comercios/home");
    }

    const pedidos = await Pedidos.findAll({
      where: { comercioId: comercioId },
      include: [
        {
          model: Productos,
          as: "producto",
          attributes: ["name", "price", "quantity"],
        },
      ],
    });

    const estado = pedidos.some((pedido) => pedido.status === "pendiente");

    res.render("viewsComercios/viewCategoria", {
      pageTitle: "Food Rush | Comercios",
      comercios: comercio,
      pedidos: pedidos,
      hasPedido: pedidos.length > 0,
      estado: estado,
    });
  } catch (error) {
    console.error(error);
    req.flash("errors", "Error al obtener los datos del comercio");
    res.redirect("/comercios/home");
  }
};

function calcularTotal(products) {
  let subTotal = 0;
  let totalQuantity = 0;

  products.forEach((product) => {
    subTotal += product.quantity * product.price;
    totalQuantity += product.quantity;
  });

  const itbis = subTotal * 0.18;
  const total = subTotal + itbis;

  return {
    subTotal: roundToDecimals(subTotal, 2),
    total: roundToDecimals(total, 2),
    totalQuantity,
  };
}
