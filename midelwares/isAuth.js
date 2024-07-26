function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
      return next();
    }
    req.flash("errors", "You need to log in to access this area.");
    res.redirect('/login');
}