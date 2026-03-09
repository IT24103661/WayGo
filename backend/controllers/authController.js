const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- We added this!

// 1. REGISTER FUNCTION (Already working!)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name, email, password: hashedPassword, role: role || 'Tourist', phone
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error during registration');
    }
};

// 2. LOGIN FUNCTION (New!)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches the scrambled one in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create the VIP Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.json({ message: 'Login successful!', token, role: user.role });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error during login');
    }
};