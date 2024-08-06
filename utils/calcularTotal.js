module.exports = function calcularTotal(products) {
    let subTotal = 0;
    let totalQuantity = 0;
  
    products.forEach((product) => {
      const quantity = parseFloat(product.quantity) || 1;
      const price = parseFloat(product.price);
  
      if (!isNaN(quantity) && quantity >= 0 && !isNaN(price) && price >= 0) {
        subTotal += quantity * price;
        totalQuantity += quantity;
      } else {
        console.warn(`Datos inválidos para el producto: ${JSON.stringify(product)}`);
      }
    });
  
    const itbis = subTotal * 0.18;
    const total = subTotal + itbis;
  
    return {
      subTotal: parseFloat(subTotal.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      totalQuantity,
    };
}

