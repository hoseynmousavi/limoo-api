import checkPermission from "../helpers/checkPermission"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import createSuccessRespond from "../helpers/createSuccessRespond"
import mongoose from "mongoose"
import cartModel from "../models/cartModel"
import packController from "./packController"
import createBeforeDate from "../helpers/createBeforeDate"

const cartTb = mongoose.model("cart", cartModel)

function _getCartsCount({pack_id})
{
    return cartTb.aggregate([
        {$match: {pack_id: {$in: pack_id}}},
        {$group: {_id: "$pack_id", count: {$sum: 1}}},
    ])
}

function getReviewCarts(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            packController._getPacks({query: {user_id}, projection: "_id"})
                .then(packIds =>
                {
                    const pack_id = packIds.reduce((sum, item) => [...sum, item._id], [])
                    Promise.all([
                        cartTb.find({
                            pack_id: {$in: pack_id},
                            $or: [
                                {index: 2, last_review_date: {$gte: createBeforeDate({dayBefore: 4})}},
                                {index: 3, last_review_date: {$gte: createBeforeDate({dayBefore: 8})}},
                                {index: 4, last_review_date: {$gte: createBeforeDate({dayBefore: 16})}},
                                {index: 5, last_review_date: {$gte: createBeforeDate({dayBefore: 32})}},
                            ],
                        }),
                        cartTb.find(
                            {
                                pack_id: {$in: pack_id},
                                $or: [
                                    {index: 1, last_review_date: undefined, created_date: createBeforeDate({dayBefore: 2})},
                                    {index: 1, last_review_date: {$gte: createBeforeDate({dayBefore: 2})}},
                                ],
                            },
                            null,
                            {limit: 20},
                        ),
                    ])
                        .then(([requiredCarts, newCarts]) =>
                        {
                            createSuccessRespond({res, data: {requiredCarts, newCarts}})
                        })
                        .catch(err =>
                        {
                            createErrorText({res, status: 400, message: respondTextConstant.error.getCarts, detail: err})
                        })
                })
                .catch(err =>
                {
                    createErrorText({res, status: 400, message: respondTextConstant.error.getCarts, detail: err})
                })
        })
}

function addCart(req, res)
{
    checkPermission({req, res})
        .then(() =>
        {
            const {pack_id, front, back} = req.body
            const newCart = new cartTb({pack_id, front, back})
            newCart.save((err, cart) =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createCart, detail: err})
                else createSuccessRespond({res, data: cart, message: respondTextConstant.success.cartAdded})
            })
        })
}

function editCart(req, res)
{
    checkPermission({req, res})
        .then(() =>
        {
            const {cart_id, front, back} = req.body
            cartTb.findOneAndUpdate({_id: cart_id}, {front, back}, {new: true, useFindAndModify: false, runValidators: true})
                .then(updated =>
                {
                    createSuccessRespond({res, data: updated, message: respondTextConstant.success.updateCart})
                })
                .catch(err =>
                {
                    createErrorText({res, status: 400, message: respondTextConstant.error.updateCart, detail: err})
                })
        })
}

function deleteCart(req, res)
{
    checkPermission({req, res})
        .then(() =>
        {
            const {cart_id} = req.body
            cartTb.deleteOne({_id: cart_id})
                .then(() => createSuccessRespond({res, message: respondTextConstant.success.cartRemoved}))
                .catch(err => createErrorText({res, status: 400, message: respondTextConstant.error.deleteCart, detail: err}))
        })
}

function _deletePackCarts({pack_id})
{
    cartTb.deleteMany({pack_id}).then(() => console.log(`delete carts for pack: ${pack_id}`))
}

const cartController = {
    _getCartsCount,
    getReviewCarts,
    addCart,
    editCart,
    deleteCart,
    _deletePackCarts,
}

export default cartController