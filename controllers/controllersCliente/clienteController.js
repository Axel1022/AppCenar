const modelCliente = require("../../models/modelCliente/cliente");
const modelDirecciones = require("../../models/modelCliente/direccion");
exports.getHome = async (req, res, next) => {
  res.render("viewsCliente/home", {
    pageTitle: "Food Rush | Cliente",
    layout: "layoutCliente",
    //layout: "layoutCliente",
  });
};
exports.getDirecciones = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en direcciones, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!

  const idCliente = req.session.user.id;
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
};
exports.getDireccionesAdd = (req, res, next) => {
  res.render("viewsCliente/viewDireccionesAdd", {
    pageTitle: "Food Rush | Direcciones ",
    layout: "layoutCliente",
  });
};
exports.postDireccionesAdd = (req, res, next) => {
  const lugar = req.body.lugar;
  const direccion = req.body.direccion;
  const idCliente = req.session.user.id;
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
exports.getFavoritos = (req, res, next) => {
  res.render("viewsCliente/viewFavoritos", {
    pageTitle: "Food Rush | Favoritos",
    // layout: "layoutCliente",
  });
};
exports.getPerfil = async (req, res, next) => {
  //TODO: Necesito saber el id del usuario que llego al home, esto para poder obtener los datos que voy a colocar en el perfil, etc...
  //! Esto esta funcionando porque estoy accediendo al user con id 1, de debe cambiar!!

  const idCliente = req.session.user.id;

  const cliente = await modelCliente.findOne({ where: { id: idCliente } });
  console.log(cliente.dataValues);

  res.render("viewsCliente/viewPerfil", {
    pageTitle: "Food Rush | Perfil",
    // layout: "layoutCliente",
    Cliente: cliente.dataValues,
  });
};
exports.getPedidos = (req, res, next) => {
  res.render("viewsCliente/viewPedidos", {
    pageTitle: "Food Rush | Pedidos",
    //layout: "layoutCliente",
  });
};
exports.getEditPerfil = async (req, res, next) => {
  const idCliente = req.session.user.id;

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
  const idCliente = req.session.user.id;

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
  const idCliente = req.session.user.id;

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
  const idCliente = req.session.user.id;
  const direId = req.body.elemetnId;
  console.log("Direccion :" , direccion);
  console.log("Lugar :" , lugar);
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
