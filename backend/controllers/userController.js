const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {};

userController.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id }, 'secret_key');
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

userController.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            throw new Error('Invalid login credentials');
        }
        const token = jwt.sign({ _id: user._id }, 'secret_key');
        res.json({ user, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = userController;
