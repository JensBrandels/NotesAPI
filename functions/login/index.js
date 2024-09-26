const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../../services/db");
const { sendResponse, sendError } = require("../../responses/index");

async function checkPassword(password, user) {
  const isCorrect = await bcrypt.compare(password, user.password); //this is the hashedpassword saved as password inside the userObject

  return isCorrect;
}

function signToken(user) {
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
    expiresIn: 3600, // Går ut om 60 min
  });

  return token;
}

const getUser = async (userId) => {
  const { Item } = await db.get({
    TableName: "UsersTable",
    Key: {
      userId: userId,
    },
  });

  return Item;
};

exports.handler = async (event) => {
  const { userId, password } = JSON.parse(event.body);

  const user = await getUser(userId);

  if (!user) {
    return sendError(401, "Wrong username or password");
  }

  const correctPassword = await checkPassword(password, user);

  if (!correctPassword) return sendError(401, "Wrong username or password");

  const token = signToken(user);

  return sendResponse({ success: true, token: token });
};
