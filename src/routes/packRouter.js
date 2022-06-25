import urlConstant from "../constants/urlConstant"
import packController from "../controllers/packController"

function packRouter(app)
{
    app.route(urlConstant.pack)
        .get(packController.getPack)
        .post(packController.addPack)
        .delete(packController.deletePack)
}

export default packRouter