const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* ─ helper: build a signed JWT ─ */
const signToken = (user) =>
    jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

/* ─ helper: strip password from user object ─ */
const sanitize = (user) => {
    const obj = user.toObject();
    delete obj.password;
    return obj;
};

// ─────────────────────────────────────
// 1. REGISTER
// ─────────────────────────────────────
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // --- Server-side validation ---
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Name, email, password and phone are all required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        // --- Check for duplicate email ---
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // --- Hash password ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Create & save user ---
        const user = await User.create({
            name:     name.trim(),
            email:    email.toLowerCase().trim(),
            password: hashedPassword,
            phone:    phone.trim(),
            role:     role || 'Tourist',
        });

        // --- Return token so front-end can auto-login ---
        const token = signToken(user);

        return res.status(201).json({
            message: 'Account created successfully!',
            token,
            role:  user.role,
            user:  sanitize(user),
        });

    } catch (error) {
        // Mongoose validation error (schema rules)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        // Duplicate key (unique index race condition)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Server error during registration. Please try again.' });
    }
};

// ─────────────────────────────────────
// 2. LOGIN
// ─────────────────────────────────────
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = signToken(user);

        return res.json({
            message: 'Login successful!',
            token,
            role: user.role,
            user: sanitize(user),
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login. Please try again.' });
    }
};

// ─────────────────────────────────────
// 3. GET PROFILE  (protected)
// ─────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware (contains userId)
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.json({ user });
    } catch (error) {
        console.error('GetProfile error:', error);
        return res.status(500).json({ message: 'Server error fetching profile.' });
    }
};
