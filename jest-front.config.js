module.exports = {
    collectCoverage: true,
    resetMocks: false,
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        "node_modules/(?!axis)"
    ],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    }
};
