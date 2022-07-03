function createBeforeDate({dayBefore = 1})
{
    return new Date(new Date().setDate(new Date().getDate() - dayBefore))
}

export default createBeforeDate