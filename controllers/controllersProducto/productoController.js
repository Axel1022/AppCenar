const Categoria = require("../../models/modelComercios/categoria");
const Productos = require("../../models/modelComercios/producto");
const Comercio = require("../../models/modelComercios/comercio")

exports.GetProducts = async (req, res, nex) => {

    const comercioId = req.session.user.id;

    const productos = await Productos.findAll({
        where: {tradeId: comercioId},
        include:[
            {model: Comercio,  as: "comercio"},
            {model: Categoria, as: "categoria"}
        ]
    });

    const mapeoProducto = productos.map(producto => {
        return {
            name: producto.name,
            image: producto.image,
            description: producto.description,
            price: producto.price,
            quantity: producto.quantity,
            categoriaName: producto.categoria.name
        }
    })
  
    res.render("viewsComercios/viewProducto", {
        pageTitle: "Food Rush | Productos",
        hasProducto: productos.length > 0,
        productos: mapeoProducto
    });
};

exports.GetAddProducts =  (req, res, next) => {
    const comercioId = req.session.user.id;
    const comercio = Comercio.findByPk(comercioId);

    if(comercio.role !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/viewsLoginRegistro/login");
    }
 
    Productos.findAll({
         where: {tradeId: comercioId},
         include: [{model: Comercio}]
    })
    .then((result) => {
         const productos  = result.map((result) => result.dataValues);
 
         res.render("viewsComercios/viewAddProducto", {
             pageTitle: "Food Rush | Agregar Producto",
             hasProducto: productos.length > 0,
             productos: productos 
         });
     })
     .catch((err) => {
         console.error("Error al obtener los productos:", err);
     });
};

exports.GetEditProducts = (req, res, next) => {
    const comercioId = req.session.user.id;
    const productId = req.params.productId;

    const comercio = Comercio.findByPk(comercioId);

    if(comercio.role !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/viewsLoginRegistro/login");
    }

   Productos.findOne({
        where: {
            id: productId,
            tradeId: comercioId},
        include: [{model: Comercio}]
   })
   .then((result) => {
        if (!result) {
            return res.redirect("/viewsComercios/viewProducto")
        }

        res.render("viewsComercios/viewAddProducto", {
            pageTitle: "Food Rush | Editar Producto",
            productos: result.dataValues
        });
    })
    .catch((err) => {
        console.error("Error al obtener las categorias:", err);
    });
};

exports.GetDeleteProducts = (req, res, next) => {
    const comercioId = req.session.user.id;
    const productoId = req.params.productoId;

    const comercio = Comercio.findByPk(comercioId);

    if(comercio.role !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/viewsLoginRegistro/login");
    }

    Productos.findOne({
        where: {
            id: productoId,
            tradeId: comercioId
        }
    })
    .then((productos) => {
        if(!productos){
            return res.redirect("/viewComercio/viewProducto");
        }

        res.render("viewsComercios/viewDeleteProducto", {
            pageTitle: "Food Rush | Eliminar Producto",
            hasProductos: productos.length > 0,
            productos: productos
        });
    })
    .catch((error) => {
        console.log(error);
    })
};

exports.PostAddProducts = (req, res, next) => {
    const comercioId = req.session.user.id;
    const comercio = Comercio.findByPk(comercioId);

    if(comercio.role !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/viewsLoginRegistro/login");
    }

    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const categoriaId = req.body.categoria;


    Productos.create({
        name: name,
        image: image,
        description: description,
        price: price,
        tradeId: comercioId,
        categoryId: categoriaId

    })
    .then(() =>{
        res.redirect("/viewsCategoria/viewProducto");
    })
    .catch(err => {
        console.error("Error al crear el producto:", err);
    })
};

exports.PostEditProducts = (req, res, next) => {
    const comercioId = req.session.user.id;

    const comercio = Comercio.findByPk(comercioId);

    if(comercio.role !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/viewsLoginRegistro/login");
    }
   
    const id = req.body.productoId;
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const categoriaId = req.body.categoria;
   
    Productos.findOne({
        where: {
            id: id,
            tradeId: comercioId
        }
    })
    .then((result) => {
       const categoria = result.dataValues;
   
       if(!categoria){
           return res.redirect("/viewComercio/viewProducto");
       }
   
       Productos.update({
           name: name,
           image: image,
           description: description,
           price: price,
           tradeId: comercioId,
           categoryId: categoriaId
       })
       .then((result) => {
           return res.redirect("/viewComercios/viewProducto");
       })
       .catch((error) => {
           console.log(error);
       })
    })
    .catch((err) => {
       console.log("Error al actualizar el producto", err);
    })
};
   
exports.PostDeleteProducts = (req, res, next) => {
    const comercioId = req.session.user.id;
    const comercio = Comercio.findByPk(comercioId);

    if(comercio.role !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/viewsLoginRegistro/login");
    }

    const productId = req.params.productId;

    Productos.destroy({
    where: {
        id: productId,
        tradeId: comercioId
    }
    })
    .then((result) => {
    if(result === 0){
        req.flash("errors", "Producto no encontrado");
        return res.redirect("/viewComercio/viewProducto");
    }
    res.redirect("/viewsComercio/viewProducto");
    })
    .catch((error) => {
    console.log("Error al eliminar el producto: " , error);
    });
};