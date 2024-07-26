const Cliente = require("../../models/modelCliente/cliente");
const Comercio = require("../../models/modelComercios/comercio");
const Delivery = require("../../models/modelDelivery/delivery");
const Admin = require("../../models/modelAdmin/administrador");
const bcrypt = require("bcryptjs");
const transporter = require("../../services/EmailServices");
const { v4: uuid4 } = require("uuid");

// Registro para el cliente y delivery
exports.getClienteSingUp = (req, res, next) => {
  res.render("viewsLoginRegisto/registroCliente", { // También para delivery
    pageTitle: "Food Rush | Registrar",
    layout: "layoutRegistroLogin",
    singUpActive: true
  });
};

exports.PostClienteSingUp = async (req, res, next) => {
  const { name, lastName, phone, email, user, password, confirmPassword, role } = req.body;
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
        req.flash("errors", "This user already exists, please select another one");
        return res.redirect("/registroCliente");
      }

      existingUser = await Cliente.findOne({ where: { email } });
      if (existingUser) {
        req.flash("errors", "This email already exists, please select another one");
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
        token: tokenCliente
      });

      console.log("Registro correcto");

      const mailOption = {
        from: "foodrushya@gmail.com",
        to: email,
        subject: "Bienvenido a Food Rush",
        html: `<p>Estimado ${role}, ${name} ${lastName}, te registraste en <strong>Food Rush</strong></p>
               para activar tu cuenta y poder acceder a la app presiona click en el siguiente enlace:
               <a href="${req.protocol}://${req.get("host")}/activate/${tokenCliente}">Activar cuenta</a>`
      };

      transporter.sendMail(mailOption, (err, info) => {
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
        req.flash("errors", "This user already exists, please select another one");
        return res.redirect("/registroCliente");
      }

      existingUser = await Delivery.findOne({ where: { email } });
      if (existingUser) {
        req.flash("errors", "This email already exists, please select another one");
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
        token: tokenDelivery
      });

      console.log("Registro correcto");

      const mailOption = {
        from: "foodrushya@gmail.com",
        to: email,
        subject: "Bienvenido a Food Rush",
        html: `<p>Estimado ${role}, ${name} ${lastName}, te registraste en <strong>Food Rush</strong></p>
               para activar tu cuenta y poder acceder a la app presiona click en el siguiente enlace:
               <a href="${req.protocol}://${req.get("host")}/activate/${tokenDelivery}">Activar cuenta</a>`
      };

      transporter.sendMail(mailOption, (err, info) => {
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
    singUpActive: true
  });
};

exports.PostComercioSingUp = async (req, res, next) => {
  const tokenComercio = uuid4();
  console.log("token:", tokenComercio);

  const { name, phone, email, role, openTime, closeTime, typeTrade, password, confirmPassword } = req.body;
  const logo = req.file;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroComercio");
  }

  try {
    const existingComercio = await Comercio.findOne({ where: { email } });
    if (existingComercio) {
      req.flash("errors", "This email already exists, please select another one");
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
      token: tokenComercio
    });

    console.log("Registro correcto");

    const mailOption = {
      from: "foodrushya@gmail.com",
      to: email,
      subject: "Bienvenido a Food Rush",
      html: `<p>Estimado ${role}, ${name}, te registraste en <strong>Food Rush</strong></p>
             para activar tu cuenta y poder acceder a la app presiona click en el siguiente enlace:
             <a href="${req.protocol}://${req.get("host")}/activate/${tokenComercio}">Activar cuenta</a>`
    };

    transporter.sendMail(mailOption, (err, info) => {
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
    singUpActive: true
  });
};

exports.PostAdminSingUp = async (req, res, next) => {
  const { name, lastName, identification, email, role, user, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("/registroAdmin");
  }

  try {
    const existingUser = await Admin.findOne({ where: { user } });
    if (existingUser) {
      req.flash("errors", "This user already exists, please select another one");
      return res.redirect("/registroAdmin");
    }

    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      req.flash("errors", "This email already exists, please select another one");
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
      password: hashedPassword
    });

    console.log("Registro correcto");
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("errors", "Something went wrong, please try again later");
    return res.redirect("/registroAdmin");
  }
};
