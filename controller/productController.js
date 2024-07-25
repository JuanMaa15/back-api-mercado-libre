const Product = require('../models/Product.js');
const axios = require('axios');

const create = (req, res) => {

    const data = req.body;

    console.log("Entro");
    res.send({
        data,
        message: "En el servidor",

     });
    
}

const getAPI = async(req, res) => {

    console.log("...procesando Datos");

    const response = await axios.get("");
    const {data} = response.data;

    console.log(data);
    
}

module.exports = {
    create,
    getAPI
};