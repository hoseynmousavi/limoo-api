function createBeforeDate({dayBefore = 1})
{
    const yesterday = new Date(new Date().setHours(0, 0, 0, 0))
    yesterday.setDate(yesterday.getDate() - (dayBefore - 1))
    return yesterday
}

export default createBeforeDate