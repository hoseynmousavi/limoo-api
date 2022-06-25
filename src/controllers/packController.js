import mongoose from "mongoose"
import packModel from "../models/packModel"
import checkPermission from "../helpers/checkPermission"
import createErrorText from "../helpers/createErrorText"
import createSuccessRespond from "../helpers/createSuccessRespond"
import respondTextConstant from "../constants/respondTextConstant"

const packTb = mongoose.model("user", packModel)

function getPack(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            packTb.find({user_id})
                .then((packs, err) =>
                {
                    if (err) createErrorText({res, status: 400, message: respondTextConstant.error.getPacks, detail: err})
                    else createSuccessRespond({res, data: packs})
                })
        })
}

function addPack(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            const {name} = req.body
            const newPack = new packTb({name, user_id})
            newPack.save((err, pack) =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createPack, detail: err})
                else createSuccessRespond({res, data: pack, message: respondTextConstant.success.packAdded})
            })
        })
}

function deletePack(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            const {pack_id} = req.body
            packTb.deleteOne({user_id, _id: pack_id}, err =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.deletePack, detail: err})
                else createSuccessRespond({res, message: respondTextConstant.success.packRemoved})
            })
        })
}

const packController = {
    getPack,
    addPack,
    deletePack,
}

export default packController