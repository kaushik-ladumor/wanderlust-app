const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isAdmin } = require('../middleware/Admin');
const { deleteUserAndRelatedData } = require('../controllers/auth');

// Admin Panel - Show all users
router.get('/admin', isAdmin, async (req, res) => {
    const users = await User.find({});
    res.render('admin/HandleUser', { users });
});

// Delete user via POST (user and related data)
router.post('/users/:id/delete', isAdmin, deleteUserAndRelatedData);

// Delete user via DELETE (user and related data)
router.delete('/admin/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting their own account
    if (req.user && req.user._id.equals(id)) {
        req.flash("error", "You can't delete yourself.");
        return res.redirect('/admin');
    }

    try {
        // Use the same logic as controller
        await deleteUserAndRelatedData(req, res);
    } catch (error) {
        console.error("Error deleting user and related data via DELETE:", error);
        req.flash("error", "Failed to delete user.");
        res.redirect('/admin');
    }
});

module.exports = router;
