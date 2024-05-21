/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  collectCoverage: false,

  coverageDirectory: "coverage",

  roots: [
    "<rootDir>/src",
  ],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};

module.exports = config;
