const modelFavorito = require("../models/modelCliente/favoritos");
module.exports = async function isFavorito(idCliente, idComercio) {
  const encontrado = await modelFavorito.findOne({
    where: { clientId: idCliente, tradeId: idComercio },
  });
  if (encontrado) return false;
  else return true;
};
