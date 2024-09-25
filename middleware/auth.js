const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace("Bearer ", "");
      if (!token) throw Error();

      const data = jwt.verify(token, process.env.SECRET);
      request.event.username = data.username;

      return request.response;
    } catch (error) {}
  },
};

module.exports = { validateToken };
