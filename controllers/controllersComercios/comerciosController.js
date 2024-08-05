const Comercios = require("../../models/modelComercios/comercio");
const Pedidos = require("../../models/modelComercios/comercio");
const Productos = require("../../models/modelComercios/producto");
const temProductos = require("../../models/modelCliente/pedidoTemporal");
const verificUseer = require("../../utils/verificUserLog");
const jsonFileHandler = require("../../utils/jsonFileHandler");
const path = require("path");
const dataPath = path.join(
  path.dirname(require.main.filename),
  "database",
  "volatil.json"
);

exports.getHome = async (req, res, next) => {
  res.render("viewsComercios/home", {
    pageTitle: "Food Rush | Bebidas",
    //layout: "layoutCliente",
  });
};

exports.getViewBebidas = async (req, res, next) => {
  const items = await Comercios.findAll({
    where: { typeTrade: "Bars" },
  });
  const rsultRest = items.map((comercio) => comercio.dataValues);

  res.render("viewsComercios/viewBebidas", {
    pageTitle: "Food Rush | Bebidas",
    Bars: rsultRest,
    has: rsultRest.length > 0,
    Cantidad: rsultRest.length,
  });
};

exports.getViewMercados = async (req, res, next) => {
  const items = await Comercios.findAll({
    where: { typeTrade: "Mercados" },
  });
  const rsultRest = items.map((comercio) => comercio.dataValues);

  res.render("viewsComercios/viewMercados", {
    pageTitle: "Food Rush | Mercados",
    Mercados: rsultRest,
    has: rsultRest.length > 0,
    Cantidad: rsultRest.length,
  });
};

exports.getViewPostres_Cafe = async (req, res, next) => {
  const items = await Comercios.findAll({
    where: { typeTrade: "Cafeterias" },
  });
  const rsultRest = items.map((comercio) => comercio.dataValues);
  res.render("viewsComercios/viewPostres_Cafe", {
    pageTitle: "Food Rush | Postres y Café",
    has: rsultRest.length > 0,
    Cantidad: rsultRest.length,
    Cafeterias: rsultRest,
  });
};

exports.getViewRestaurantes = async (req, res, next) => {
  const rsultRest = await Comercios.findAll({
    where: { typeTrade: "Restaurantes" },
  });
  res.render("viewsComercios/viewRestaurantes", {
    pageTitle: "Food Rush | Restaurantes",
    // layout: "layoutCliente",
    Cantidad: rsultRest.length,
    Restaurantes: rsultRest,
    Cantidad: rsultRest.length,
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
  const items = await Comercios.findAll({
    where: { typeTrade: "Tiendas" },
  });
  const rsultRest = items.map((comercio) => comercio.dataValues);
  res.render("viewsComercios/viewTiendas", {
    pageTitle: "Food Rush | Tiendas",
    has: rsultRest.length > 0,
    Tiendas: rsultRest,
    Cantidad: rsultRest.length,
  });
};

exports.AddProductPost = async (req, res, next) => {
  verificUseer(req, res, next);
  const idProducto = req.body.idProducto;
  const idComercio = req.body.idComercio;
  const producto = await Productos.findOne({ where: { id: idProducto } });

  if (producto) {
    const productoExistente = await temProductos.findOne({
      where: { id: idProducto },
    });

    if (!productoExistente) {
      await temProductos.create({
        id: producto.dataValues.id,
        name: producto.dataValues.name,
        image: producto.dataValues.image,
        description: producto.dataValues.description,
        price: producto.dataValues.price,
        tradeId: producto.dataValues.tradeId,
        categoryId: producto.dataValues.categoryId,
      });
      console.log("Producto agregado exitosamente a temProductos");
    } else {
      console.log("El producto ya existe en temProductos");
    }
  } else {
    console.log("Error al encontrar el producto en Productos.");
  }
  res.redirect(`/comercios/pedido/realizar/${idComercio}`);
};

exports.deleteProductPost = async (req, res, next) => {
  verificUseer(req, res, next);
  const idProducto = req.body.idProducto;
  const idComercio = req.body.idComercio;
  console.log("Id del producto: " + idProducto);
  console.log("Id del comercio: " + idComercio);
  await temProductos
    .findOne({ where: { id: idProducto } })
    .then((producto) => {
      if (producto) {
        return producto.destroy();
      } else {
        console.log("Producto no encontrado");
        return;
      }
    })
    .catch((err) => {
      console.error("Error al eliminar el producto: ", err);
      return;
    });
  res.redirect(`/comercios/pedido/realizar/${idComercio}`);
};

exports.getViewListProductsAndConfirmar = async (req, res, next) => {
  try {
    verificUseer(req, res, next);
    const comercioID = req.params.id;
    const items = await Productos.findAll({ where: { tradeId: comercioID } });
    const comercio = await Comercios.findOne({ where: { id: comercioID } });

    if (!comercio) {
      console.error("No se encontró el comercio con id: ", comercioID);
      return res.status(404).send("Comercio no encontrado");
    }

    const rsultRest = items.map((producto) => producto.dataValues);
    const itemsProduct = await temProductos.findAll();
    const productosFind = itemsProduct.map((producto) => producto.dataValues);

    res.render("viewsComercios/viewListProductosAndConfirmar", {
      pageTitle: "Food Rush | Realizar pedido",
      has: rsultRest.length > 0,
      Comercio: comercio.dataValues,
      Productos: rsultRest,
      Orden: productosFind,
      hasOrden: productosFind.length > 0,
    });
  } catch (error) {
    console.error("Error en getViewListProductsAndConfirmar: ", error);
    next(error);
  }
};

exports.getIdProductos = async (req, res, next) => {
  try {
    verificUseer(req, res, next);
    const comercioID = req.params.id;
  } catch (error) {
    console.error("Error en getViewListProductsAndConfirmar: ", error);
    next(error);
  }
};

exports.getComercios = async (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
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