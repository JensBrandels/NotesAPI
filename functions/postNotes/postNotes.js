exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { username, password, email, firstname, lastname } = body;

    if (!username || !password || !email || !firstname || !lastname) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "All fields are required!",
        }),
      };
    }

    const hashedPassword = await hashPassword(password);

    const userItem = {
      TableName: "UsersTable",
      Item: {
        userId: uuidv4(),
        username: username,
        password: hashedPassword,
        email: email,
        firstname: firstname,
        lastname: lastname,
      },
    };
    await docClient.put(userItem).promise(); //kasta in det i databasen

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
