exports.get404 = (req, res, next) => {
  res.render("404", {
    pageTitle: "Food Rush | 404",
    layout:"layout404",

  });
};
