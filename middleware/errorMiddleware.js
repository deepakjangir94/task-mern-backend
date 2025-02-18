const errorHandler = (err, req, res, next) => {
    // const statusCode = res.statusCode ? res.satusCode: 500
    res.status(500);
    res.json({message: err.message});

}

module.exports = { errorHandler };