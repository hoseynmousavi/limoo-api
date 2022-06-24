import mongoose from "mongoose"
import regexConstant from "../constants/regexConstant"

const schema = mongoose.Schema

const otpModel = new schema({
    code: {
        type: String,
        required: "enter code",
    },
    phone: {
        type: String,
        match: [regexConstant.PHONE_REGEX, "enter valid phone"],
        required: "enter phone",
        unique: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default otpModel