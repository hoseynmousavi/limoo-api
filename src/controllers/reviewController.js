import mongoose from "mongoose"
import reviewModel from "../models/reviewModel"

const reviewTb = mongoose.model("review", reviewModel)

function _addReview({cart_id, user_id, know, before_index})
{
    const newReview = new reviewTb({cart_id, user_id, know, before_index})
    newReview.save((err, review) =>
    {
        console.log({err, review})
    })
}

function _getReviewCount({query})
{
    return reviewTb.countDocuments(query)
}

const reviewController = {
    _addReview,
    _getReviewCount,
}

export default reviewController