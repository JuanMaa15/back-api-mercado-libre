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
const { default: axios } = require('axios');

app.use('/mercado-libre/product', routes_product);


//const redirect_uri = `https://3fba-190-0-247-116.ngrok-free.app/mercado-libre`;
//https://bc34-190-0-247-116.ngrok-free.app/mercado-libre
const redirect_uri = 'https://bc34-190-0-247-116.ngrok-free.app/mercado-libre'; 

app.get('/', (req, res) => {

    res.redirect(`https://auth.mercadolibre.com.co/authorization?response_type=code&client_id=${ process.env.ML_APP_ID }&redirect_uri=${redirect_uri}`);
    
});

// Ruta para generar el access_token
app.get('/mercado-libre', async(req, res) => {
    let code = req.query.code;
    let body = {
        grant_type: 'authorization_code',
        client_id: process.env.ML_APP_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri
    };

    try {
        /*qs.stringify(body) */
        let response = await axios.post('https://api.mercadolibre.com/oauth/token', body, {
            headers: {
                'accept': 'application/json',
                'content-type' : 'application/x-www-form-urlencoded',
            },
            
    
        });

        /* let response = await fetch('https://api.mercadolibre.com/oauth/token', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type' : 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body)
    
        }); */
    
    
       //const data = await response.json();
       const {access_token} = await response.data;
       //const data = await response.json();
        res.status(200).json({response: 'success', access_token});
        
    } catch (error) {
        console.log(`Hay un error al acceder al token - error: ${error.message} `);
    }

});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

