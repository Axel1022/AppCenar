const Pedido = require('../../models/modelCliente/pedido');
const Comercio = require('../../models/modelComercios/comercio');
const Producto = require('../../models/modelComercios/producto');
const Delivery = require('../../models/modelDelivery/delivery');
const verificUser = require("../../utils/verificUserLog")
const { Op } = require('sequelize');


exports.getHome = async (req, res, next) => {
  const deliverId = req.session.user.id;

    try {
      const delivery = await Delivery.findByPk(deliverId);
  
      if (!delivery) {
        throw new Error("Delivery no encontrado");
      }
      console.log(delivery);

  
      const pedidos = await Pedido.findAll({
        where: { deliverId: deliverId, status: { [Op.ne]: 'En Proceso' } },
        include: [
          { model: Comercio, as: "comercio", attributes: ['logo', 'name'] },
          { model: Producto, as: "producto"}
        ],
        order: [['createdAt', 'DESC']]
      });

      const pedidosData = pedidos.map((p) => ({
        id: p.id,
        date: p.date,
        hour: p.hour,
        total: p.total,
        status: p.status,
        comercio: {
          name: p.comercio.name,
          logo: p.comercio.logo,
        },
        productos: p.productos.map((prod) => ({
          name: prod.name,
          image: prod.image,
          price: prod.price
        })),
      }));
  
      console.log("Pedidos:", pedidosData);  
      
      res.render("viewsDelivery/home", {
        pageTitle: "Food Rush | Delivery",
        layout: "layoutDelivery",
        delivery: delivery.dataValues,
        pedidos: pedidosData,
        hasPedidos: pedidosData.length > 0,
      });
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      req.flash("errors", "Error al obtener los pedidos.");
      res.redirect("/login");
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

  Delivery
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

