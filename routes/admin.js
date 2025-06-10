const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isAdmin } = require('../middleware/Admin'); // ✅ Fixed import
const { deleteUserAndRelatedData } = require('../controllers/auth');

// Admin Panel - Show all users
router.get('/admin', isAdmin, async (req, res) => {
    const users = await User.find({});
    res.render('admin/HandleUser', { users });
});

// Delete user via POST
router.post('/users/:id/delete', isAdmin, deleteUserAndRelatedData);

// Delete user via DELETE (optional)
router.delete('/admin/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting their own account
    if (req.user._id.equals(id)) {
        req.flash("error", "You can't delete yourself.");
        return res.redirect('/admin');
    }

    await User.findByIdAndDelete(id);
    req.flash("success", "User deleted.");
    res.redirect('/admin');
});

module.exports = router;
