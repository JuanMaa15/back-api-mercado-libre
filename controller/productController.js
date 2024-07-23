const Product = require('../models/Product.js');

const create = (req, res) => {

    res.status(200).send("En el servidor");

}

module.exports = {
    create
};