import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  rootDir: ".",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testTimeout: 30000,
};

export default config;
