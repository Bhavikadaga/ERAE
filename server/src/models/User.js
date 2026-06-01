const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'superadmin'],
        default: 'customer'
    },
    addresses: [
        {
            label: String,
            street: String,
            city: String,
            state: State,
            pincode: String,
            isDefault: {type: Boolean, default: false}
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

// Hash pass before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.has(this.password, 12)
    next()
})

// compare password 
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.export = mongoose.model('User', userSchema)