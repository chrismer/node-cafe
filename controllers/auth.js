const bcryptjs = require("bcryptjs");
const { response } = require("express");

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");


const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        //VERIFICAR SI EXISTE MAIL
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario o Password incorrectos - email'
            });
        }

        //VERIFICAR SI EL USUARIO ESTA ACTIVO
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario o Password incorrectos - estado: false'
            });
        }

        //VERIFICAR SI EL PASSWORD ES CORRECTO
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario o Password incorrectos - password'
            });
        }

        //GENERAR EL TOKEN JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al autenticar usuario'
        });
    }

}

module.exports = {
    login
}