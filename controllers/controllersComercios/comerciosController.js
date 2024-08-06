const Comercios = require("../../models/modelComercios/comercio");
const Productos = require("../../models/modelComercios/producto");
const temProductos = require("../../models/modelCliente/pedidoTemporal");
const Pedidos = require("../../models/modelCliente/pedido");
const PedidosProducto = require("../../models/modelPedidoProducto/pedidoProducto")
const Delivery = require("../../models/modelDelivery/delivery");
const Itbis = require("../../models/modelAdmin/itbis");
const verificUseer = require("../../utils/verificUserLog");
const jsonFileHandler = require("../../utils/jsonFileHandler");
const path = require("path");
const Categoria = require("../../models/modelComercios/categoria");
const calcularTotal = require("../../utils/calcularTotal");
const dataPath = path.join(
  path.dirname(require.main.filename),
  "database",
  "volatil.json"
);

exports.getHome = async (req, res, next) => {
  const comercioId = req.session.user.id;
  const usuario= req.session.user.role;

  if(usuario !=="comercio"){
    req.flash("errors", "You dont have access to this area");
    return res.redirect("/login");
  }

  try {

    const comercio = await Comercios.findOne({
      where: {id: comercioId},
      include: [{model: Pedidos, as: "pedido"}]
    });

    if (!comercio) {
      throw new Error("Comercio no encontrado");
    }

    const pedidos = await Pedidos.findAll({
      where: {tradeId: comercioId},
      order: [["date", "DESC"], ["hour" , "DESC"]],
      include:[{model: PedidosProducto, as: "pedidoProductos",
        attributes: ["quantity", "productId"]
      }]
    })


    const pedidosData = pedidos.map(p => ({
      id: p.id,
      date: p.date,
      hour: p.hour,
      total: p.total,
      status: p.status,
      totalProductos: p.pedidoProductos.reduce((sum, pp) => sum + pp.quantity, 0) 
    }));
    
    console.log("Pedidos:" , pedidosData);
    console.log("Comercio", comercio

    )
    
    res.render("viewsComercios/home", {
      pageTitle: "Food Rush | Pedidos Realizados",
      comercio: comercio.dataValues,
      pedidos: pedidosData,
      hasPedidos: pedidosData.length > 0,
    });
    
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
      req.flash("errors", "Error al obtener las categorías.");
      res.redirect("/login");
  }

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
    where: { typeTrade: "mercado" },
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

    const itbisVal = await Itbis.findOne();
    const itbs = itbisVal ? itbisVal.itbis /100: 0.18;

    const total = calcularTotal(productosFind, itbs);

    res.render("viewsComercios/viewListProductosAndConfirmar", {
      pageTitle: "Food Rush | Realizar pedido",
      has: rsultRest.length > 0,
      Comercio: comercio.dataValues,
      Productos: rsultRest,
      Orden: productosFind,
      hasOrden: productosFind.length > 0,
      test: total.subTotal
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

exports.getDetails = async (req, res, next) => {
  const pedidoId = req.params.id;
  const comercioId = req.session.user.id;
  const usuario = req.session.user.role;

  if (usuario !== "comercio") {
    req.flash("errors", "You don't have access to this area");
    return res.redirect("/login");
  }

  try {
    const comercio = await Comercios.findOne({
      where: { id: comercioId }
    });

    if (!comercio) {
      throw new Error("Comercio no encontrado");
    }

    const pedido = await Pedidos.findOne({
      where: { id: pedidoId },
      include: [
        {
          model: Productos,
          as: 'producto',
          through: {
            attributes: ['quantity'] 
          }
        }
      ]
    });

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    const pedidoData = pedido.toJSON();
    const comercioData = comercio.toJSON();

    res.render("viewsComercios/viewDetail", {
      pageTitle: "Detalle del Pedido",
      comercio: comercioData,
      pedido: pedidoData
    });
  } catch (error) {
    console.error("Error al obtener los detalles del pedido:", error);
    req.flash("errors", "Error al obtener los detalles del pedido.");
    res.redirect("/login");
  }
};


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
  const categorias = await Categoria.findAll({where: {tradeId: comercioId}})

  console.log(comercio.dataValues);

  res.render("viewsComercios/viewEditPerfil", {
    pageTitle: "Food Rush | Perfil",
    // layout: "layoutCliente",
    comercio: comercio.dataValues,
    categorias: categorias.dataValues,
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
};

exports.GetAsignarDelivery = async (req, res, next) => {
 const pedidoId = req.params.id

  try{
    const pedido = await Pedidos.findByPk(pedidoId, {
      include:[{
        model: Productos, as: "producto",
        attributes: ["id", "name", "image","price"]
      }]
    });

    const deliveries = await Delivery.findAll({where: {status: "Desocupado"}});
    console.log("Deliveries disponibles", deliveries)

    const delivery = deliveries.map(d => d.toJSON());

    res.render("viewsComercios/viewAsign",{
      pageTitle: "Food Rush | Deliveries Disponibles",
      pedido: pedido,
      delivery: delivery,
      hasDelivery: delivery.length > 0,
    })
  }catch(error){
    console.log("Error al obtener los deliveries", error);
    return res.redirect("/comercios/home");
  }
  
};

exports.postAsignarDelivery = async (req, res, next) => {

  const deliveryId = req.body.deliveryId;
  const pedidoId = req.body.pedidoId;

  try {
    const delivery = Delivery.findByPk(deliveryId);

    if ( !delivery) {
      return res.status(404).send("Pedido o Delivery no encontrado");
    }

   await Pedidos.update({id: pedidoId, status: "En Proceso"},
    {where: {id: pedidoId}}
   );
   
   await Delivery.update({status: "Ocupado"},
    {where: {id: deliveryId}}
   );

    res.redirect("/comercios/home")
    req.flash("success", "Pedido asignado correctamente");
  } catch (error) {
    console.error("Error al asignar al delivery", error);
  }

}