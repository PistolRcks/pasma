// Purpose: Generate a random password for the user
const { generate } = require('random-words')

// Pass in the number of words you want in the password
function generatePassword(numWords) {
    // If the user passes in a word count less than 2, set it to 2
    if (numWords < 2) {
        numWords = 2
    }
    const wordArray = generate(numWords)
    let tempPass = wordArray.join('-')
    tempPass = tempPass.concat(Math.floor(Math.random() * 10))
    while (tempPass.length < 12) {
        tempPass = tempPass.concat(Math.floor(Math.random() * 10))
    }
    return tempPass
}

module.exports = {
    generatePassword
}
