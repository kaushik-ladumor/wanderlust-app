const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isAdmin } = require('../middleware/Admin');
const { deleteUserAndRelatedData } = require('../controllers/auth');

// Show all users
router.get('/admin', isAdmin, async (req, res) => {
    const users = await User.find({});
    res.render('admin/HandleUser', { users });
});

// POST route (optional)
router.post('/users/:id/delete', isAdmin, deleteUserAndRelatedData);

// DELETE route (used by modal form)
router.delete('/admin/users/:id', isAdmin, deleteUserAndRelatedData);

module.exports = router;
