const mongoose = require('mongoose');



const dbConnection = async() => {

    try {
        const URL = process.env.MONGODB_CNN;
         mongoose.connect(URL, {});

        console.log('DB conexion establecida');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos');
    }
}


module.exports = {
    dbConnection
}