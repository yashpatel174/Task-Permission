import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'user'],
        required: true
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    permission: {
        type: Map,
        of: Boolean
    }
});

export default mongoose.model('Users', userSchema);