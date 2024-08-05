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

exports.GetAddCategoria = async  (req, res, next) => {
   const comercioId = req.session.user.id;
   const usuario= req.session.user.role;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("/login");
    }

    try {
        const categorias = await Categorias.findAll({
            where: { tradeId: comercioId },
            include: [{ model: Comercio, as: "comercio" }]
        });

        const comercio = await Comercio.findOne({
            where: { id: comercioId }
        });

        if (!comercio) {
            throw new Error("Comercio no encontrado");
        }

        const categoriaData = categorias.dataValues;
        const tipoComercio = comercio.typeTrade; 

       let opcionesCategoria = [];
       switch(tipoComercio) {
        case "restaurante":
            opcionesCategoria =[
                {value: "Entradas", text: "Entradas"},
                {value: "Aperitivos", text: "Aperitivos"},
                {value: "Platos Principales", text: "Platos Principales"},
                {value: "Parrilladas", text: "Parrilladas"},
                {value: "Postres", text: "Postres"},
                {value: "Especialidades del chef", text: "Especialidades del chef"},
                {value: "Menu infantil", text: "Menu infantil"},
                {value: "Comida Vegana/Vegetariana", text: "Comida Vegana/Vegetariana"},
            ];  break;

        case "mercado" : 
            opcionesCategoria = [
                {value: "Frutas", text: "Frutas"},
                {value: "Verduras y Vegetales", text: "Verduras y Vegetales"},
                {value: "Carnes", text: "Carnes"},
                {value: "Mariscos y Pescados", text: "Mariscos y Pescados"},
                {value: "Lácteos", text: "Lácteos"},
                {value: "Panadería", text: "Panadería"},
                {value: "Alimentos enlatados", text: "Alimentos enlatados"},
                {value: "Productos orgánicos", text: "Productos orgánicos"},
                {value: "Granos y Cereales", text: "Granos y Cereales"},
           ]; break;

        case "tienda" :
            opcionesCategoria =[
                { value: "Ropa", text: "Ropa" },
                { value: "Calzado", text: "Calzado" },
                { value: "Accesorios", text: "Accesorios" },
                { value: "Electrónica", text: "Electrónica" },
                { value: "Hogar y Jardín", text: "Hogar y Jardín" },
                { value: "Juguetes", text: "Juguetes" },
                { value: "Belleza y Cuidado Personal", text: "Belleza y Cuidado Personal" },
                { value: "Alimentos y Bebidas", text: "Alimentos y Bebidas" },
                { value: "Papelería", text: "Papelería" },
                { value: "Deportes", text: "Deportes" }
            ]; break;

        case "salud": 
           opcionesCategoria = [
                { value: "Farmacia", text: "Farmacia" },
                { value: "Suplementos Nutricionales", text: "Suplementos Nutricionales" },
                { value: "Productos de Cuidado Personal", text: "Productos de Cuidado Personal" },
                { value: "Equipos Médicos", text: "Equipos Médicos" },
                { value: "Productos para el Cuidado de la Piel", text: "Productos para el Cuidado de la Piel" },
                { value: "Vitaminas", text: "Vitaminas" },
                { value: "Productos para el Bienestar", text: "Productos para el Bienestar" },
                { value: "Salud Dental", text: "Salud Dental" },
                { value: "Cuidado del Cabello", text: "Cuidado del Cabello" },
                { value: "Productos para el Manejo del Estrés", text: "Productos para el Manejo del Estrés" }
           ]; break;
          
        case "drink":
            opcionesCategoria = [
                { value: "Jugos", text: "Jugos" },
                { value: "Refrescos", text: "Refrescos" },
                { value: "Agua", text: "Agua" },
                { value: "Bebidas Energéticas", text: "Bebidas Energéticas" },
                { value: "Licores", text: "Licores" },
                { value: "Cervezas", text: "Cervezas" },
                { value: "Vinos", text: "Vinos" },
                { value: "Cócteles", text: "Cócteles" },
                { value: "Bebidas sin Alcohol", text: "Bebidas sin Alcohol" },
                { value: "Tés e Infusiones", text: "Tés e Infusiones" }
            ]; break;
              
       case "cafe y postres":
            opcionesCategoria = [
                { value: "Café Clásico", text: "Café Clásico" },
                { value: "Espresso y Americano", text: "Espresso y Americano" },
                { value: "Café filtrado y Cold Brew", text: "Café filtrado y Cold Brew" },
                { value: "Café Especiales", text: "Café Especiales" },
                { value: "Latte y Cappuccino", text: "Latte y Cappuccino" },
                { value: "Mocha y Café con leche", text: "Mocha y Café con leche" },
                { value: "Postres Clásicos", text: "Postres Clásicos" },
                { value: "Pasteles y Tartas", text: "Pasteles y Tartas" },
                { value: "Galletas y Muffins", text: "Galletas y Muffins" },
                { value: "Postres Especiales", text: "Postres Especiales" },
                { value: "Helados y Brownies", text: "Helados y Brownies" },
                { value: "Flanes y Mousse", text: "Flanes y Mousse" }
            ]; break;
       }
        res.render("viewsComercios/viewAddCategoria", {
            pageTitle: "Food Rush | Agregar Categorías",
            categorias: categoriaData,
            opcionesCategoria: opcionesCategoria,
        });
    } catch (err) {
        console.error("Error al obtener las categorías:", err);
        req.flash("errors", "Error al obtener las categorías.");
        res.redirect("/login");
    }
};

exports.GetEditCategoria = async (req, res, next) => {
    const comercioId = req.session.user.id;
    const usuario = req.session.user.role;
    const id = req.params.id;

    if(usuario !=="comercio"){
        req.flash("errors", "You dont have access to this area");
        return res.redirect("login");
    }

    try {
        const comercio = await Comercio.findOne({
            where: { id: comercioId }
        });

        if (!comercio) {
            throw new Error("Comercio no encontrado");
        }

        const tipoComercio = comercio.typeTrade;
        let categoria = null;
        if (id) {
            categoria = await Categorias.findOne({
                where: { id: id, tradeId: comercioId }
            });

            if (!categoria) {
                throw new Error("Categoría no encontrada");
            }
        }
        const categoriasData = categoria.dataValues;

        let opcionesCategoria = [];
       switch(tipoComercio) {
        case "restaurante":
            opcionesCategoria =[
                {value: "Entradas", text: "Entradas"},
                {value: "Aperitivos", text: "Aperitivos"},
                {value: "Platos Principales", text: "Platos Principales"},
                {value: "Parrilladas", text: "Parrilladas"},
                {value: "Postres", text: "Postres"},
                {value: "Especialidades del chef", text: "Especialidades del chef"},
                {value: "Menu infantil", text: "Menu infantil"},
                {value: "Comida Vegana/Vegetariana", text: "Comida Vegana/Vegetariana"},
            ];  break;

        case "mercado" : 
            opcionesCategoria = [
                {value: "Frutas", text: "Frutas"},
                {value: "Verduras y Vegetales", text: "Verduras y Vegetales"},
                {value: "Carnes", text: "Carnes"},
                {value: "Mariscos y Pescados", text: "Mariscos y Pescados"},
                {value: "Lácteos", text: "Lácteos"},
                {value: "Panadería", text: "Panadería"},
                {value: "Alimentos enlatados", text: "Alimentos enlatados"},
                {value: "Productos orgánicos", text: "Productos orgánicos"},
                {value: "Granos y Cereales", text: "Granos y Cereales"},
           ]; break;

        case "tienda" :
            opcionesCategoria =[
                { value: "Ropa", text: "Ropa" },
                { value: "Calzado", text: "Calzado" },
                { value: "Accesorios", text: "Accesorios" },
                { value: "Electrónica", text: "Electrónica" },
                { value: "Hogar y Jardín", text: "Hogar y Jardín" },
                { value: "Juguetes", text: "Juguetes" },
                { value: "Belleza y Cuidado Personal", text: "Belleza y Cuidado Personal" },
                { value: "Alimentos y Bebidas", text: "Alimentos y Bebidas" },
                { value: "Papelería", text: "Papelería" },
                { value: "Deportes", text: "Deportes" }
            ]; break;

        case "salud": 
           opcionesCategoria = [
                { value: "Farmacia", text: "Farmacia" },
                { value: "Suplementos Nutricionales", text: "Suplementos Nutricionales" },
                { value: "Productos de Cuidado Personal", text: "Productos de Cuidado Personal" },
                { value: "Equipos Médicos", text: "Equipos Médicos" },
                { value: "Productos para el Cuidado de la Piel", text: "Productos para el Cuidado de la Piel" },
                { value: "Vitaminas", text: "Vitaminas" },
                { value: "Productos para el Bienestar", text: "Productos para el Bienestar" },
                { value: "Salud Dental", text: "Salud Dental" },
                { value: "Cuidado del Cabello", text: "Cuidado del Cabello" },
                { value: "Productos para el Manejo del Estrés", text: "Productos para el Manejo del Estrés" }
           ]; break;
          
        case "drink":
            opcionesCategoria = [
                { value: "Jugos", text: "Jugos" },
                { value: "Refrescos", text: "Refrescos" },
                { value: "Agua", text: "Agua" },
                { value: "Bebidas Energéticas", text: "Bebidas Energéticas" },
                { value: "Licores", text: "Licores" },
                { value: "Cervezas", text: "Cervezas" },
                { value: "Vinos", text: "Vinos" },
                { value: "Cócteles", text: "Cócteles" },
                { value: "Bebidas sin Alcohol", text: "Bebidas sin Alcohol" },
                { value: "Tés e Infusiones", text: "Tés e Infusiones" }
            ]; break;
              
       case "cafe y postres":
            opcionesCategoria = [
                { value: "Café Clásico", text: "Café Clásico" },
                { value: "Espresso y Americano", text: "Espresso y Americano" },
                { value: "Café filtrado y Cold Brew", text: "Café filtrado y Cold Brew" },
                { value: "Café Especiales", text: "Café Especiales" },
                { value: "Latte y Cappuccino", text: "Latte y Cappuccino" },
                { value: "Mocha y Café con leche", text: "Mocha y Café con leche" },
                { value: "Postres Clásicos", text: "Postres Clásicos" },
                { value: "Pasteles y Tartas", text: "Pasteles y Tartas" },
                { value: "Galletas y Muffins", text: "Galletas y Muffins" },
                { value: "Postres Especiales", text: "Postres Especiales" },
                { value: "Helados y Brownies", text: "Helados y Brownies" },
                { value: "Flanes y Mousse", text: "Flanes y Mousse" }
            ]; break;
       }

       console.log("Opciones: " , opcionesCategoria)
       
       console.log("Lista de opciones", opcionesCategoria);
        res.render("viewsComercios/viewAddCategoria", {
            pageTitle: "Food Rush | Editar Producto",
            categorias: categoriasData,
            opcionesCategoria: opcionesCategoria,
            editMode: true
        });

    } catch (error) {
        console.error("Error al obtener las categorías:", err);
    }
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
        return res.redirect("/comercios/Categorias");
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
