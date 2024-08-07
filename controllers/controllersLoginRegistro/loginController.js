const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");
const bcrypt = require("bcryptjs");
const { v4: uuid4 } = require("uuid");
const transporter = require("../../services/EmailServices");

exports.getLogin = (req, res, next) => {
  res.render("viewsLoginRegisto/viewLogin", {
    pageTitle: "Food Rush | Iniciar Session",
    layout: "layoutRegistroLogin",
    loginActive: true,
  });
};

exports.PostLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  Promise.all([
    Cliente.findOne({ where: { email: email } }),
    Delivery.findOne({ where: { email: email } }),
    Comercio.findOne({ where: { email: email } }),
    Admin.findOne({ where: { email: email } }),
  ])
    .then(([cliente, delivery, comercio, admin]) => {
      let user = cliente || delivery || comercio || admin;

      if (!user) {
        req.flash("errors", "Email is invalid");
        console.log("email invalido");
        return res.redirect("/Login");
      }

      const role = user.role;
      console.log(role);

      if (!user.active) {
        req.flash(
          "errors",
          "Your account is not activate. Please check your email for activate your account. "
        );
        return res.redirect("/login");
      }

      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          req.session.isLoggedIn = true;
          req.session.user = {
            id: user.id,
            role: role,
          };

          req.session.save((err) => {
            if (err) {
              console.log(err);
              res.redirect("/login");
            }

            switch (role) {
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
                console.log("La cuenta no existe");
                return res.redirect("/viewsLoginRegistro/viewLogin"); //ruta al mismo login
            }
          });
        } else {
          req.flash("errors", "Password is invalid");
          console.log("Password invalid");
          return res.redirect("/login"); //ruta al mismo login
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login"); //ruta al mismo login;
    });
};

exports.LogOut = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};

exports.getActivation = (req, res, next) => {
  const token = req.params.token;

  if (!token) {
    req.flash("errors", "No activation token provided");
    return res.redirect("/login");
  }

  console.log(token);

  Promise.all([
    Cliente.findOne({ where: { token: token } }),
    Delivery.findOne({ where: { token: token } }),
    Comercio.findOne({ where: { token: token } }),
  ])

    .then(([cliente, delivery, comercio, admin]) => {
      let user = cliente || delivery || comercio || admin;

      if (!user) {
        req.flash("errors", "Invalid activation token");
        console.log("No user found with the given activation token");
        return res.redirect("/login");
      }

      console.log("User before activation:", user);

      user.active = true;
      user.token = null;

      return user.save().then(() => {
        console.log("Cuenta activada");
        req.flash(
          "success",
          "Account activated succesfully, you can log in now"
        );
        return res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login");
    });
};

exports.searchPassword = async (req, res, next) => {
  if (req.method === "GET") {
    return res.render("viewsLoginRegisto/viewSearchPassword", {
      pageTitle: "Food Rush | Recuperar Contraseña",
    });
  } else if (req.method === "POST") {
    const email = req.body.email;
    console.log("el email obtenido", email);

    try {
      const [cliente, delivery, comercio, admin] = await Promise.all([
        Cliente.findOne({ where: { email: email } }),
        Delivery.findOne({ where: { email: email } }),
        Comercio.findOne({ where: { email: email } }),
        Admin.findOne({ where: { email: email } }),
      ]);

      let user = cliente || delivery || comercio || admin;

      const tokenUsuario = uuid4();

      if (user) {
        user.token = tokenUsuario;
        await user.save();
        console.log(
          "token guardado en la base de datos y enviado por la url:",
          tokenUsuario
        );
      }

      const mailOption = {
        from: "Food Rush Company <no-reply@foodrushya.com>",
        to: email,
        subject: "Bienvenido a Food Rush - Recuperar Contraseña",
        html: `
          <p>Estimado/a Usuario,</p>
          <p>Nos dirigimos a usted para confirmar si ha solicitado cambiar su contraseña en nuestra plataforma. Si ha solicitado el cambio de contraseña.</p>
          <p>Por favor haga clic en el siguiente enlace para proceder con el proceso de actualización de su contraseña:</p>
          <p>
            <a href="${req.protocol}://${req.get(
          "host"
        )}/recover-password/${tokenUsuario}">Recuperar Contraseña</a>
          </p>
          <p>En caso de que no haya solicitado el cambio de contraseña, por favor ignore este mensaje. Su cuenta permanece segura y no se realizarán cambios si no se sigue el enlace proporcionado.</p>

          <p>Si tiene alguna pregunta o requiere asistencia adicional, no dude en comunicarse con nuestro equipo de atención al cliente. Estamos aquí para ayudarle.</p>
          <p>Atentamente,<br>El equipo de Food Rush</p>
        `,
      };

      transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          console.error("Error al enviar el correo:", err);
        } else {
          console.log("Correo enviado exitosamente:", info.response);
          req.flash(
            "success",
            "Se le envió un correo para seguir los pasos para cambiar la contraseña"
          );
          return res.redirect("/Login");
        }
      });
    } catch (err) {
      console.log(err);
      req.flash("errors", "Ocurrió un error al procesar la solicitud");
      return res.redirect("/search-password");
    }
  }
};

exports.getRecoverPasswordPage = (req, res, next) => {
  const token = req.params.token;
  console.log("token enviado por la url", token);
  res.render("viewsLoginRegisto/viewRecover", {
    pageTitle: "Food Rush | Recuperar Contraseña",
    token: token,
  });
};

exports.recoverPassword = async (req, res, next) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log("Token obtenido del cuerpo", token);

  if (!token) {
    req.flash("errors", "No recuperation token provided");
    return res.redirect("/Login");
  }

  try {
    const [cliente, delivery, comercio, admin] = await Promise.all([
      Cliente.findOne({ where: { token: token } }),
      Delivery.findOne({ where: { token: token } }),
      Comercio.findOne({ where: { token: token } }),
      Admin.findOne({ where: { token: token } }),
    ]);

    let user = cliente || delivery || comercio || admin;

    if (!user) {
      req.flash("errors", "Invalid recuperation token");
      console.log("No user found with the given recuperation token");
      return res.redirect("/login");
    }

    if (password !== confirmPassword) {
      req.flash("errors", "Passwords do not match");
      console.log("Passwords do not match");
      return res.redirect("/search-password");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.token = null;

    await user.save();

    console.log("Contraseña cambiada");
    req.flash("success", "Password changed successfully, you can log in now");
    return res.redirect("/Login");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred while changing the password");
    return res.redirect("/Login");
  }
};
