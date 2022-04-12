const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models/');

const esRoleValido = async(rol = '')=>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async(email = '')=>{
    const existeEmail = await Usuario.findOne({email});
    if (existeEmail){
        throw new Error(`El email '${email}' ya esta registrado`);
    }
}

const existeUsuarioPorId = async(id)=>{
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El id '${id}' no existe`);
    }
}

//VALIDAR CATEGORIAS
const existeCategoriaPorId = async(id)=>{
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`La categoria '${id}' no existe`);
    }
}

//VALIDAR PRODUCTOS
const existeProductoPorId = async(id)=>{
    const existeProducto = await Producto.findById(id);
    if (!existeProducto){
        throw new Error(`La categoria '${id}' no existe`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}
