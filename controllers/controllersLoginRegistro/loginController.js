const Cliente = require("/models/modelCliente/cliente")
const Comercio = require("/models/modelComercios/comercio");
const Delivery = require("/models/modelDelivery/delivery");
const Admin = require("/models/modelAdmin/administrador");
const { Result } = require("tedious/lib/token/helpers");

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

exports.GetSingUp = (req, res, next) => {
  res.render("viewsLoginRegistro/viewRegistro",{
    pageTitle: "App Cenar | Registrate",
    singUpActive: true
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

exports.PostSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if(password != confirmPassword){
       req.flash(
          "errors",
          "Password and confirm password no equals"
        );
        return res.redirect("/signup");
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        req.flash(
          "errors",
          "email exits already, please pick a different one "
        );
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({name: name, email: email, password: hashedPassword })
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


