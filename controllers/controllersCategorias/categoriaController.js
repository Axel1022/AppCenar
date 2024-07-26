const Categorias = require("../../models/modelComercios/categoria");
const Comercio = require("../../models/modelComercios/comercio");

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
            name: categoria.name,
            description: categoria.description,
            quantity: categoria.quantity
        }
    })
  
    res.render("comercios/Categorias", {
        pageTitle: "Food Rush | Categorias",
        layout: "layoutComercios",
        loginActive: true,
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
        include: [{model: Comercio}]
   })
   .then((result) => {
        const categorias  = result.map((result) => result.dataValues);

        res.render("comercios/AgregarCategoria", {
            pageTitle: "Food Rush | Agregar Categorias",
            layout: "layoutComercios",
            loginActive: true,
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
        where: {
            id: id,
            tradeId: comercioId
        },
        include: [{model: Comercio}]
   })
   .then((result) => {
        const categorias  = result.map((result) => result.dataValues);

        res.render("/comercios/EditarCategoria", {
            pageTitle: "Food Rush | Editar Categorias",
            layout: "layoutComercios",
            loginActive: true,
            hasCategoria: categorias.length > 0,
            categorias: categorias
        });
    })
    .catch((err) => {
        console.error("Error al obtener las categorias:", err);
    });
}

exports.GetDeleteCategoria = (req, res, next) => {
    const comercioId = req.session.user.id;
    const usuario = req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

    const categoriaId = req.params.categoriaId;

    Categorias.findOne({
        where: {
            id: categoriaId,
            tradeId: comercioId
        }
    })
    .then((categoria) => {
        if(!categoria){
            return res.redirect("/comercios/DeleteCategoria");
        }

        res.render("/comercios/Categorias", {
            pageTitle: "Food Rush | Eliminar Categoria",
            layout: "layoutComercios",
            loginActive: true,
            hasCategoria: categoria.length > 0,
            categorias: categoria
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

 const id = req.body.categoriaId;
 const name = req.body.name;
 const description = req.body.description;

 Categorias.findOne({
     where: {id: id}
 })
 .then((result) => {
    const categoria = result.dataValues;

    if(!categoria){
        return res.redirect("/viewComercio/viewCategoria");
    }

    Categorias.update({
        name: name,
        description: description,
        tradeId: comercioId
    },
   { where: {id : id}}
    )
    .then((result) => {
        return res.redirect("/viewComercios/viewCategoria");
    })
    .catch((error) => {
        console.log(error);
    })
 })
 .catch((err) => {
    console.log("Error al actualizar la categoria", err);
 })
};

exports.PostDeleteCategoria = (req, res, next) => {
  const comercioId = req.session.user.id;
  const usuario = req.session.user.id;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

  const categoriaId = req.params.categoriaId;

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
  });
};