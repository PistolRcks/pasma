const { generatePassword } = require('../../client/passwordGenerator');

describe('generatePassword', () => {
    const wordCount = 3
    const minLength = 12
    test('should return a string', async () => {
        const password = generatePassword(8);
        expect(typeof password).toBe('string');
    });

    test('should return a password with the specified length', async () => {
        const password = generatePassword(wordCount);
        expect(password.length).toBeGreaterThan(minLength);
    });

    test('should return a password with at least one number', async () => {
        const password = generatePassword(wordCount);
        expect(/[0-9]/.test(password)).toBe(true);
    });

    test('should return a password with at least one special character', async () => {
        const password = generatePassword(wordCount);
        expect(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)).toBe(true);
    });
});
