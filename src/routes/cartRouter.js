import urlConstant from "../constants/urlConstant"
import cartController from "../controllers/cartController"

function cartRouter(app)
{
    app.route(urlConstant.cart)
        .post(cartController.addCart)
        .patch(cartController.editCart)
        .delete(cartController.deleteCart)

    app.route(urlConstant.cartReview)
        .get(cartController.getReviewCarts)
        .post(cartController.reviewCart)
}

export default cartRouter