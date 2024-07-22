exports.getRegistrar = (req, res, next) => {
  res.render("viewsLoginRegisto/viewRegistro", {
    pageTitle: "App Cenar | Registrar",
    layout: "layoutRegistroLogin",
  });
};
