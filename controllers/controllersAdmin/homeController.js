exports.getHome = (req, res, next) => {
  res.render("viewsAdmin/home", {
    pageTitle: "App Cenar | 404",
    layout: "layoutAdmin",
  });
};
