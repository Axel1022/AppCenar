const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: "foodrushya@gmail.com", //Coloca aquí tu correo
    pass: `yekpvlthllvoqkls`, //Coloca aquí tu contraseña

    //! Visita este video para que sepas como buscar la contraceña:
    //TODO: https://www.youtube.com/watch?v=wI_3Hfry5uw&ab_channel=LeonardoTav%C3%A1rez
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = transporter;
