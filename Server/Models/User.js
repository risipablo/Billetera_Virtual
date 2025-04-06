const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,  
    },
    name: { 
        type: String, 
        required: true, 
        unique: true
     },
    password: { 
        type: String, 
        required: true,
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        validate: {
            validator: function(value) {
                return /[A-Z]/.test(value);
            },
            message: 'La contraseña debe contener al menos una letra mayúscula'
        }
    },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    },
});


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;