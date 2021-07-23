const inputDirectory = "./src"
const outputDirectory = "./dist"
const toolsDirectory = "./tools"
const defaultConfigs: Config = {
  inputDirectory,
  outputDirectory,
  tools: [
    {
      name: "typescript",
      category: "superset",
      dependencies: [],
      configFileName: "tsconfig.json",
      configFileContent: {
        compilerOptions: {
          resolveJsonModule: true,
          target: "ES2020",
          module: "commonjs",
          allowJs: true,
          checkJs: true,
          jsx: "preserve",
          outDir: outputDirectory,
          rootDirs: [inputDirectory, toolsDirectory],
          strict: false,
          baseUrl: ".",
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        },
      },
    },
    {
      name: "eslint",
      category: "linter",
      configFileName: ".eslintrc",
      configFileContent: {
        root: true,
        parser: "@typescript-eslint/parser",
        extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
        plugins: ["@typescript-eslint"],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/explicit-module-boundary-types": "off",
        },
      },
      dependencies: ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser", "eslint-config-prettier"],
    },
    {
      name: "prettier",
      category: "formatter",
      dependencies: [],
      configFileName: ".prettierrc",
      configFileContent: {
        arrowParens: "always",
        printWidth: 120,
        semi: false,
        tabWidth: 2,
      },
    },
    {
      name: "instrumentajs",
      category: "basic",
      dependencies: [],
    },
  ],
}

export default defaultConfigs
