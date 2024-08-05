module.exports = function (req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash("errors", "Sesion expirada");
    return res.redirect("http://localhost:8080/login");
  }
  return req.session.user.id;
};
