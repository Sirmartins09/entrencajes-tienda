const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Inicializar Mercado Pago
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: 'APP_USR-8661295272149662-081112-d1622ac7b81aa4ba517fcc4ed8260fe3-218911674'
});

app.post('/crear-preferencia', (req, res) => {
  const carrito = req.body;

  const items = carrito.map(producto => ({
    title: producto.name,
    quantity: producto.quantity,
    unit_price: producto.price,
    currency_id: 'ARS'
  }));

  const preference = {
    items,
    back_urls: {
      success: 'https://tuweb.com/success',
      failure: 'https://tuweb.com/failure',
      pending: 'https://tuweb.com/pending'
    },
    auto_return: 'approved'
  };

  mp.preference.create(preference)
    .then(response => {
      res.json({ init_point: response.body.init_point });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Error al crear preferencia' });
    });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});