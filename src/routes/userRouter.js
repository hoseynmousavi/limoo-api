import urlConstant from "../constants/urlConstant"
import userController from "../controllers/userController"

function userRouter(app)
{
    app.route(urlConstant.user)
        .get(userController.getUserByToken)
        .patch(userController.updateUser)

    app.route(urlConstant.userAvatar)
        .put(userController.updateAvatar)
}

export default userRouter