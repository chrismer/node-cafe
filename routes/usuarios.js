
const {Router} = require('express');
const { check } = require('express-validator');


const {usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch} = require('../controllers/usuarios');

const { esRoleValido, emailExiste, existeUsuarioPorId,  } = require('../helpers/db-validators');

const validarCampos = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {
    validarJWT,
    esAdminRole,
    tieneRole,
} = require('../middlewares');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom(esRoleValido),
    validarCampos
],usuariosPut);

router.post('/',[
    check('email', 'El email no es valido').isEmail(),
    check('email').custom(emailExiste),
    check('password', 'El password debe tener minimo 6 caracteres').isLength({min: 6}),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('role', 'No es un Rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(esRoleValido),
    validarCampos
],usuariosPost);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] ,usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;