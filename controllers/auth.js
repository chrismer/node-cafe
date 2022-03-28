const bcryptjs = require("bcryptjs");
const { response } = require("express");

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const googleVerify = require("../helpers/google-verify");


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

const googleSignIn = async(req, res = response) => {
    
        const {id_token} = req.body;

        try {

            const {email, nombre, img} = await googleVerify(id_token);
            // console.log(googleUser);
            let usuario = await Usuario.findOne({email});

            if(!usuario){
                // tengo que crearlo
                const data = {
                    nombre,
                    email,
                    img,
                    password: ':)',
                    google: true
                };

                usuario = new Usuario(data);
                await usuario.save();

            }

            //si el usuario  en DB 
            if(!usuario.estado){
                return res.status(401).json({
                    msg: 'Usuario o Password incorrectos - usuario bloqueado'
                });
            }

            //Genear el JWT 
            const token = await generarJWT(usuario.id);
            
            res.json({
                usuario,
                token
            });

        } catch (error) {
            res.status(400).json({
                msg: 'EL Token no se pudo verificar'
            });
        }
    
}

module.exports = {
    login,
    googleSignIn
}