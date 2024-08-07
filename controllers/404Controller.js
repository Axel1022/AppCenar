exports.get404 = (req, res, next) => {
  let redirectUrl = "/";

  if (req.session && req.session.user) {
    const role = req.session.user.role;

    switch (role) {
      case "cliente":
        redirectUrl = "/clientes/home";
        break;
      case "delivery":
        redirectUrl = "/delivery/home";
        break;
      case "admin":
        redirectUrl = "/admin/home";
        break;
      case "comercio":
        redirectUrl = "/comercios/home";
        break;
      default:
        redirectUrl = "/";
    }
  }

  res.render("404", {
    pageTitle: "Página no encontrada",
    layout: "layout404",
    redirectUrl: redirectUrl
  });
};
