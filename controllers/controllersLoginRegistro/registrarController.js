const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");


exports.getSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroCliente", { //Tambien para delivery
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive:  true
  });
};

exports.PostClienteSingUp = (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const email = req.body.email;
  const imageProfile = req.file;
  const user = req.body.user;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const role = req.body.role;


  if(password != confirmPassword){
    req.flash("errors", "Passwords do not match");
    return res.redirect("/viewsLoginRegistro/registroCliente");
  }

  Cliente.findOne({where: {email: email}})
  .then((cliente) => {
    if(cliente){
      req.flash("errors", "This email already exist, please select other");
    }
    res.redirect("/viewsLoginRegistro/registroCliente");

    bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      Cliente.create({
        name: name,
        lastName: lastName,
        phone: phone,
        email: email,
        imageProfile: "/" + imageProfile.path,
        user: user,
        password: hashedPassword,
        role: role
      })
        .then((user) => {
          res.redirect("/viewLogin");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  })
  .catch((err) => {
    console.log(err);
  });

};
