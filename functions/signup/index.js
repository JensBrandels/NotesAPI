const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { db } = require("../../services/db");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

exports.handler = async (event) => {
  try {
    const { username, password, email, firstname, lastname } = JSON.parse(
      event.body
    );

    if (!username || !password || !email || !firstname || !lastname) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "All fields are required!",
        }),
      };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db.put({
      TableName: "UsersTable",
      Item: {
        userId: uuidv4(),
        username: username,
        password: hashedPassword,
        email: email,
        firstname: firstname,
        lastname: lastname,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User created successfully!",
        user: newUser.Item,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred.",
        error: error.message,
      }),
    };
  }
};
