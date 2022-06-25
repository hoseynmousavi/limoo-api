import mongoose from "mongoose"

const schema = mongoose.Schema

const packModel = new schema({
    name: {
        type: String,
        maxLength: 50,
    },
    user_id: {
        type: schema.Types.ObjectId,
        required: "enter user_id",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default packModel