import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    
    moduleName: {
        type: String,
        required: true,
        unique: true
    },

    moduleId: {
        type: Number,
        required: true,
        unique: true
    }

})

export default mongoose.model("Modules", moduleSchema)