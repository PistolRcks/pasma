// Purpose: Generate a random password for the user

async function generatePassword (length) {
    const { generate } = await import('random-words')
    const wordArray = generate(length)
    const tempPass = wordArray.join('-')
    return tempPass
}

module.exports = {
    default: generatePassword
}
