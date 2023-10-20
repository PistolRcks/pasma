// Purpose: Generate a random password for the user
const { generate } = require('random-words')

async function generatePassword (length) {
    if (length < 2) {
        length = 2
    }
    let wordArray = generate(length)
    let tempPass = wordArray.join('-')
    tempPass = tempPass.concat(Math.floor(Math.random() * 10))
    while(tempPass.length < 12) {
        tempPass = tempPass.concat(Math.floor(Math.random() * 10))
    }
    return tempPass
}

module.exports = {
    generatePassword
}
