import mongoose from "mongoose"
import regexConstant from "../constants/regexConstant"

const schema = mongoose.Schema

const userModel = new schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    daily_goal: {
        type: Number,
        default: 20,
    },
    phone: {
        type: String,
        match: [regexConstant.PHONE_REGEX, "enter valid phone"],
        unique: true,
        required: "enter phone",
    },
    avatar: {
        type: String,
    },
    first_name: {
        type: String,
        maxLength: 30,
    },
    last_name: {
        type: String,
        maxLength: 40,
    },
    email: {
        type: String,
        match: [regexConstant.EMAIL_REGEX, "enter valid email"],
        unique: true,
        sparse: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    birth_date: {
        type: Date,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel