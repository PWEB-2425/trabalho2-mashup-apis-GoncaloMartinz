const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        minlength: 3
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    searches: [{
        term: String,
        date: { type: Date, default: Date.now }
    }]
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);