import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
    {
        name: String,
        s3Key: String,
        s3Url: String,
        owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    {timestamps: true}
)

export default mongoose.model('File', fileSchema);