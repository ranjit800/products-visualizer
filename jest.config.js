/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(svg|png|jpg|jpeg|gif|webp)$": "<rootDir>/tests/__mocks__/fileMock.ts",
    "\\.css$": "<rootDir>/tests/__mocks__/styleMock.ts",
  },
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/unit/**/*.test.tsx",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
};

module.exports = config;
