const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors("*"));
app.use(express.json());

let customers = [];
let nextId = 1;

app.post('/customers', (req, res) => {
  const { name, email, phone } = req.body;
  const customer = { id: nextId++, name, email, phone, createdAt: new Date().toISOString() };
  customers.push(customer);
  res.status(201).json(customer);
});

app.get('/customers', (req, res) => {
  res.json(customers);
});

app.delete('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  customers = customers.filter(c => c.id !== id);
  res.status(204).send();
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
