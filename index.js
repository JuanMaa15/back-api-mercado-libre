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


const redirect_uri = `https://3fba-190-0-247-116.ngrok-free.app/mercado-libre`;
app.get('/', (req, res) => {

    res.redirect(`https://auth.mercadolibre.com.co/authorization?response_type_code=code&client_id=${ process.env.ML_APP_ID }`);
    
});

// Ruta para generar el access_token
app.get('/mercado-libre', async(req, res) => {
    let code = req.query.code;
    let body = {
        grant_type: 'authorization_code',
        client_id: process.env.ML_APP_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_url
    };

    try {
        let response = await axios.post('https://api.mercadolibre.com/oauth/token', qs.stringify(body), {
            headers: {
                'accept': 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
    
        });
    
        const {accessToken} = await response.data;
        res.status(200).json({response: 'success', accessToken});
        
    } catch (error) {
        console.log(`Hay un error al acceder al token - error: ${error.message} `);
    }

});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

