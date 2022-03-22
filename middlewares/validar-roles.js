const {response} = require('express');

const esAdminRole = (req, res = response, next) => {
    // if (req.usuario.role === 'ADMIN_ROLE') {
    //     next();
    // } else {
    //     return res.status(401).json({
    //         msg: 'No tiene permiso para realizar esta accion'
    //     });
    // }
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const {role, nombre} = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no tiene permiso para realizar esta accion`
        });
    }
    next();
}


const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}