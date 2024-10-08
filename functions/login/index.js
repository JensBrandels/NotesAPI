const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../../services/db");
const { sendResponse, sendError } = require("../../responses/index");

async function checkPassword(password, user) {
  console.log("password, user", password, user);
  const isCorrect = await bcrypt.compare(password, user.password); //this is the hashedpassword saved as password inside the userObject
  console.log("isCorrect", isCorrect);
  return isCorrect;
}

function signToken(user) {
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
    expiresIn: 3600, // Går ut om 60 min
  });
  console.log("token", token);

  return token;
}

const getUser = async (username) => {
  console.log("username", username);
  const { Items } = await db.query({
    TableName: "UsersTable",
    IndexName: "UsernameIndex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  });
  console.log("QueryItems", Items);
  return Items[0];
};

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    const user = await getUser(username);
    console.log("user", user);

    if (!user) {
      return sendError(401, "Wrong username or password");
    }

    const correctPassword = await checkPassword(password, user);
    console.log("correctPassword", correctPassword);

    if (!correctPassword) return sendError(401, "Wrong username or password");

    const token = signToken(user);

    return sendResponse({ success: true, token: token });
  } catch (error) {
    return sendError(500, error.message);
  }
};
