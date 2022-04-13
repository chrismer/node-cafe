const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            authPath:       '/api/auth',
            buscar:         '/api/buscar',
            authCategorias: '/api/categorias',
            productos:      '/api/productos',
            usuariosPath:   '/api/usuarios',
            uploads:        '/api/uploads'
        }


        //CONECTAR A BASE DE DATOS
        this.conectarDB();

        //Midlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        //LECTURA Y PARSEO DEL BODY
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));

        //FILEUPLOAD - CARGA DE ARCHIVOS
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.authPath, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.authCategorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
    }
}

module.exports = Server;