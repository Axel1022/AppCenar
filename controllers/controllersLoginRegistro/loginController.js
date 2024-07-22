exports.getLogin = (req, res, next) => {
  res.render("viewsLoginRegisto/viewLogin", {
    pageTitle: "App Cenar | Iniciar Session",
    layout: "layoutRegistroLogin",
  });
};
