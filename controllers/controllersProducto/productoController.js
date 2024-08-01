const Categoria = require("../../models/modelComercios/categoria");
const Productos = require("../../models/modelComercios/producto");
const Comercio = require("../../models/modelComercios/comercio");

exports.GetProducts = async (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user) {
    req.flash("errors", "You need to log in to access this area.");
    res.redirect("/login");
  }

  const comercioId = verificUseer(req, res, next);
  console.log("Usuario logeado:", comercioId);

  const productos = await Productos.findAll({
    where: { tradeId: comercioId },
    include: [
      { model: Comercio, as: "comercio" },
      { model: Categoria, as: "categoria" },
    ],
  });

  const mapeoProducto = productos.map((producto) => {
    return {
      id: producto.id,
      name: producto.name,
      image: producto.image,
      description: producto.description,
      price: producto.price,
      quantity: producto.quantity,
      categoriaName: producto.categoria.name,
    };
  });

  res.render("viewsComercios/viewProductos", {
    pageTitle: "Food Rush | Productos",
    hasProducto: productos.length > 0,
    productos: mapeoProducto,
  });
};

exports.GetAddProducts = (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
  const usuario = req.session.user.role;

  console.log("Este es el rol del usuario actual:", usuario);

  if (usuario !== "comercio") {
    req.flash("errors", "You don't have access to this area");
    return res.redirect("/login");
  }

  Productos.findAll({
    where: { tradeId: comercioId },
    include: [{ model: Comercio, as: "comercio" }],
  })
    .then((result) => {
      return Categoria.findAll({ where: { tradeId: comercioId } }).then(
        (categorias) => {
          const productos = result.map((r) => r.dataValues);
          const categoriasData = categorias.map((c) => c.dataValues);

          res.render("viewsComercios/viewAddProducto", {
            pageTitle: "Food Rush | Agregar Producto",
            hasProducto: productos.length > 0,
            productos: productos,
            categorias: categoriasData,
          });
        }
      );
    })
    .catch((err) => {
      console.error("Error al obtener los productos o categorías:", err);
      res.redirect("/login");
    });
};

exports.GetEditProducts = (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
  const productId = req.params.id;

  console.log(productId);

  const usuario = req.session.user.role;

  if (usuario !== "comercio") {
    req.flash("errors", "You dont have access to this area");
    return res.redirect("/login");
  }

  Productos.findOne({
    where: {
      id: productId,
      tradeId: comercioId,
    },
    include: [{ model: Comercio, as: "comercio" }],
  })
    .then((result) => {
      if (!result) {
        return res.redirect("/comercios/Productos");
      }

      Categoria.findAll({
        where: { tradeId: comercioId },
      })
        .then((categoria) => {
          res.render("viewsComercios/viewAddProducto", {
            pageTitle: "Food Rush | Editar Producto",
            productos: result.dataValues,
            editMode: true,
            categorias: categoria.map((c) => c.dataValues),
          });
        })
        .catch((err) => {
          console.error("Error al obtener el producto:", err);
          res.redirect("/comercios/Producto");
        });
    })
    .catch((err) => {
      console.error("Error al obtener los productos:", err);
    });
};

exports.GetDeleteProducts = (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
  const productoId = req.params.id;

  const usuario = req.session.user.role;

  if (usuario !== "comercio") {
    req.flash("errors", "You dont have access to this area");
    return res.redirect("/login");
  }

  Productos.findOne({
    where: {
      id: productoId,
      tradeId: comercioId,
    },
  })
    .then((productos) => {
      if (!productos) {
        return res.redirect("/comercios/Productos");
      }

      res.render("viewsComercios/viewDeleteProducto", {
        pageTitle: "Food Rush | Eliminar Producto",
        hasProductos: productos.length > 0,
        productos: productos.dataValues,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.PostAddProducts = (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
  const usuario = req.session.user.role;

  console.log("Usuario logeado al agregar", usuario);
  if (usuario !== "comercio") {
    req.flash("errors", "You dont have access to this area");
    return res.redirect("/login");
  }

  const name = req.body.name;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const categoriaId = req.body.categoryId;

  Productos.create({
    name: name,
    image: "/" + image.path,
    description: description,
    price: price,
    tradeId: comercioId,
    categoryId: categoriaId,
  })
    .then(() => {
      Categoria.increment("quantity", { by: 1, where: { id: categoriaId } });
      res.redirect("/comercios/Productos");
    })
    .catch((err) => {
      console.error("Error al crear el producto:", err);
    });
};

exports.PostEditProducts = async (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
  const usuario = req.session.user.role;
  console.log("Usuario intentando editar", usuario);

  if (usuario !== "comercio") {
    req.flash("errors", "You don't have access to this area");
    return res.redirect("/login");
  }

  const id = req.body.id;
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const categoryId = req.body.categoryId;

  try {
    const producto = await Productos.findOne({
      where: {
        id: id,
        tradeId: comercioId,
      },
    });

    if (!producto) {
      req.flash("errors", "Product not found");
      return res.redirect("/comercios/Productos");
    }

    const oldCategoryId = producto.categoryId;
    const imagePath = image ? "/" + image.path : producto.image;

    await Productos.update(
      {
        name: name,
        image: imagePath,
        description: description,
        price: price,
        tradeId: comercioId,
        categoryId: categoryId,
      },
      {
        where: {
          id: id,
          tradeId: comercioId,
        },
      }
    );

    if (oldCategoryId !== categoryId) {
      await Promise.all([
        Categoria.increment("quantity", { by: 1, where: { id: categoryId } }),
        Categoria.decrement("quantity", {
          by: 1,
          where: { id: oldCategoryId },
        }),
      ]);
    }

    req.flash("success", "Product updated successfully");
    return res.redirect("/comercios/Productos");
  } catch (error) {
    console.log("Error al actualizar el producto", error);
    req.flash("errors", "An error occurred while updating the product");
    return res.redirect("/comercios/Productos");
  }
};

exports.PostDeleteProducts = (req, res, next) => {
  const comercioId = verificUseer(req, res, next);
  const productId = req.params.id;

  Productos.findOne({ where: { id: productId, tradeId: comercioId } })
    .then((producto) => {
      if (!producto) {
        req.flash("errors", "Producto no encontrado");
        return res.redirect("/comercios/Productos");
      }

      const categoryId = producto.categoryId;

      return producto.destroy().then(() => {
        return Categoria.decrement("quantifier", {
          by: 1,
          where: { id: categoryId },
        });
      });
    })
    .then(() => {
      res.redirect("/comercios/Productos");
    })
    .catch((error) => {
      console.error("Error al eliminar el producto: ", error);
    });
};
