//IMPROVE: create an error.utils from this scratch
exports.processError = (error) => {
    if(error.code && error.message) {
        console.error(`[ERROR] ${error.code} - ${error.message}`)
    } else { console.error(`[ERROR] ${error}`) }
    throw({
        statusCode: 500,
        errorCode: "Internal Error",
        errorData: "Contact administrator"
    })
}