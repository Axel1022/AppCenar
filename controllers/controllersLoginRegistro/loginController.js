const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");

exports.getLogin = (req, res, next) => {
  res.render("viewsLoginRegisto/viewLogin", {
    pageTitle: "Food Rush | Iniciar Session",
    layout: "layoutRegistroLogin",
    loginCSS: true,
    loginActive: true
  });
};

exports.PostLogin = (req, res, next) =>{
  const email = rqq.body.email;
  const password = req.body.password;

  Promise.all([
    Cliente.findOne({where: {email: email}}),
    Delivery.findOne({where: {email: email}}),
    Comercio.findOne({where: {email: email}}),
    Admin.findOne({where: {email: email}})
  ])
  .then(([cliente, delivery, comercio, admin]) =>{
    let user = cliente || delivery || comercio || admin;

    if(!user) {
      req.flash("errors", "Email is invalid");
      return res.redirect();
    }

    const role = user.role;

    bcrypt.compare(password, user.password)
    .then(result => {
      if(result){
        req.session.isLoggedIn = true;
        req.session.user = user;

        switch(role){
          case "Cliente":
           return res.redirect("/viewsCliente/home"); //ruta al home del cliente

          case "Delivery":
            return res.redirect("/viewsDelivery/home"); //ruta al home del delivery

          case "Comercio":
           return res.redirect("/viewsComercios/home"); //ruta al home del comercio

          case "Administrador":
            return res.redirect("/viewsAdmin/home"); //ruta al home del administrador

          default:
          req.flash("errors", "You need create an account");
          return res.redirect("/viewsLoginRegistro/viewLogin"); //ruta al mismo login

        }
      }
      else{
        req.flash("errors", "Password is invalid");
        return res.redirect("/viewsLoginRegistro/viewLogin"); //ruta al mismo login
      }
    });
  })
  .catch(err => {
    console.log(err);
    return res.redirect("/viewsLoginRegistro/viewLogin"); //ruta al mismo login;
  })
};

exports.LogOut = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/viewsLoginRegistro/viewLogin");
  });
};





