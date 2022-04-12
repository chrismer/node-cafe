const {Router} = require('express');
const {check} = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');

const validarCampos = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

// OBTENER TODAS LAS CATEGORIAS
router.get('/', obtenerProductos);

//OBTENER UNA CATEGORIA POR ID
router.get('/:id',[
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto);

//CREAR UNA NUEVA CATEGORIA
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],crearProducto);

//ACTUALIZAR UNA CATEGORIA
router.put('/:id',[
    validarJWT,
    // check('categoria', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto);

//ELIMINAR UNA CATEGORIA
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);

module.exports = router;