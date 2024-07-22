exports.get404 = (req, res, next) => {
  res.render("404", {
    pageTitle: "App Cenar | 404",
    layout:"layout404",

  });
};
