const modelCliente = require("../../models/modelCliente/cliente");
const modelDirecciones = require("../../models/modelCliente/direccion");
exports.getHome = async (req, res, next) => {
  res.render("viewsCliente/home", {
    pageTitle: "Food Rush | Cliente",
    layout: "layoutCliente",
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
  // console.log(direcciones);

  res.render("viewsCliente/viewDirecciones", {
    pageTitle: "Food Rush | Direcciones",
    layout: "layoutCliente",
    Direcciones: direcciones,
    hasDireccions: direcciones.length > 0,
  });
};
exports.getFavoritos = (req, res, next) => {
  res.render("viewsCliente/viewFavoritos", {
    pageTitle: "Food Rush | Favoritos",
    layout: "layoutCliente",
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
    layout: "layoutCliente",
    Cliente: cliente.dataValues,
  });
};
exports.getPedidos = (req, res, next) => {
  res.render("viewsCliente/viewPedidos", {
    pageTitle: "Food Rush | Pedidos",
    layout: "layoutCliente",
  });
};
exports.getEditPerfil = (req, res, next) => {
  res.render("viewsCliente/viewEditPerfil", {
    pageTitle: "Food Rush | perfil",
    layout: "layoutCliente",
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
