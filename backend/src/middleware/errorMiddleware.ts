
export const errorHandler = (err: any , req: any, next: any) =>{
    const statusCode = err.statusCode ? err.statusCode : 500
    req.status(statusCode);
    // req.json({
    //     message : err.message,
    //     stack : err.stack
    // })
    req.json({
      messagem: err.statusCode
        ? err.statusCode
        : `erro no middleware ${statusCode} - ${err} ||  ${err.message || err}`,
    });
}

