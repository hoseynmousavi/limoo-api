import mongoose from "mongoose"
import userModel from "../models/userModel"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import createSuccessRespond from "../helpers/createSuccessRespond"
import tokenHelper from "../helpers/tokenHelper"
import data from "../data"
import checkPermission from "../helpers/checkPermission"

const userTb = mongoose.model("user", userModel)

function _getUserById({_id})
{
    return userTb.findOne({_id})
}

function getUserByToken(req, res)
{
    checkPermission({req, res}).then(user => createSuccessRespond({res, data: user}))
}

function createOrGetUser(req, res)
{
    const {phone} = req.body
    userTb.findOne({phone})
        .then(founded =>
        {
            if (!founded)
            {
                const newUser = new userTb({phone})
                newUser.save((err, user) =>
                {
                    if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createUser, detail: err})
                    else _sendUser({res, user, is_sign_up: true})
                })
            }
            else _sendUser({res, user: founded, is_sign_up: false})
        })
        .catch(err =>
        {
            createErrorText({res, status: 500, message: respondTextConstant.error.verifyOtp, detail: err})
        })
}

function _sendUser({res, user, is_sign_up})
{
    const {_id} = user
    tokenHelper.encodeToken({_id})
        .then(token =>
        {
            // TODO refreshToken is bullshit
            createSuccessRespond({res, data: {user, is_sign_up, token, refresh_token: data.tokenSign}, message: respondTextConstant.success[is_sign_up ? "createdUser" : "loginUser"]})
        })
        .catch(err =>
        {
            createErrorText({res, status: 400, message: respondTextConstant.error.createToken, detail: err})
        })
}

function updateUser(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {first_name, last_name, email, gender, birth_date} = req.body
            const {_id} = user
            userTb.findOneAndUpdate({_id}, {first_name, last_name, email, gender, birth_date}, {new: true, useFindAndModify: false, runValidators: true})
                .then(updated =>
                {
                    createSuccessRespond({res, data: updated, message: respondTextConstant.success.updateUser})
                })
                .catch(err =>
                {
                    createErrorText({res, status: 400, message: respondTextConstant.error.updateUser, detail: err})
                })
        })
}

function updateAvatar(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id} = user
            const avatar = req?.files?.avatar
            _saveAvatar({avatar, res})
                .then(avatarUrl =>
                {
                    userTb.findOneAndUpdate({_id}, {avatar: avatarUrl}, {new: true, useFindAndModify: false, runValidators: true})
                        .then(updated =>
                        {
                            createSuccessRespond({res, data: updated, message: respondTextConstant.success.updateUser})
                        })
                        .catch(err =>
                        {
                            createErrorText({res, status: 400, message: respondTextConstant.error.updateUser, detail: err})
                        })
                })
        })
}

function _saveAvatar({avatar, res})
{
    return new Promise(resolve =>
    {
        if (avatar)
        {
            const avatarName = new Date().toISOString() + avatar.name.replace(/ /g, "")
            const avatarUrl = `media/pictures/${avatarName}`
            avatar.mv(avatarUrl, err =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.updateUser, detail: err})
                else resolve(avatarUrl)
            })
        }
        else resolve(null)
    })
}

const userController = {
    getUserByToken,
    _getUserById,
    createOrGetUser,
    updateUser,
    updateAvatar,
}

export default userController