const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.signup = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Username and password are required",
        }),
      };
    }

    const userItem = {
      TableName: "UsersTable",
      Item: {
        userId: uuidv4(),
        username: username,
        password: password,
      },
    };
    await docClient.put(userItem).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User created successfully!",
        user: userItem.Item,
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
