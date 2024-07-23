exports.getHome = (req, res, next) => {
  res.render("viewsAdmin/home", {
    pageTitle: "Food Rush | 404",
    layout: "layoutAdmin",
  });
};
