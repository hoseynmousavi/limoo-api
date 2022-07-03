import mongoose from "mongoose"
import reviewModel from "../models/reviewModel"

const reviewTb = mongoose.model("review", reviewModel)

function _addReview({cart_id, know})
{
    const newReview = new reviewTb({cart_id, know})
    newReview.save((err, review) =>
    {
        console.log({err, review})
    })
}

const reviewController = {
    _addReview,
}

export default reviewController