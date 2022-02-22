const mongoose = require('mongoose');
const app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ControlEmpresas', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se ha conectado correctamente a la base de datos.');

    app.listen(3001, function () {
        console.log("Servidor de Express corriendo correctamente en el puerto 3001");
    });
}).catch(error => console.log(error));