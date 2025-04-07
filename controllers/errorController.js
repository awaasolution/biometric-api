exports.globalErrroHandler = async (err, req, res, next)=>{
    if(err.isOperational){
        return res.status(err.statusCode).json(
            {
                error: `${err.status}`,
                message: err.message,
            }
        )
    }
    console.log(err)
    res.status(500).json(
        {
            error: "server error",
            message: "this is not known error, contact the api developer",
            detail: err
        }
    )
}