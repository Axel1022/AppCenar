const modelCliente = require("../../models/modelCliente/cliente");
const modelDirecciones = require("../../models/modelCliente/direccion");
const modelComercio = require("../../models/modelComercios/comercio");
const modelPedidos = require("../../models/modelCliente/pedido");
const modelProductos = require("../../models/modelComercios/producto");
const modelPedidoProducto = require("../../models/modelPedidoProducto/pedidoProducto");
const modelFavoritos = require("../../models/modelCliente/favoritos");
const verificUseer = require("../../utils/verificUserLog");

exports.getHome = async (req, res, next) => {
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
exports.getDirecciones = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en direcciones, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!

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
  verificUseer(req, res, next);
  res.render("viewsCliente/viewDireccionesAdd", {
    pageTitle: "Food Rush | Direcciones ",
    layout: "layoutCliente",
  });
};
exports.postDireccionesAdd = (req, res, next) => {
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
  try {
    const idCliente = verificUseer(req, res, next);
    const resultPedidos = await modelPedidos.findAll({
      where: { clientId: idCliente },
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
      //? Ya esto es monte y culebra, xd
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getEditPerfil = async (req, res, next) => {
  const idCliente = verificUseer(req, res, next);

  const cliente = await modelCliente.findOne({ where: { id: idCliente } });
  res.render("viewsCliente/viewEditPerfil", {
    pageTitle: "Food Rush | perfil",
    layout: "layoutCliente",
    Cliente: cliente.dataValues,
  });
};
exports.postEditPerfil = (req, res, next) => {
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
