// Purpose: Generate a random password for the user
const { generate } = require('random-words')

/**
 * Generates a random password based on a number of words that you pass in
 * @param {number} numWords - number of words to use in the password. If less than two, it will default to two
 * @returns password string that will be at least 12 characters long and contain at least one number
 */
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
