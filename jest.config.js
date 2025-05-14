/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  roots: ['./src'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ["./src/tests/unit/singleton.ts"],
  setupFiles: ["./jest.setup.js"],
  moduleFileExtensions: ['ts', 'js', 'json']
};