const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Check if the user brought a wristband (Token) in their request headers
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No VIP wristband provided! 🛑' });
    }

    try {
        // 2. Extract the actual token string (ignoring the word "Bearer ")
        const token = authHeader.split(' ')[1];

        // 3. Verify the token using our secret key from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. If it's real, attach the user's ID and Role to the request and let them pass!
        req.user = decoded;
        next(); // This tells the server to move on to the actual route

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired wristband! 🛑' });
    }
};

module.exports = { protect };