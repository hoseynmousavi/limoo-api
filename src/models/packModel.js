import mongoose from "mongoose"

const schema = mongoose.Schema

const packModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "enter user_id",
    },
    name: {
        type: String,
        maxLength: 50,
        required: "enter name",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default packModel