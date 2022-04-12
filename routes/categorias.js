const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');

const validarCampos = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

// OBTENER TODAS LAS CATEGORIAS
router.get('/', obtenerCategorias);

//OBTENER UNA CATEGORIA POR ID
router.get('/:id',[
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

//CREAR UNA NUEVA CATEGORIA
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//ACTUALIZAR UNA CATEGORIA
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria);

//ELIMINAR UNA CATEGORIA
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria);

module.exports = router;