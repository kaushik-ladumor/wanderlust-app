const express = require('express');
const route = express.Router();
const User = require('../models/user');
const { isAdmin } = require('../middleware/Admin');
const { deleteUserAndRelatedData } = require('../controllers/auth');

// Show all users
route.get('/admin', isAdmin, async (req, res) => {
    const users = await User.find({});
    res.render('admin/HandleUser', { users });
});

// POST route (optional)
route.post('/users/:id/delete', isAdmin, deleteUserAndRelatedData);

// DELETE route (used by modal form)
route.delete('/admin/users/:id', isAdmin, deleteUserAndRelatedData);

module.exports = route;
