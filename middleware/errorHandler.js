const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.message || 'Erreur interne du serveur'
  };

  // Stack trace en mode développement
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;