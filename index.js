const express = require('express');

//Crear servidor node
const app = express();
const puerto = 4005;

//Convertir body a objeo JS 
app.use( express.json() );

//Crear rutas
app.get('/', (req, res) => {

    res.status(200).send(`
        <h1>Hola</h1>
    `);

    
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});

