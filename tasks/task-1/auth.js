import jwt from "jsonwebtoken";

const secretKey = "my_secret_123"; // Change this with a secure secret key

// Dummy database for users
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint for user registration
const registerUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  // In a real scenario, you would hash the password before storing it in the database
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });
};

// Endpoint for user login
const loginUser = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user)
    return res.status(401).json({ message: "Invalid username or password" });

  const accessToken = jwt.sign({ username: user.username }, secretKey);
  res.json({ accessToken });
};

// Secure endpoint example
const protectedRoute = (req, res) => {
  const username = req?.user?.username;
  try {
    res.status(200).json({
      message: "This is a protected route",
      data: `this is your user name ${username}`,
    });
  } catch (error) {
    res.status(400).json({ message: "Access not authorized" });
  }
};

// Endpoint for user logout (optional)
const logoutUser = (req, res) => {
  res.json({ message: "User logged out successfully" });
};

// Initialize authentication routes
const initializeAuthRoutes = (app) => {
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - username
   *               - password
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request. Username and password are required.
   */
  app.post("/register", registerUser);

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Log in with username and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - username
   *               - password
   *     responses:
   *       200:
   *         description: User logged in successfully. Returns access token.
   *       401:
   *         description: Invalid username or password.
   */
  app.post("/login", loginUser);

  /**
   * @swagger
   * /task-4/protected:
   *   get:
   *     summary: Example of a protected route
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Returns a message indicating successful access to protected route.
   */
  app.get("/task-4/protected", authenticateToken, protectedRoute);

  /**
   * @swagger
   * /logout:
   *   post:
   *     summary: Log out the user
   *     responses:
   *       200:
   *         description: User logged out successfully.
   */
  app.post("/logout", logoutUser);
};

export default { initializeAuthRoutes };
