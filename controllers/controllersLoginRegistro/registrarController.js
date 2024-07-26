const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");
const bcrypt = require("bcryptjs");
const transporter = require("../../services/EmailServices");
const { v4: uuid4 } = require("uuid");

//registro para el cliente y delivery
exports.getClienteSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroCliente", {
    //Tambien para delivery
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true,
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

  if (password != confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroCliente");
  }

  Cliente.findOne({ where: { user: user } }).then((cliente) => {
    if (cliente) {
      req.flash("errors", "This user already exist, please select other one");
      return res.redirect("/registroCliente");
    }
  });

  if (role === "cliente") {
    Cliente.findOne({ where: { email: email } })
      .then((cliente) => {
        if (cliente) {
          req.flash(
            "errors",
            "This email already exist, please select other one"
          );
          console.log("This email already exist, please select other one");
          return res.redirect("/registroCliente");
        }

        const tokenCliente = uuid4();
        console.log("token:", tokenCliente);

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
              role: role,
              token: tokenCliente,
            })
              .then((user) => {
                console.log("Registro correcto");

                const mailOptionCliente = {
                  from: "Food Rush Company <no-reply@foodrushya.com>",
                  to: email,
                  subject: "Bienvenido a Food Rush - Activación de Cuenta",
                  html: `
                  <p>Estimado/a ${name} ${lastName},</p>
                  <p>Nos complace darle la bienvenida a <strong>Food Rush</strong>. Su registro ha sido exitoso, y estamos emocionados de que se una a nuestra comunidad.</p>
                  <p>Para activar su cuenta y comenzar a disfrutar de nuestros servicios, le solicitamos que haga clic en el siguiente enlace:</p>
                  <p>
                      <a href="${req.protocol}://${req.get(
                    "host"
                  )}/activate/${tokenCliente}">Activar mi cuenta</a>
                  </p>
                  <p>Una vez activada su cuenta, podrá explorar una amplia variedad de opciones gastronómicas y realizar pedidos de manera rápida y sencilla.</p>

                  <p>Si tiene alguna pregunta o requiere asistencia adicional, no dude en comunicarse con nuestro equipo de atención al cliente. Estamos aquí para ayudarle.</p>
                  <p>Atentamente,<br>El equipo de Food Rush</p>`,
                };
                transporter.sendMail(mailOptionCliente, (err, info) => {
                  if (err) {
                    console.error("Error al enviar el correo:", err);
                  } else {
                    console.log("Correo enviado exitosamente:", info.response);
                  }
                });

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
  } else if (role === "delivery") {
    Delivery.findOne({ where: { user: user } })
      .then((deliveryUser) => {
        if (deliveryUser) {
          req.flash(
            "errors",
            "This user already exists, please select another one"
          );
          return res.redirect("/registroCliente");
        }

        return Delivery.findOne({ where: { email: email } });
      })
      .then((deliveryEmail) => {
        if (deliveryEmail) {
          req.flash(
            "errors",
            "This email already exists, please select another one"
          );
          console.log("This email already exists, please select another one");
          return res.redirect("/registroCliente");
        }

        const tokenDelivery = uuid4();
        console.log("token:", tokenDelivery);

        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        return Delivery.create({
          name: name,
          lastName: lastName,
          phone: phone,
          email: email,
          imageProfile: "/" + imageProfile.path,
          user: user,
          password: hashedPassword,
          role: role,
          token: tokenDelivery,
        });
      })
      .then((user) => {
        console.log("Registro correcto");

        const mailOptionDelivery = {
          from: "Food Rush Company <no-reply@foodrushya.com>",
          to: email,
          subject: "Bienvenido a Food Rush - Activación de Cuenta de Delivery",
          html: `
                    <p>Estimado/a ${name} ${lastName},</p>
                    <p>Le damos la bienvenida a <strong>Food Rush</strong>. Su registro como repartidor ha sido exitoso, y estamos emocionados de tenerlo en nuestro equipo.</p>
                    <p>Para activar su cuenta y comenzar a realizar entregas, por favor haga clic en el siguiente enlace:</p>
                    <p>
                        <a href="${req.protocol}://${req.get(
            "host"
          )}/activate/${tokenDelivery}">Activar mi cuenta</a>
                    </p>
                    <p>Una vez activada, podrá aceptar pedidos y ofrecer un servicio de entrega eficiente y profesional a nuestros clientes, contribuyendo a su satisfacción y fidelización.</p>
                    <p>Le recomendamos revisar nuestras pautas y recursos para repartidores, que le ayudarán a maximizar su rendimiento y asegurar una experiencia excepcional para nuestros clientes.</p>
                    <p>Si tiene alguna duda o necesita asistencia, no dude en contactarnos. Estamos aquí para ayudarle en su nueva aventura con Food Rush.</p>
                    <p>Atentamente,<br>El equipo de Food Rush</p>
                `,
        };

        transporter.sendMail(mailOptionDelivery, (err, info) => {
          if (err) {
            console.error("Error al enviar el correo:", err);
          } else {
            console.log("Correo enviado exitosamente:", info.response);
          }
        });

        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        req.flash("errors", "Something went wrong, please try again later");
        res.redirect("/registroCliente");
      });
  }
};

//registro para el comercio
exports.getComercioSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroComercio", {
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true,
  });
};

exports.PostComercioSingUp = (req, res, next) => {
  const tokenComercio = uuid4();
  console.log("token:", tokenComercio);

  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const role = req.body.role;
  const logo = req.file;
  const openTime = req.body.openTime;
  const closeTime = req.body.closeTime;
  const typeTrade = req.body.typeTrade;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log(req.body);

  console.log(password, confirmPassword);
  if (password != confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroComercio");
  }

  Comercio.findOne({ where: { email: email } })
    .then((comercio) => {
      if (comercio) {
        req.flash(
          "errors",
          "This email already exist, please select other one"
        );
        console.log("This email already exist, please select other one");
        return res.redirect("/registroCliente");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          Comercio.create({
            name: name,
            phone: phone,
            email: email,
            role: role,
            logo: "/" + logo.path,
            openTime: openTime,
            closeTime: closeTime,
            typeTrade: typeTrade,
            password: hashedPassword,
            token: tokenComercio,
          })
            .then((user) => {
              console.log("Registro correcto");

              const mailOptionComercio = {
                from: "Food Rush Company <no-reply@foodrushya.com>",
                to: email,
                subject: "Bienvenido a Food Rush - Activación de Comercio",
                html: `
                    <p>Estimado/a ${name},</p>
                    <p>Es un placer darle la bienvenida a <strong>Food Rush</strong>. Su registro como comercio ha sido exitoso, y estamos entusiasmados de contar con usted en nuestra plataforma.</p>
                    <p>Para activar su cuenta y comenzar a ofrecer sus productos a nuestros clientes, por favor haga clic en el siguiente enlace:</p>
                    <p>
                        <a href="${req.protocol}://${req.get(
                  "host"
                )}/activate/${tokenComercio}">Activar mi cuenta</a>
                    </p>
                    <p>Una vez activada, podrá gestionar su menú, recibir pedidos y aumentar su visibilidad en nuestra plataforma, lo que le permitirá llegar a más clientes potenciales.</p>

                    <p>Si tiene preguntas o requiere asistencia, no dude en ponerse en contacto con nuestro equipo de soporte. Estamos aquí para apoyarle en cada paso del camino.</p>
                    <p>Atentamente,<br>El equipo de Food Rush</p>
                `,
              };

              transporter.sendMail(mailOptionComercio, (err, info) => {
                if (err) {
                  console.error("Error al enviar el correo:", err);
                } else {
                  console.log("Correo enviado exitosamente:", info.response);
                }
              });

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

//registro para el administrador
exports.getAdminSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroAdmin", {
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true,
  });
};

exports.PostAdminSingUp = (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const identification = req.body.identification;
  const email = req.body.email;
  const role = req.body.role;
  const user = req.body.user;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password != confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroAdmin");
  }

  Admin.findOne({ where: { user: user } }).then((cliente) => {
    if (cliente) {
      req.flash("errors", "This user already exist, please select other one");
      return res.redirect("/registroCliente");
    }
  });

  Admin.findOne({ where: { email: email } })
    .then((comercio) => {
      if (comercio) {
        req.flash(
          "errors",
          "This email already exist, please select other one"
        );
        console.log("This email already exist, please select other one");
        return res.redirect("/registroAdmin");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          Admin.create({
            name: name,
            lastName: lastName,
            identification: identification,
            email: email,
            role: role,
            user: user,
            password: hashedPassword,
          })
            .then((user) => {
              console.log("Registro correcto");
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
