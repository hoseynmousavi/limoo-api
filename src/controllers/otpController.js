import otpModel from "../models/otpModel"
import mongoose from "mongoose"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import createSuccessRespond from "../helpers/createSuccessRespond"
import sendSMS from "../helpers/sendSMS"
import data from "../data"
import userController from "./userController"

const otpTb = mongoose.model("otp", otpModel)

const minutes = 2

function getOtp(req, res)
{
    const {phone} = req.body
    otpTb.findOne({phone})
        .then(preOtp =>
        {
            if (!preOtp) _sendOtp({phone, res})
            else
            {
                const diffInSeconds = Math.floor((new Date() - preOtp.created_date) / 1000)
                const diffInMinutes = Math.floor(diffInSeconds / 60)
                if (diffInMinutes >= minutes)
                {
                    otpTb.deleteOne({phone})
                        .then(() =>
                        {
                            _sendOtp({phone, res})
                        })
                        .catch(err =>
                        {
                            createErrorText({res, status: 500, message: respondTextConstant.error.createOtp, detail: err})
                        })
                }
                else
                {
                    const allSeconds = minutes * 60 - diffInSeconds
                    const minutes = Math.floor(allSeconds / 60)
                    const seconds = allSeconds % 60
                    createSuccessRespond({res, message: respondTextConstant.success.otpSentBefore, data: {minutes, seconds}})
                }
            }
        })
        .catch(err =>
        {
            createErrorText({res, status: 500, message: respondTextConstant.error.createOtp, detail: err})
        })
}

function _sendOtp({phone, res})
{
    const newOtp = new otpTb({code: Math.floor(Math.random() * 8999) + 1000, phone})
    newOtp.save((err, created) =>
    {
        if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createOtp, detail: err})
        else
        {
            const {code, phone} = created
            sendSMS({token: code, template: data.kavenegarOtpTemplate, receptor: phone})
                .then(() => createSuccessRespond({res, message: respondTextConstant.success.otpSent, data: {minutes, seconds: 0}}))
                .catch(err => createErrorText({res, status: 500, message: respondTextConstant.error.kavenegarSendOtp, detail: err?.response?.data}))
        }
    })
}

function verifyOtp(req, res)
{
    const {phone, code} = req.body
    otpTb.findOne({phone, code})
        .then(founded =>
        {
            if (!founded) createErrorText({res, status: 400, message: respondTextConstant.error.verifyOtpNotFound})
            else
            {
                otpTb.deleteOne({phone})
                    .then(() =>
                    {
                        userController.createOrGetUser(req, res)
                    })
                    .catch(err =>
                    {
                        createErrorText({res, status: 500, message: respondTextConstant.error.createOtp, detail: err})
                    })
            }
        })
        .catch(err =>
        {
            createErrorText({res, status: 500, message: respondTextConstant.error.verifyOtp, detail: err})
        })
}

const otpController = {
    getOtp,
    verifyOtp,
}

export default otpController