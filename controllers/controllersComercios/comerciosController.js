const Comercios = require("../../models/modelComercios/comercio");
const Pedidos = require("../../models/modelComercios/comercio");
const Productos = require("../../models/modelComercios/producto");

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
  });
};

exports.getViewSalud = async (req, res, next) => {
  res.render("viewsComercios/viewSalud", {
    pageTitle: "Food Rush | Salud",
    //layout: "layoutCliente",
  });
};

exports.getViewTiendas = async (req, res, next) => {
  res.render("viewsComercios/viewTiendas", {
    pageTitle: "Food Rush | Tiendas",
    // layout: "layoutCliente",
  });
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

exports.getPerfil = async (req, res, next) =>{

  const comercioId = req.session.user.id;

  const comercio = await Comercios.findOne({ where: { id: comercioId} });
  console.log(comercio.dataValues);

  res.render("viewsComercios/viewPerfilComercio", {
    pageTitle: "Food Rush | Perfil",
    // layout: "layoutCliente",
    comercio: comercio.dataValues,
  });
};

exports.getEditPerfil = async (req, res, next) =>{

  const comercioId = req.session.user.id;

  const comercio = await Comercios.findOne({ where: { id: comercioId} });
  console.log(comercio.dataValues);

  res.render("viewsComercios/viewEditPerfil", {
    pageTitle: "Food Rush | Perfil",
    // layout: "layoutCliente",
    comercio: comercio.dataValues,
  });
};

exports.PostEditPerfil = (req, res, next) =>{
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const role = req.body.role;
  const logo = req.file;
  const openTime = req.body.openTime;
  const closeTime = req.body.closeTime;
  const typeTrade = req.body.typeTrade;
  const comercioId = req.session.user.id;

   Comercios
    .update({
       name, phone, email, role, logo, openTime, closeTime, typeTrade, },
      { where: { id: comercioId } }
    )
    .then(() => {
      return res.redirect("/comercios/perfil");
    })
    .catch((error) => {
      console.log(error);
    });
}