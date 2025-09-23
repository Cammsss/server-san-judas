import { Schema, model } from "mongoose";

const postSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    content:{
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        red: 'User',
        required: true
    }
},{
     timestamps: true,
    versionKey: false
})
export default model('Post', postSchema)