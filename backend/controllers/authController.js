const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { client, databaseName } = require('../config/cosmosClient');
const usersContainer = client.database(databaseName).container('users');

exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  
  if ( !email || !password || !role ) return res.status(400).json({ message: 'All fields are required' });

  try {
    // Check if email already exists
    const { resources: existingUsers } = await usersContainer.items.query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }]
    }).fetchAll();

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      role
    };

    await usersContainer.items.create(user);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const { resources: users } = await usersContainer.items.query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }]
    }).fetchAll();

    const user = users[0];

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};


exports.getMe = (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' })
    }
  
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      res.json({ id: decoded.userId, username: decoded.username, role: decoded.role })
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
  

