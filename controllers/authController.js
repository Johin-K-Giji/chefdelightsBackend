// authController.js

exports.login = (req, res) => {
    const { username, password } = req.body;
  
    // Hardcoded credentials
    const hardcodedUsername = "admin";
    const hardcodedPassword = "password123";
  
    if (username === hardcodedUsername && password === hardcodedPassword) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  };
  