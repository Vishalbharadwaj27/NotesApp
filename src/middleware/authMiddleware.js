// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Get the token from the header
    // Headers usually look like: { Authorization: "Bearer <token>" }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    // Extract the token string (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach user data to the request object
        req.user = decoded; // Now we can access req.user.userId in controllers
            
        // 4. Move to the next function (the controller)
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;