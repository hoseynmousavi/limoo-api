import checkPermission from "../helpers/checkPermission"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import createSuccessRespond from "../helpers/createSuccessRespond"
import mongoose from "mongoose"
import cartModel from "../models/cartModel"
import packController from "./packController"
import createBeforeDate from "../helpers/createBeforeDate"
import reviewController from "./reviewController"
import xlsx from "node-xlsx"

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
            const {_id: user_id, daily_goal} = user
            reviewController._getReviewCount({query: {user_id, before_index: 1, created_date: {$gte: createBeforeDate({dayBefore: 1})}}})
                .then(todayNewCartReviews =>
                {
                    const limit = daily_goal - todayNewCartReviews
                    packController._getPacks({query: {user_id}, projection: "_id"})
                        .then(packIds =>
                        {
                            const pack_id = packIds.reduce((sum, item) => [...sum, item._id], [])
                            Promise.all([
                                cartTb.find({
                                    pack_id: {$in: pack_id},
                                    $or: [
                                        {index: 2, last_review_date: {$lte: createBeforeDate({dayBefore: 2})}},
                                        {index: 3, last_review_date: {$lte: createBeforeDate({dayBefore: 4})}},
                                        {index: 4, last_review_date: {$lte: createBeforeDate({dayBefore: 8})}},
                                        {index: 5, last_review_date: {$lte: createBeforeDate({dayBefore: 16})}},
                                    ],
                                }),
                                limit &&
                                cartTb.find(
                                    {
                                        pack_id: {$in: pack_id},
                                        $or: [
                                            {index: 1, last_review_date: undefined, created_date: {$lte: createBeforeDate({dayBefore: 1})}},
                                            {index: 1, last_review_date: {$lte: createBeforeDate({dayBefore: 1})}},
                                        ],
                                    },
                                    null,
                                    {limit},
                                ),
                            ])
                                .then(([requiredCarts, newCarts]) =>
                                {
                                    createSuccessRespond({res, data: {requiredCarts, newCarts: newCarts || []}})
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
        })
}

function reviewCart(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            const {cart_id, know} = req.body
            cartTb.findOne({_id: cart_id})
                .then(cart =>
                {
                    const {index} = cart
                    cartTb.findOneAndUpdate({_id: cart_id}, {last_review_date: new Date(), index: know ? index + 1 : 1}, {new: true, useFindAndModify: false, runValidators: true})
                        .then(updated =>
                        {
                            createSuccessRespond({res, data: updated, message: respondTextConstant.success.reviewCart})
                            reviewController._addReview({cart_id, user_id, know, before_index: index})
                        })
                        .catch(err =>
                        {
                            createErrorText({res, status: 400, message: respondTextConstant.error.reviewCart, detail: err})
                        })
                })
        })
}

function getCarts(req, res)
{
    const {pack_id} = req.params
    cartTb.find({pack_id})
        .then(carts =>
        {
            createSuccessRespond({res, data: carts})
        })
        .catch(err =>
        {
            createErrorText({res, status: 400, message: respondTextConstant.error.getCarts, detail: err})
        })
}

function addCart(req, res)
{
    checkPermission({req, res})
        .then(() =>
        {
            const file = req?.files?.file
            const {pack_id, front, back, back_description} = req.body
            if (file && pack_id)
            {
                const excelName = new Date().toISOString() + file.name.replace(/ /g, "")
                const excelUrl = `media/excels/${excelName}`
                file.mv(excelUrl, err =>
                {
                    if (err) createErrorText({res, status: 400, message: respondTextConstant.error.parseFile, detail: err})
                    else
                    {
                        const excel = xlsx.parse(excelUrl)
                        const sheet = excel[0].data
                        for (let i = 0; i < sheet.length; i++)
                        {
                            setTimeout(() =>
                            {
                                const [front, back, back_description] = sheet[i]
                                const newCart = new cartTb({pack_id, front, back, back_description})
                                newCart.save((err, cart) =>
                                {
                                    if (err) console.log("add cart from excel err: ", err)
                                    else console.log("add cart from excel success: ", cart)
                                })
                            }, 10)
                        }
                        createSuccessRespond({res, data: {message: "OK"}})
                    }
                })
            }
            else
            {
                const newCart = new cartTb({pack_id, front, back, back_description})
                newCart.save((err, cart) =>
                {
                    if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createCart, detail: err})
                    else createSuccessRespond({res, data: cart, message: respondTextConstant.success.cartAdded})
                })
            }
        })
}

function editCart(req, res)
{
    checkPermission({req, res})
        .then(() =>
        {
            const {cart_id, front, back, back_description} = req.body
            cartTb.findOneAndUpdate({_id: cart_id}, {front, back, back_description}, {new: true, useFindAndModify: false, runValidators: true})
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
    reviewCart,
    addCart,
    editCart,
    deleteCart,
    _deletePackCarts,
    getCarts,
}

export default cartController