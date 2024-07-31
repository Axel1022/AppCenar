// controllers/controllersDelivery/deliveryController.js

exports.getHome = async (req, res, next) => {
  res.render("viewsDelivery/home", {
    pageTitle: "Food Rush | Delivery",
    layout: "layoutDelivery",
  });
};

const Pedido = require('../../models/modelCliente/pedido');
const Comercio = require('../../models/modelComercios/comercio');
const Producto = require('../../models/modelComercios/producto');
const Delivery = require('../../models/modelDelivery/delivery');
const { Op } = require('sequelize');

// Obtener pedidos asignados al delivery logueado
exports.getDeliveryHome = async (req, res, next) => {
  try {
    const deliveryId = req.session.user.id;
    const pedidos = await Pedido.findAll({
      where: { deliveryId, status: { [Op.ne]: 'completado' } },
      include: [
        { model: Comercio, attributes: ['logo', 'name'] },
        { model: Producto }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('viewsDelivery/home', {
      pageTitle: 'Home del Delivery',
      layout: 'layoutDelivery',
      pedidos
    });
  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
};

// Obtener detalles del pedido
exports.getPedidoDetail = async (req, res, next) => {
  try {
    const deliveryId = req.session.user.id;
    const pedidoId = req.params.id;
    const pedido = await Pedido.findOne({
      where: { id: pedidoId, deliveryId },
      include: [
        { model: Comercio, attributes: ['name'] },
        { model: Producto }
      ]
    });

    if (!pedido) {
      return res.redirect('/delivery/home');
    }

    res.render('viewsDelivery/pedidoDetail', {
      pageTitle: `Detalle del Pedido ${pedido.id}`,
      layout: 'layoutDelivery',
      pedido
    });
  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
};

// Completar el pedido
exports.completePedido = async (req, res, next) => {
  try {
    const deliveryId = req.session.user.id;
    const pedidoId = req.params.id;
    await Pedido.update(
      { status: 'completado' },
      { where: { id: pedidoId, deliveryId } }
    );

    // Cambiar estado del delivery a disponible
    await Delivery.update(
      { status: 'disponible' },
      { where: { id: deliveryId } }
    );

    res.redirect('/delivery/home');
  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
};

// Obtener datos del delivery
exports.getDeliveryProfile = async (req, res, next) => {
  try {
    const deliveryId = req.session.user.id;
    const delivery = await Delivery.findByPk(deliveryId);

    res.render('viewsDelivery/perfil', {
      pageTitle: 'Mi Perfil',
      layout: 'layoutDelivery',
      Delivery: delivery.dataValues
    });
  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
};

// Actualizar datos del perfil del delivery
exports.postDeliveryProfile = async (req, res, next) => {
  try {
    const deliveryId = req.session.user.id;
    const { name, phone, email } = req.body;

    await Delivery.update(
      { name, phone, email },
      { where: { id: deliveryId } }
    );

    res.redirect('/delivery/perfil');
  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
};

// Obtener el perfil del delivery
exports.getEditPerfil = async (req, res, next) => {
  const idDelivery = req.session.user.id;

  const delivery = await Delivery.findOne({ where: { id: idDelivery } });
  res.render("viewsDelivery/editPerfil", {
    pageTitle: "Food Rush | perfil",
    layout: "layoutDelivery",
    Cliente: delivery.dataValues,
  });
};
exports.postEditPerfil = (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const phone = req.body.telefono;
  const imageProfile = req.file;
  const idDelivery = req.session.user.id;

  modelCliente
    .update(
      { name, lastName, phone, imageProfile },
      { where: { id: idDelivery } }
    )
    .then(() => {
      return res.redirect("/delivery/perfil");
    })
    .catch((error) => {
      console.log(error);
    });
};

