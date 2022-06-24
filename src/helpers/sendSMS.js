import axios from "axios"
import data from "../data"

function sendSMS({receptor, template, token})
{
    return axios.get(`${data.kavenegarApi}/${data.kavenegarKey}/verify/lookup.json?receptor=${receptor}&token=${token}&template=${template}`)
}

export default sendSMS