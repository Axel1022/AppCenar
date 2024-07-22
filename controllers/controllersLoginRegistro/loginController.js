const Cliente = require("/models/modelCliente/cliente")
const Comercio = require("/models/modelComercios/comercio");
const Delivery = require("/models/modelDelivery/delivery");
const Admin = require("/models/modelAdmin/administrador");

exports.getLogin = (req, res, next) => {
  res.render("viewsLoginRegisto/viewLogin", {
    pageTitle: "App Cenar | Iniciar Session",
    layout: "layoutRegistroLogin",
    loginCSS: true,
    loginActive: true
  });
};


exports.PostLogin = (req, res, next) =>{
  const email = rqq.body.email;
  const password = req.body.password;

  Promise.all([
    Cliente.findOne({where: {email: email}})
  ])
}