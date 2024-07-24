exports.getHome = async (req, res, next) => {
  res.render("viewsDelivery/home", {
    pageTitle: "Food Rush | Delivery",
    layout: "layoutCliente",
  });
};
