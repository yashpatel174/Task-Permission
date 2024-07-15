import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['superAdmin', 'admin'],
        default: 'user'
    },
    permissions: {
        type: [String],
        defauolt: []
    },
    subUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

export default mongoose.model('Users', userSchema);