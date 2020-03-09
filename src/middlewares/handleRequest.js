module.exports = (request, response, next) => {
  response.return = (data, code) => response.status(code).json(data);

  response.returnError = error => {
    const { msg = "Unexpected error", code = 500 } = error;

    response.status(code).json({
      error: msg,
      status: code
    });

    console.error(error);
  };

  next();
};
