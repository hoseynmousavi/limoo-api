import mongoose from "mongoose"

const schema = mongoose.Schema

const reviewModel = new schema({
    cart_id: {
        type: schema.Types.ObjectId,
        required: "enter cart_id",
    },
    user_id: {
        type: schema.Types.ObjectId,
        required: "enter user_id",
    },
    know: {
        type: Boolean,
        required: "enter know",
    },
    before_index: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: "enter before_index",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default reviewModel