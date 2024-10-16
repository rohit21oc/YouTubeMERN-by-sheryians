const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/authtestapp`)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });

user = userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true, // Ensure usernames are unique
        trim: true // Remove whitespace from both ends
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        lowercase: true, // Convert to lowercase
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum length for password
    },
    age: {
        type: Number,
        min: 0 // Age cannot be negative
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});
module.exports = mongoose.model("user",userSchema)