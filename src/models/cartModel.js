import mongoose from "mongoose"

const schema = mongoose.Schema

const cartModel = new schema({
    pack_id: {
        type: schema.Types.ObjectId,
        required: "enter pack_id",
    },
    front: {
        type: String,
        maxLength: 50,
        required: "enter front",
    },
    back: {
        type: String,
        maxLength: 50,
        required: "enter back",
    },
    back_description: {
        type: String,
        maxLength: 200,
    },
    last_review_date: {
        type: Date,
    },
    index: {
        type: Number,
        default: 1,
        enum: [1, 2, 3, 4, 5, 6], // 6 is archived
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default cartModel