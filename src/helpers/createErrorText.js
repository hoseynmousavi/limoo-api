function createErrorText({res, message, detail, status})
{
    return res.status(status).send({message, ...(detail ? {detail} : {})})
}

export default createErrorText