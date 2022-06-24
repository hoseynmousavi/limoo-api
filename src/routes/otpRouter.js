import urlConstant from "../constants/urlConstant"
import otpController from "../controllers/otpController"

function otpRouter(app)
{
    app.route(urlConstant.getOtp)
        .post(otpController.getOtp)

    app.route(urlConstant.verifyOtp)
        .post(otpController.verifyOtp)
}

export default otpRouter