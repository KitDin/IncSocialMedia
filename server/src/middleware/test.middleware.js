const middlewareController = {
  testMiddleware(req, res, next) {
    try {
      next();
    } catch (error) {}
  },
};

export default middlewareController;
