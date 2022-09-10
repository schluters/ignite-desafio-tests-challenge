export default {
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  preset: "ts-jest",
  rootDir: "src",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
};
