const { captureRejectionSymbol } = require("nodemailer/lib/xoauth2");
const Categorias = require("../../models/modelComercios/categoria");
const Comercio = require("../../models/modelComercios/comercio");
const Producto = require("../../models/modelComercios/producto");

exports.GetCategoria = async (req, res, next) => {

    const comercioId = req.session.user.id;

    const categorias = await Categorias.findAll({
        where: {tradeId: comercioId},
        include:[
            {model: Comercio,  as: "comercio"},
        ]
    });

    const mapeoCategoria = categorias.map(categoria => {
        return {
            id: categoria.id,
            name: categoria.name,
            description: categoria.description,
            quantity: categoria.quantity
        }
    })

    res.render("viewsComercios/viewCategoria", {
        pageTitle: "Food Rush | Categorias",
        hasCategoria: categorias.length > 0,
        categorias: mapeoCategoria
    });
}

exports.GetAddCategoria =  (req, res, next) => {
   const comercioId = req.session.user.id;
   const usuario= req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

   Categorias.findAll({
        where: {tradeId: comercioId},
        include: [{model: Comercio, as: "comercio"}]
   })
   .then((result) => {
        const categorias  = result.map((result) => result.dataValues);

        res.render("viewsComercios/viewAddCategoria", {
            pageTitle: "Food Rush | Agregar Categorias",
            hasCategoria: categorias.length > 0,
            categorias: categorias
        });
    })
    .catch((err) => {
        console.error("Error al obtner las categorias:", err);
    });
};

exports.GetEditCategoria = (req, res, next) => {
    const comercioId = req.session.user.id;
    const usuario = req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("login");
    }
    const id = req.params.id;

    Categorias.findOne({
        where: {id: id,
            tradeId: comercioId
        },
        include: [{model: Comercio, as: "comercio"}]
    })
    .then((categorias) => {
        res.render("viewsComercios/viewAddCategoria", {
            pageTitle: "Food Rush | Editar Producto",
            categorias: categorias.dataValues,
            editMode: true
        });
    })
    .catch((err) => {
        console.error("Error al obtener las categorías:", err);
    });
}

exports.GetDeleteCategoria = (req, res, next) => {
    const comercioId = req.session.user.id;
    const usuario = req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

    const categoriaId = req.params.id;

    Categorias.findOne({
        where: {
            id: categoriaId,
            tradeId: comercioId
        }
    })
    .then((categoria) => {
        if(!categoria){
            return res.redirect("/comercios/EliminarCategoria");
        }

        res.render("viewsComercios/viewDeleteCategoria", {
            pageTitle: "Food Rush | Eliminar Categoria",
            hasCategoria: categoria.length > 0,
            categorias: categoria.dataValues
        });
    })
    .catch((error) => {
        console.log(error);
    })
};

exports.PostAddCategorias = (req, res, next) => {
    const comercioId = req.session.user.id;
    const usuario = req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

    const name = req.body.name;
    const description = req.body.description;

    Categorias.create({
        name: name,
        description: description,
        tradeId: comercioId
    })
    .then(() =>{
        res.redirect("/comercios/Categorias");
    })
    .catch(err => {
        console.error("Error al crear la categoria:", err);
    })
};

exports.PostEditCategoria = (req, res, next) => {
 const comercioId = req.session.user.id;
 const usuario = req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("login");
    }

 const id = req.body.id;
 const name = req.body.name;
 const description = req.body.description;

 Categorias.findOne({
    where: {id: id,
        tradeId: comercioId
    },
    include: [{model: Comercio, as: "comercio"}]
 })
 .then((result) => {
    const categoria = result.dataValues;

    if(!categoria){
        return res.redirect("/comercios/Categorias");
    }

    Categorias.update({
        name: name,
        description: description,
        tradeId: comercioId
    },
   { where: {id : id}}
    )
    .then((result) => {
        return res.redirect("/comercios/Categoria");
    })
    .catch((error) => {
        console.log(error);
    })
 })
 .catch((err) => {
    console.log("Error al actualizar la categoria", err);
 })
};

exports.PostDeleteCategoria = async (req, res, next) => {
  const comercioId = req.session.user.id;
  const usuario = req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

  const categoriaId = req.body.id;

  console.log("ID a eliminar:", categoriaId),
  Categorias.destroy({
    where: {
        id: categoriaId,
        tradeId: comercioId
    }
  })
  .then((result) => {
    if(result === 0){
        req.flash("errors", "Categoria no encontrada");
        return res.redirect("/comercios/Categorias");
    }
  })
  .catch((error) => {
    console.log("Error al eliminar la categoria: " , error);
  }); try {
    const categoria = await Categorias.findOne({
        where: {
            id: categoriaId,
            tradeId: comercioId
        }
    });

    if (!categoria) {
        req.flash("errors", "Categoría no encontrada.");
        return res.redirect("/comercios/Categorias");
    }

    const productos = await Productos.findAll({ where: { categoryId: categoriaId } });

    if (productos.length > 0) {
        req.flash("errors", "Al eliminar esta categoria los productos asociados no tendran categoria")
        await Productos.update(
            { categoryId: null },
            { where: { categoryId: categoriaId } }
        );
    }

    const result = await Categorias.destroy({
        where: {
            id: categoriaId,
            tradeId: comercioId
        }
    });

    if (result === 0) {
        req.flash("errors", "No se pudo eliminar la categoría.");
    } else {
        req.flash("success", "Categoría eliminada con éxito.");
    }

} catch (error) {
    console.error("Error al eliminar la categoría:", error);
    req.flash("errors", "Error al eliminar la categoría.");
}

res.redirect("/comercios/Categorias");
};
