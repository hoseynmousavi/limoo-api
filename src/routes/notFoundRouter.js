import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"

function notFoundRouter(app)
{
    app.route("*")
        .all((req, res) =>
        {
            createErrorText({res, message: respondTextConstant.error.routeNotFound, status: 404})
        })
}

export default notFoundRouter