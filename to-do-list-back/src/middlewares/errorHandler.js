const errHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = null;

    if (err.name === "NotFoundError" || err.statusCode === 404) {
        statusCode = 404;
        message = 'Recurso no encontrado';
    }

    // ERRORES DE VALIDACIÓN DE EXPRESS-VALIDATOR
    if(Array.isArray(err.errors) && err[0].msg) {
        statusCode = 400;
        message = 'Error en la solicitud';
        errors = err.errors.map(e => ({ field: e.param, message: e.msg }));
    }

    // ERRORES DE BASE DE DATOS
    if (err.code) {
        errors = {detail: err.detail || 'Error en la base de datos'};
        switch (err.code) {
            case '23505': 
                statusCode = 409;
                message = 'El registro ya existe';
                break;
            case '23503' | '23502': 
                statusCode = 400;
                message = 'Error en los datos proporcionados';
                break;
            default:
                statusCode = 500;
                message = 'Error en la base de datos';
        }

    }

    res.status(statusCode).json({
        status: 'error',
        message,
        ...errors && { errors },
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
}

export default { errHandler };