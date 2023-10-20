/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    resetMocks: false,
    collectCoverage: true,
    testEnvironment: 'node',
    transformIgnorePatterns: [
        "node_modules/(?!axis)"
    ],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    }
};
