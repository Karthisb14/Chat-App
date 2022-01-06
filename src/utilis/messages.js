const genareteMessages = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const genaretelocationmessages = (username, locationurl) => {
    return {
        username,
        locationurl,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genareteMessages,
    genaretelocationmessages
}