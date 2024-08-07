const modelCliente = require("../../models/modelCliente/cliente");
const modelDirecciones = require("../../models/modelCliente/direccion");
const modelComercio = require("../../models/modelComercios/comercio");
const modelPedidos = require("../../models/modelCliente/pedido");
const modelProductos = require("../../models/modelComercios/producto");
const modelPedidoProducto = require("../../models/modelPedidoProducto/pedidoProducto");
const modelFavoritos = require("../../models/modelCliente/favoritos");
const Itbis = require("../../models/modelAdmin/itebis");
const temProductos = require("../../models/modelCliente/pedidoTemporal");
const verificUseer = require("../../utils/verificUserLog");
const calcularTotal = require("../../utils/calcularTotal");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

exports.getHome = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  try {
    verificUseer(req, res, next);
    res.render("viewsCliente/home", {
      pageTitle: "Food Rush | Cliente",
      layout: "layoutCliente",
      //layout: "layoutCliente",
    });
  } catch (error) {
    console.log("El problema está en GETHOME >>> ", error);
  }
};

exports.confirmarPedido = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    const idCliente = verificUseer(req, res, next);
    const idDireccion = req.body.radioDire;
    const idComercio = req.body.comercioID;

    const temProducts = await temProductos.findAll();
    await modelCliente.update(
      { cantidad: Sequelize.literal(`cantidad + ${1}`) },
      { where: { id: idCliente } }
    );
    await modelComercio.update(
      { cantidad: Sequelize.literal(`cantidad + ${1}`) },
      { where: { id: idComercio } }
    );
    // await Pedidos.update(
    //   { deliverId: deliveryId, status: "En Proceso" },
    //   { where: { id: pedidoId } }
    // );

    const productData = await Promise.all(
      temProducts.map(async (element) => {
        const producto = await modelProductos.findByPk(element.id);

        if (!producto) {
          throw new Error(`Producto con ID ${element.id} no encontrado.`);
        }

        // console.log("Producto recuperado:", producto);
        // console.log("Precios:", producto.price);

        return {
          id: producto.id,
          quantity: element.quantity || 1, // Asumiendo que quantity es un campo en temProductos
          price: producto.price,
        };
      })
    );

    const itemItbis = await Itbis.findOne({ where: { id: 1 } });

    const total = calcularTotal(productData, itemItbis.itbis);

    console.log("sub total:", total.subTotal);
    console.log("total:", total.total);

    const now = new Date();
    now.setDate(now.getDate() - 1);
    const formattedDate = now.toISOString().split("T")[0];
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const newPedido = await modelPedidos.create({
      clientId: idCliente,
      directionId: idDireccion,
      tradeId: idComercio,
      subTotal: total.subTotal,
      date: formattedDate,
      hour: formattedTime,
      total: total.total,
      status: "Pendiente",
    });

    const idPedido = newPedido.dataValues.id;
    const totalProducts = productData.length;

    // Agregar los productos al pedido
    await Promise.all(
      temProducts.map(async (element) => {
        await modelPedidoProducto.create({
          pedidoId: idPedido,
          productId: element.productId,
          producto_id: element.productId,
          quantity: totalProducts,
        });
      })
    );
    await temProductos.destroy({
      where: {},
    });

    // console.log("Pedido creado correctamente");

    // Redirigir al usuario
    res.redirect("/cliente/home");
  } catch (error) {
    console.log("El problema está en confirmarPedido >>> ", error);
    next(error);
  }
};

exports.getCompletarPedido = async (req, res, next) => {
  
  try {
    const idCliente = verificUseer(req, res, next);
    const idComercio = req.params.idComercio;
    const itemsProduct = await temProductos.findAll();
    const productosFind = itemsProduct.map((producto) => producto.dataValues);
    const itemsDirecciones = await modelDirecciones.findAll({
      where: { clientId: idCliente },
    });
    const direccionesFind = itemsDirecciones.map(
      (direccion) => direccion.dataValues
    );

    const itemsComercio = await modelComercio.findOne({
      where: { id: idComercio },
    });

    const itemItbis = await Itbis.findOne({ where: { id: 1 } });

    const total = calcularTotal(productosFind, itemItbis.itbis);

    res.render("viewsCliente/viewCompletarPedido", {
      pageTitle: "Food Rush | Cliente",
      layout: "layoutCliente",
      Orden: productosFind,
      Direcciones: direccionesFind,
      has: productosFind.length > 0,
      Comercio: itemsComercio.dataValues,
      hasDire: direccionesFind.length > 0,
      test: total.subTotal,
      Itbis: itemItbis.itbis * 100,
      testTotal: total.total,
    });
  } catch (error) {
    console.log("El problema está en getCompletarPedido >>> ", error);
  }
};
exports.getDirecciones = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en direcciones, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  try {
    const idCliente = verificUseer(req, res, next);
    // console.log(idCliente);

    const result = await modelDirecciones.findAll({
      where: { clientId: idCliente },
    });
    const direcciones = result.map((result) => result.dataValues);
    console.log(direcciones.length > 0);

    res.render("viewsCliente/viewDirecciones", {
      pageTitle: "Food Rush | Direcciones",
      //layout: "layoutCliente",
      Direcciones: direcciones,
      hasDireccions: direcciones.length > 0,
    });
  } catch (error) {
    console.log("El problema está en GETDIRECCIONES >>> ", error);
  }
};
exports.getDireccionesAdd = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  verificUseer(req, res, next);
  res.render("viewsCliente/viewDireccionesAdd", {
    pageTitle: "Food Rush | Direcciones ",
    layout: "layoutCliente",
  });
};
exports.postDireccionesAdd = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const lugar = req.body.lugar;
  const direccion = req.body.direccion;
  const idCliente = verificUseer(req, res, next);
  console.log("El id del cliente", idCliente);

  modelDirecciones
    .create({ clientId: idCliente, identifier: lugar, direction: direccion })
    .then(() => {
      return res.redirect("/cliente/direcciones");
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.getFavoritos = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const idCliente = verificUseer(req, res, next);
  const items = await modelFavoritos.findAll({
    where: { clientId: idCliente },
  });
  const favoritos = items.map((result) => result.dataValues);
  const comercios = await Promise.all(
    favoritos.map(async (favorito) => {
      const comercio = await modelComercio.findOne({
        where: { id: favorito.tradeId },
      });
      return { ...comercio.dataValues, idfavorito: favorito.id };
    })
  );

  res.render("viewsCliente/viewFavoritos", {
    pageTitle: "Food Rush | Favoritos",
    // layout: "layoutCliente",
    Comercios: comercios,
    has: comercios.length > 0,
  });
};
exports.DeleteFavoritosPost = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  verificUseer(req, res, next);
  const idFavorito = req.body.id;
  modelFavoritos
    .findOne({ where: { id: idFavorito } })
    .then((favorito) => {
      if (favorito) {
        return favorito.destroy();
      } else {
        console.log("Favorito no encontrado");
        res.redirect("/cliente/favoritos");
      }
    })
    .then(() => {
      console.log("Favorito eliminado");
      res.redirect("/cliente/favoritos");
    })
    .catch((err) => {
      console.error("Error al eliminar el favorito: ", err);
      res.redirect("/cliente/favoritos");
    });
};
exports.getPerfil = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en el perfil, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  const idCliente = verificUseer(req, res, next);

  const cliente = await modelCliente.findOne({ where: { id: idCliente } });
  console.log(cliente.dataValues);

  res.render("viewsCliente/viewPerfil", {
    pageTitle: "Food Rush | Perfil",
    // layout: "layoutCliente",
    Cliente: cliente.dataValues,
  });
};

exports.getPedidos = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    const idCliente = verificUseer(req, res, next);
    const resultPedidos = await modelPedidos.findAll({
      where: { clientId: idCliente },
      order: [
        ["date", "DESC"],
        ["hour", "DESC"],
      ],
    });

    if (resultPedidos.length === 0) {
      return res.render("viewsCliente/viewPedidos", {
        pageTitle: "Food Rush | Pedidos",
        layout: "layoutCliente",
        Pedidos: [],
        Cantidad: 0,
        hasPedidos: false,
      });
    }

    const pedidos = await Promise.all(
      resultPedidos.map(async (pedido) => {
        const comercio = await modelComercio.findOne({
          where: { id: pedido.tradeId },
        });

        const productosPedido = await modelPedidoProducto.findAll({
          where: { pedidoId: pedido.id },
        });

        const productos = await Promise.all(
          productosPedido.map(async (productoPedido) => {
            const producto = await modelProductos.findOne({
              where: { id: productoPedido.productId },
            });
            return producto.dataValues;
          })
        );

        return {
          ...pedido.dataValues,
          comercio: comercio ? comercio.logo : null,
          productos: productos,
          cantidadProductos: productos.length,
        };
      })
    );

    res.render("viewsCliente/viewPedidos", {
      pageTitle: "Food Rush | Pedidos",
      layout: "layoutCliente",
      Pedidos: pedidos,
      hasPedidos: pedidos.length > 0,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getDetallePedidos = async (req, res, next) => {
  //****************************** Bueno, laálogica ******************************\\
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const pedidoId = req.params.id;
  const idCliente = verificUseer(req, res, next);

  try {
    const resultPedido = await modelPedidos.findOne({
      where: { clientId: idCliente, id: pedidoId },
    });
    //? Aqui primero se busca el pedido que tenga el id del cliente y y tambien coinscida con el id del pedido
    //(DOBLE SEGURIDD)

    const resultComercio = await modelComercio.findOne({
      where: { id: resultPedido.dataValues.tradeId },
    });
    //? Con el id del comercio del pedido que se encontró...

    const productosPedido = await modelPedidoProducto.findAll({
      where: { pedidoId: resultPedido.dataValues.id },
    });
    //? Estoy accediendo a la tabla mucho a mucho (PedidoProducto) aqui busco los id que que tengan el pedidoId...

    let productos = []; //Esto va a guardar los productos, es facil de entender, xd
    for (const producto of productosPedido) {
      const pedido = await modelProductos.findOne({
        where: { id: producto.dataValues.productId },
      });
      productos.push(pedido.dataValues);
      //*Ok
      //? Por cada id_product que esté guardado en productosPedido, buscamos el producto en su tabla, xd
      //? y lo apregamos a productos
    }

    res.render("viewsCliente/viewDetallePedido", {
      pageTitle: "Food Rush | Detalle",
      Pedido: resultPedido.dataValues,
      Productos: productos,
      Comercio: resultComercio.dataValues,
      // test: total.total,
      //? Ya esto es monte y culebra, xd
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getEditPerfil = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const idCliente = verificUseer(req, res, next);

  const cliente = await modelCliente.findOne({ where: { id: idCliente } });
  res.render("viewsCliente/viewEditPerfil", {
    pageTitle: "Food Rush | perfil",
    layout: "layoutCliente",
    Cliente: cliente.dataValues,
  });
};
exports.postEditPerfil = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const name = req.body.name;
  const lastName = req.body.lastName;
  const phone = req.body.telefono;
  const imageProfile = req.file;
  const idCliente = verificUseer(req, res, next);

  modelCliente
    .update(
      { name, lastName, phone, imageProfile },
      { where: { id: idCliente } }
    )
    .then(() => {
      return res.redirect("/cliente/perfil");
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.postEliminarDirrecion = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const idElemt = req.body.elemetnId;
  const idCliente = verificUseer(req, res, next);

  modelDirecciones
    .findOne({ where: { id: idElemt, clientId: idCliente } })
    .then((result) => {
      if (result) {
        return result.destroy();
      } else {
        console.log("Direccion no encontrada");
        res.redirect("/cliente/direcciones");
      }
    })
    .then(() => {
      console.log("Direccion eliminada");
      res.redirect("/cliente/direcciones");
    })
    .catch((err) => {
      console.error("Error al eliminar la Direccion: ", err);
      res.redirect("/cliente/direcciones");
    });
};
exports.getEditarDirrecion = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const elemetnID = req.params.elemetnId;
  modelDirecciones
    .findOne({ where: { id: elemetnID } })
    .then((result) => {
      if (result) {
        res.render("viewsCliente/viewDireccionesEdit", {
          pageTitle: `Food Rush | Direcciones`,
          Direccion: result.dataValues,
        });
      } else {
        console.log("No se ha encontrado la categoria");
        res.redirect("/cliente/direcciones");
      }
    })
    .catch((err) => {
      console.error("Error en EditDireccion: ", err);
      res.redirect("/cliente/direcciones");
    });
};
exports.postEditarDirrecion = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const lugar = req.body.lugar;
  const direccion = req.body.direccion;
  const idCliente = verificUseer(req, res, next);
  const direId = req.body.elemetnId;
  console.log("Direccion :", direccion);
  console.log("Lugar :", lugar);
  console.log("idCliente :", idCliente);
  console.log("direId :", direId);

  console.log("El id del cliente", idCliente);

  modelDirecciones
    .update(
      { identifier: lugar, direction: direccion },
      { where: { id: idCliente, id: direId } }
    )
    .then(() => {
      console.log("Direccion editad correctamente");
      res.redirect("/cliente/direcciones");
    });
};
exports.postBuscarComercio = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const buscar = req.body.buscar;
  verificUseer(req, res, next);
  if (buscar === "" || buscar === undefined || buscar === null) {
    return res.redirect("back");
  } else {
    const items = await modelComercio.findAll({
      where: {
        name: {
          [Op.like]: `%${buscar}%`,
        },
      },
    });
    const comercios = items.map((item) => item.dataValues);
    res.render("viewsComercios/viewComerciosBuscados", {
      pageTitle: "Food Rush | Cliente",
      layout: "layoutCliente",
      Comercios: comercios,
      has: comercios.length > 0,
      Cantidad: comercios.length,
      //layout: "layoutCliente",
    });
  }
};
exports.addFavorito = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "cliente") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const idCliente = verificUseer(req, res, next);
  const idComercio = req.body.idComercio;

  modelFavoritos.create({
    clientId: idCliente,
    tradeId: idComercio,
  });
  return res.redirect("back");
};
