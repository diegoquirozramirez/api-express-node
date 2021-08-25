const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routerCliente = require('./routes/cliente.route');

app.use(express.json());
app.use('/cliente', routerCliente);

app.listen(port, function () {
    console.log('Running on port : ' + port);
})