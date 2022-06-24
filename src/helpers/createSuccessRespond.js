function createSuccessRespond({res, message, data})
{
    return res.send({
        ...(message ? {message} : {}),
        ...(data ? {data} : {}),
    })
}

export default createSuccessRespond