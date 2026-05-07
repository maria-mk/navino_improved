const express = require('express');
const cors = require('cors');

const { products } = require('./products');
const { stores } = require('./stores');
const { prices } = require('./prices');
const { reviews } = require('./reviews');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/v1/products', (_, response) => {
    const data = products.getAll();
    
    response.json(data);
});

app.get('/api/v1/products/:id', (request, response) => {
    const { id } = request.params;
    const data = products.getById(id);

    if (!data) {
        response.status(404).json({ code: 'NOT_FOUND' });

        return;
    }
    
    response.json(data);
});

app.get('/api/v1/stores', (_, response) => {
    const data = stores.getAll();
    
    response.json(data);
});

app.get('/api/v1/stores/:id', (request, response) => {
    const { id } = request.params;
    const data = stores.getById(id);

    if (!data) {
        response.status(404).json({ code: 'NOT_FOUND' });

        return;
    }
    
    response.json(data);
});

app.get('/api/v1/prices', (_, response) => {
    const data = prices.getAll();
    
    response.json(data);
});

app.get('/api/v1/prices/:id', (request, response) => {
    const { id } = request.params;
    const data = prices.getById(id);

    if (!data) {
        response.status(404).json({ code: 'NOT_FOUND' });

        return;
    }
    
    response.json(data);
});

app.get('/api/v1/reviews/:id', (request, response) => {
    const { id } = request.params;
    const data = reviews.getById(id);

    if (!data) {
        response.status(404).json({ code: 'NOT_FOUND' });

        return;
    }
    
    response.json(data);
});

app.post('/api/v1/reviews', (request, response) => {
    const { product_id, name, text, rating } = request.body;

    if (!product_id || !name || !text || !rating) {
        response.status(422).json({ code: 'INCOMPLETE_REQUEST' });

        return;
    }

    const data = reviews.create({product_id, name, text, rating });

    response.status(201).json(data);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Сервер запущен на http://localhost:${port}`);
    });
}

module.exports = app;