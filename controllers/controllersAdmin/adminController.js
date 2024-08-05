
const Cliente = require("../../models/modelCliente/cliente");
const Delivery = require("../../models/modelDelivery/delivery");
const Comercio = require("../../models/modelComercios/comercio");
const Administrador = require("../../models/modelAdmin/administrador");
const Producto  = require("../../models/modelComercios/producto");

exports.getHome = async (req, res) => {
    try {
        const comerciosActivos = await Comercio.count({ where: { active: true } });
        const comerciosInactivos = await Comercio.count({ where: { active: false } });
        const clientesActivos = await Cliente.count({ where: { active: true } });
        const clientesInactivos = await Cliente.count({ where: { active: false } });
        const deliveryActivos = await Delivery.count({ where: { active: true } });
        const deliveryInactivos = await Delivery.count({ where: { active: false } });
        const totalProductos = await Producto.count();

        res.render('admin/home', {
            totalPedidos,
            pedidosHoy,
            comerciosActivos,
            comerciosInactivos,
            clientesActivos,
            clientesInactivos,
            deliveryActivos,
            deliveryInactivos,
            totalProductos
        });
    } catch (error) {
        res.status(500).send('Error al obtener las estadísticas');
    }
};

exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();

        res.render('viewsAdmin/listadoCliente', { clientes });
    } catch (error) {
        res.status(500).send('Error al obtener el listado de clientes');
    }
};

exports.getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll();

        res.render('viewsAdmin/listadoDelivery', { deliveries });
    } catch (error) {
        res.status(500).send('Error al obtener el listado de deliveries');
    }
};

exports.getComercios = async (req, res) => {
    try {
        const comercios = await Comercio.findAll();

        res.render('viewsAdmin/listadoComercio', { comercios });
    } catch (error) {
        res.status(500).send('Error al obtener el listado de comercios');
    }
};



exports.getAdministradores = async (req, res) => {
    try {
        const administradores = await Administrador.findAll();
        res.render('viewsAdmin/mantenimientoAdmin', { administradores });
    } catch (error) {
        res.status(500).send('Error al obtener el listado de administradores');
    }
};

exports.createAdministrador = async (req, res) => {
    try {
        const { name, lastName, identification, email, user, password } = req.body;
        await Administrador.create({ name, lastName, identification, email, user, password });
        res.redirect('/viewsAdmin/crearAdmin');
    } catch (error) {
        res.status(500).send('Error al crear el administrador');
    }
};

exports.updateAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastName, identification, email, user, password } = req.body;
        await Administrador.update({ name, lastName, identification, email, user, password }, { where: { id } });
        res.redirect('/admin/administradores');
    } catch (error) {
        res.status(500).send('Error al actualizar el administrador');
    }
};

exports.deleteAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        await Administrador.destroy({ where: { id } });
        res.redirect('/admin/administradores');
    } catch (error) {
        res.status(500).send('Error al eliminar el administrador');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
