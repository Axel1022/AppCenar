module.exports = function (status) {
  return status === "Completado" ? "text-success" : "text-danger";
};
