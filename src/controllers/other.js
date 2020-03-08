module.exports = {
  index(request, response) {
    return response.status(200).send({
      message: "..."
    });
  }
};
