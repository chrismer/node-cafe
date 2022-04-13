const fs = require('fs');
const { response } = require("express");
const  path  = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers/subir-archivo");
const {Usuario, Producto} = require('../models/');

const cargarArchivo = async(req, res = response) => {

    try {

        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'img');
        res.json({nombre});
    
    } catch (msg) {
        res.status(400).json({msg});
    }

}

const actualizarImagen = async(req, res = response) => {
    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(404).json({msg: 'No existe el usuario'});
                
            }
            
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({msg: 'No existe el producto'});
                
            }
            
            break;
    
        default:
            return res.status(500).json({msg: 'Coleccion no validada'});
    }

    //limpiar imagenes previas
    if(modelo.img){
        //hay q borrar la img del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCluodinary = async(req, res = response) => {
    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(404).json({msg: 'No existe el usuario'});
                
            }
            
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({msg: 'No existe el producto'});
                
            }
            
            break;
    
        default:
            return res.status(500).json({msg: 'Coleccion no validada'});
    }

    //limpiar imagenes previas
    if(modelo.img){
        //hay q borrar la img del servidor cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {
    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(404).json({msg: 'No existe el usuario'});

            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({msg: 'No existe el producto'});

            }

            break;

        default:
            return res.status(500).json({msg: 'Coleccion no validada'});
    }

    //limpiar imagenes previas
    if(modelo.img){
        //hay q borrar la img del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCluodinary
}