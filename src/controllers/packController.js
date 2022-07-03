import mongoose from "mongoose"
import packModel from "../models/packModel"
import checkPermission from "../helpers/checkPermission"
import createErrorText from "../helpers/createErrorText"
import createSuccessRespond from "../helpers/createSuccessRespond"
import respondTextConstant from "../constants/respondTextConstant"
import cartController from "./cartController"

const packTb = mongoose.model("pack", packModel)

function _getPacks({query, projection, options})
{
    return packTb.find(query, projection, options)
}

function getPack(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            packTb.find({user_id})
                .then(packs =>
                {
                    cartController._getCartsCount({pack_id: packs.reduce((sum, item) => [...sum, item._id], [])})
                        .then(cartsCount =>
                        {
                            const cartsCountObj = cartsCount.reduce((sum, item) => ({...sum, [item._id]: item.count}), {})
                            packs.forEach((item, index) =>
                            {
                                packs[index] = {...item.toJSON(), carts_count: cartsCountObj[item._id] || 0}
                            })
                            createSuccessRespond({res, data: packs})
                        })
                })
                .catch(err =>
                {
                    createErrorText({res, status: 400, message: respondTextConstant.error.getPacks, detail: err})
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
            const newPack = new packTb({user_id, name})
            newPack.save((err, pack) =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createPack, detail: err})
                else createSuccessRespond({res, data: {...pack.toJSON(), carts_count: 0}, message: respondTextConstant.success.packAdded})
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
            packTb.deleteOne({user_id, _id: pack_id})
                .then(() =>
                {
                    createSuccessRespond({res, message: respondTextConstant.success.packRemoved})
                    cartController._deletePackCarts({pack_id})
                })
                .catch(err =>
                {
                    createErrorText({res, status: 400, message: respondTextConstant.error.deletePack, detail: err})
                })
        })
}

const packController = {
    _getPacks,
    getPack,
    addPack,
    deletePack,
}

export default packController