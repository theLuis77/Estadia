// middleware/errorHandler.js
module.exports = function (err, req, res, next) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
};
