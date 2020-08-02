module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom-fifteen',
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testRegex: '.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {"\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js"}
};
