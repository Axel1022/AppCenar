module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.role) {
      if (req.session.user.role === 'cliente') {
        res.locals.layout = 'layoutCliente';
      } else if (req.session.user.role === 'comercio') {
        res.locals.layout = 'layoutComercios';
      }
      else if (req.session.user.role === 'administrador') {
        res.locals.layout = 'layoutAdmin';
      }
      else if (req.session.user.role === 'delivery') {
        res.locals.layout = 'layoutDelivery';
      }
    } else {
      res.locals.layout = 'layout404'; 
    }
    next();
  };
  