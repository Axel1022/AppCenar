const Cliente = require("/models/modelCliente/cliente");
const Comercio = require("/models/modelComercios/comercio");
const Delivery = require("/models/modelDelivery/delivery");
const Admin = require("/models/modelAdmin/administrador");

exports.getSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/viewRegistro", {
    pageTitle: "App Cenar | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive:  true
  });
};

exports.PostClienteSingUp = (req, res, next) =>{
  const name = req.body.name;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const email = req.body.email;
  const imageProfile = req.body.imageProfile;
  const user = req.body.user;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const role = req.body.role;


  if(password != confirmPassword){
    req.flash("errors", "Passwords do not match");
    return res.redirect("/viewsLoginRegistro/viewRegistro");
  }

  Cliente.findOne({where: {email: email}})
  .then((cliente) => {
    if(cliente){
      req.flash("errors", "This email already exist, please select other");
    }
    res.redirect("/viewsLoginRegistro/viewRegistro");

    bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      Cliente.create({
        name: name, 
        lastName: lastName,
        phone: phone,
        email: email, 
        imageProfile: imageProfile,
        user: user,
        password: hashedPassword,
        role: role
      })
        .then((user) => {
          res.redirect("/login");
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