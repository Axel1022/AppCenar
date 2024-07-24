const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("viewsLoginRegisto/viewLogin", {
    pageTitle: "Food Rush | Iniciar Session",
    layout: "layoutRegistroLogin",
    loginActive: true
  });
};

exports.PostLogin = (req, res, next) =>{
  const email = req.body.email;
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
      console.log("email invalido");
      return res.redirect("/lLogin");
    }

    const role = user.role;
    console.log(role);

    if(role != "administrador" && !user.active){
      req.flash("errors", "Your account is not activate. Please check your email for activate your account. ");
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password)
    .then(result => {
      if(result){
        req.session.isLoggedIn = true;
        req.session.user = {
          id: user.id,
          role: role
        };

        switch(role){
          case "cliente":
           return res.redirect("/cliente/home"); //ruta al home del cliente

          case "delivery":
            return res.redirect("/delivery/home"); //ruta al home del delivery

          case "comercio":
           return res.redirect("/comercios/home"); //ruta al home del comercio

          case "administrador":
            return res.redirect("/admin/home"); //ruta al home del administrador

          default:
          req.flash("errors", "You need create an account");
          console.log("La cuenta no existe")
          return res.redirect("/viewsLoginRegistro/viewLogin"); //ruta al mismo login

        }
      }
      else{
        req.flash("errors", "Password is invalid");
        console.log("Contrase;a incorrecta");
        return res.redirect("/login"); //ruta al mismo login
      }
    });
  })
  .catch(err => {
    console.log(err);
    return res.redirect("/login"); //ruta al mismo login;
  })
};

exports.LogOut = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};

exports.getActivation = (req, res, next) => {
  const token = req.params.token;

  if(!token){
    req.flash("errors", "No activation token provided");
    return res.redirect("/login");
  }

  console.log(token);

  Promise.all([
    Cliente.findOne({where: {token: token}}),
    Delivery.findOne({where: {token: token}}),
    Comercio.findOne({where: {token: token}}),
  ])

  .then(([cliente, delivery, comercio, admin]) => {
    let user = cliente || delivery || comercio || admin;

    if (!user) {
      req.flash("errors", "Invalid activation token");
      console.log("No user found with the given activation token")
      return res.redirect("/login");
    }

    console.log("User before activation:" , user);

    user.active = true;
    user.token = null;

    return user.save()
    .then(() => {
      console.log("Cuenta activada");
      req.flash("errors", "Account activated succesfully, you can log in now");
      return res.redirect("/login");
    });
  })
  .catch(err => {
    console.log(err);
    return res.redirect("/login");
  })
}



