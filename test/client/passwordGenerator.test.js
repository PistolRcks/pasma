const { generatePassword } = require('../../client/passwordGenerator');

describe('generatePassword', () => {
    test('should return a string', async () => {
        const password = await generatePassword(8);
        expect(typeof password).toBe('string');
    });

    test('should return a password with the specified length', async () => {
        const wordCount = 3
        const minlength = 12;
        const password = await generatePassword(wordCount);
        expect(password.length).toBeGreaterThan(minlength);
    });

    test('should return a password with at least one number', async () => {
        const wordCount = 3
        const password = await generatePassword(wordCount);
        expect(/[0-9]/.test(password)).toBe(true);
    });

    test('should return a password with at least one special character', async () => {
        const wordCount = 3
        const password = await generatePassword(wordCount);
        expect(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)).toBe(true);
    });
});
