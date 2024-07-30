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
const redirect_uri = 'https://a821-190-0-247-116.ngrok-free.app/mercado-libre'; 

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


app.get('/categorizar', async(req, res) => {

    try {
        let response = await axios.get('https://api.mercadolibre.com/sites/MCO/categories', {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
    
        const data = await response.data;
    
        res.status(200).json({ response: 'success', numero: data.length, data });
        
    } catch (error) {   
        console.log('Hay un error al traer las categorías - error: ' + error.Message);
        res.status(404).json( {
            response: 'Error',
            messagge: error.Message
        })
    }
});

app.get('/detalle-categoria', async(req, res) => {
    try {
        /* MCO1368 */
        const response = await axios.get('https://api.mercadolibre.com/categories/MCO441864', {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
        const data = response.data;

        res.status(200).json({
            response: 'success',
            cantidad: data.length,
            data
            
        });


    } catch (error) {
        console.log('Hay un error al traer el detalle de la categoría - error: ' + error.Message);
        res.status(404).json( {
            response: 'Error',
            messagge: error.Message
          })
    }
});

/* MCO441864 */
app.get('/busqueda-predictiva', async(req, res) => {

    try {
        const body = req.body;
    
        let response = await fetch(`https:/api.mercadolibre.com/sites/MCO/search?q=${ body.search_query }`, {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
    
        const data = await response.json();
        
            res.status(200).json({ response: 'success', numero: data.length, data });
        
    } catch (error) {
        console.log('Hay un error al traer la busqueda predictiva - error: ' + error.Message);
        res.status(404).json( {
            response: 'Error',
            messagge: error.Message
        })
    }


});

app.post('/create-product', async (req, res) => {
    
    let body = {
        title: 'Item de prueba - No ofertar',
        category_id: 'MCO1060',
        price: 23000,
        currency_id: 'COP',
        available_quantity: 10,
        buying_mode: 'buy_it_now',
        condition: 'new',
        listing_type_id: 'gold_special',
        pictures: [
            {
                'source': 'https://i.postimg.cc/qvvqGcn1/nikon-lente-hz.jpg'
            }
        ],
        attributes: [
            {
                id: 'BRAND',
                value_name: 'Casio'
            },
            {
                id: 'EAN',
                value_name: '7898095297749'
            }

        ]
            
        
    };

    try {
        const response = await fetch('https://api.mercadolibre.com/items', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            },
            body: JSON.stringify(body)
        });
     
        const data = await response.json();

        res.status(200).json({
            response: 'success',
            cantidad: data.length,
            data
            
        });
        
    } catch (error) {
        console.log('Hay un error al crear un producto - error: ' + error.Message);
        res.status(404).json( {
            response: 'Error',
            messagge: error.Message
        })
    }

});

/* app.get('/detalle-subcategoria', async(req, res) => {
    try {
        const response = await axios.get('https://api.mercadolibre.com/sites/MCO/search?category=MCO1039', {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
        const data = response.data;

        res.status(200).json({
            response: 'success',
            cantidad: data.length,
            data
            
        });


    } catch (error) {
        
    }
}) */

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

