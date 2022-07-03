import tokenHelper from "./tokenHelper"
import userController from "../controllers/userController"
import createErrorText from "./createErrorText"
import respondTextConstant from "../constants/respondTextConstant"

function checkPermission({req, res, minRole = "user"})
{
    return new Promise(resolve =>
    {
        tokenHelper.decodeToken(req?.headers?.authorization)
            .then(({_id}) =>
            {
                userController._getUserById({_id})
                    .then(user =>
                    {
                        if (!user) createErrorText({res, status: 403, message: respondTextConstant.error.getPermission, detail: err})
                        else
                        {
                            const {role} = user
                            if (minRole === "user" || role === "admin") resolve(user)
                            else createErrorText({res, status: 403, message: respondTextConstant.error.getPermission, detail: err})
                        }
                    })
                    .catch(err =>
                    {
                        createErrorText({res, status: 500, message: respondTextConstant.error.getUserByToken, detail: err})
                    })
            })
            .catch(e => createErrorText({res, status: 403, message: respondTextConstant.error.getPermission, detail: e?.message}))
    })
}

export default checkPermission