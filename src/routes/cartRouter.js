import urlConstant from "../constants/urlConstant"
import cartController from "../controllers/cartController"

function cartRouter(app)
{
    app.route(urlConstant.cart)
        .get(cartController.getCart)
        .post(cartController.addCart)
        .patch(cartController.editCart)
        .delete(cartController.deleteCart)
}

export default cartRouter