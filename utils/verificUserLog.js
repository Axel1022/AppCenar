module.exports = function (req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash("errors", "Sesion expirada");
    return res.redirect("/login");
  } else return req.session.user.id;
};
