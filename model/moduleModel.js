import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        unique: true,
    },
    moduleId: {
        type: Number,
        unique: true,
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

export default mongoose.model('Module', moduleSchema);