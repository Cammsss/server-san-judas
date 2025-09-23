import { Schema, model } from 'mongoose'

const commentSchema = new Schema ({
    text:{
     type: String,
    required: true,
     trim: true,
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        requiredim: true,
    },
    authot:{
         type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment '
    }]
},{
    timestamps: true,
    versionKey: false
})

export default model('Comment', commentSchema)