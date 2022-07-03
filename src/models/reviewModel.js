import mongoose from "mongoose"

const schema = mongoose.Schema

const reviewModel = new schema({
    cart_id: {
        type: schema.Types.ObjectId,
        required: "enter cart_id",
    },
    know: {
        type: Boolean,
        required: "enter know",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default reviewModel