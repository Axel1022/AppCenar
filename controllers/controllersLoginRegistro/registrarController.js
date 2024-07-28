const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");
const bcrypt = require("bcryptjs");
const transporter = require("../../services/EmailServices");
const { v4: uuid4 } = require("uuid");

// Registro para el cliente y delivery
exports.getClienteSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroCliente", {
    // También para delivery
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true,
  });
};

exports.PostClienteSingUp = async (req, res, next) => {
  const {
    name,
    lastName,
    phone,
    email,
    user,
    password,
    confirmPassword,
    role,
  } = req.body;
  const imageProfile = req.file;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroCliente");
  }

  try {
    let existingUser;

    if (role === "cliente") {
      existingUser = await Cliente.findOne({ where: { user } });
      if (existingUser) {
        req.flash(
          "errors",
          "This user already exists, please select another one"
        );
        return res.redirect("/registroCliente");
      }

      existingUser = await Cliente.findOne({ where: { email } });
      if (existingUser) {
        req.flash(
          "errors",
          "This email already exists, please select another one"
        );
        console.log("This email already exists, please select another one");
        return res.redirect("/registroCliente");
      }

      const tokenCliente = uuid4();
      console.log("token:", tokenCliente);

      const hashedPassword = await bcrypt.hash(password, 12);

      await Cliente.create({
        name,
        lastName,
        phone,
        email,
        imageProfile: "/" + imageProfile.path,
        user,
        password: hashedPassword,
        role,
        token: tokenCliente,
      });

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

      return res.redirect("/login");
    } else if (role === "delivery") {
      existingUser = await Delivery.findOne({ where: { user } });
      if (existingUser) {
        req.flash(
          "errors",
          "This user already exists, please select another one"
        );
        return res.redirect("/registroCliente");
      }

      existingUser = await Delivery.findOne({ where: { email } });
      if (existingUser) {
        req.flash(
          "errors",
          "This email already exists, please select another one"
        );
        console.log("This email already exists, please select another one");
        return res.redirect("/registroCliente");
      }

      const tokenDelivery = uuid4();
      console.log("token:", tokenDelivery);

      const hashedPassword = await bcrypt.hash(password, 12);

      await Delivery.create({
        name,
        lastName,
        phone,
        email,
        imageProfile: "/" + imageProfile.path,
        user,
        password: hashedPassword,
        role,
        token: tokenDelivery,
      });

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

      return res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    req.flash("errors", "Something went wrong, please try again later");
    return res.redirect("/registroCliente");
  }
};

// Registro para el comercio
exports.getComercioSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroComercio", {
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true,
  });
};

exports.PostComercioSingUp = async (req, res, next) => {
  const tokenComercio = uuid4();
  console.log("token:", tokenComercio);

  const {
    name,
    phone,
    email,
    role,
    openTime,
    closeTime,
    typeTrade,
    password,
    confirmPassword,
  } = req.body;
  const logo = req.file;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroComercio");
  }

  try {
    const existingComercio = await Comercio.findOne({ where: { email } });
    if (existingComercio) {
      req.flash(
        "errors",
        "This email already exists, please select another one"
      );
      console.log("This email already exists, please select another one");
      return res.redirect("/registroComercio");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Comercio.create({
      name,
      phone,
      email,
      role,
      logo: "/" + logo.path,
      openTime,
      closeTime,
      typeTrade,
      password: hashedPassword,
      token: tokenComercio,
    });

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

    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("errors", "Something went wrong, please try again later");
    return res.redirect("/registroComercio");
  }
};

// Registro para el administrador
exports.getAdminSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroAdmin", {
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true,
  });
};

exports.PostAdminSingUp = async (req, res, next) => {
  const {
    name,
    lastName,
    identification,
    email,
    role,
    user,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroAdmin");
  }

  try {
    const existingUser = await Admin.findOne({ where: { user } });
    if (existingUser) {
      req.flash(
        "errors",
        "This user already exists, please select another one"
      );
      return res.redirect("/registroAdmin");
    }

    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      req.flash(
        "errors",
        "This email already exists, please select another one"
      );
      console.log("This email already exists, please select another one");
      return res.redirect("/registroAdmin");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      name,
      lastName,
      identification,
      email,
      role,
      user,
      password: hashedPassword,
    });

    console.log("Registro correcto");
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("errors", "Something went wrong, please try again later");
    return res.redirect("/registroAdmin");
  }
};
