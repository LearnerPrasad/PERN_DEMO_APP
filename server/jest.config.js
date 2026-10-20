export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],

};