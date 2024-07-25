const express = require('express');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

//Crear servidor node
const app = express();

//app.set('PORT', process.env.PORT || 4000);

//Convertir body a objeo JS 
app.use( express.json() );
app.use( express.urlencoded({ extended : true }) );

//Crear rutas
const routes_product = require('./routes/product');

app.use('/mercado-libre/product', routes_product);

app.get('/', (req, res) => {

    res.status(200).send(`
        <h1>Hola</h1>
    `);
    
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

