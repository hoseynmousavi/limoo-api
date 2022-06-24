import jwt from "jsonwebtoken"
import data from "../data"

const encodeToken = payload =>
{
    return new Promise((resolve, reject) =>
        jwt.sign(payload, data.tokenSign, {algorithm: "HS512"}, (err, token) =>
        {
            if (err) reject(err)
            else resolve(token)
        }),
    )
}

const decodeToken = token =>
{
    return new Promise((resolve, reject) =>
        jwt.verify(token, data.tokenSign, {algorithm: "HS512"}, (err, payload) =>
        {
            if (err) reject()
            else
            {
                const {_id} = payload
                resolve({_id})
            }
        }),
    )
}

const tokenHelper = {
    encodeToken,
    decodeToken,
}

export default tokenHelper