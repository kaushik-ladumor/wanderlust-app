const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,

}, { timestamps: true });

// Use email as username
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model("User", userSchema);
module.exports = User;
