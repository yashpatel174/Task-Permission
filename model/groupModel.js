import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    permissions: [{type: String}]
})

export default mongoose.model('Group', groupSchema);