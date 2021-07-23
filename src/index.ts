import { promisifyChildProcess, spawnChildProcess } from "adapters/child_process"
import { assertDirectory, writeJson, writeToolConfig, writeToolIndex } from "adapters/fs"
import fs from "fs"
import path from "path"
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
          baseUrl: inputDirectory,
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

function build(flags = "") {
  return spawnChildProcess(`tsc ${flags}`)
}

function buildDev() {
  return build("-w")
}

function run() {
  return spawnChildProcess(`node dist/src/index.js`)
}

export function runDev(): void {
  buildDev()

  let node = run()
  fs.watch("dist", { recursive: true }, () => {
    node.kill()
    node = run()
  })
}

async function addTool(tool: Tool) {
  const packages = [tool.name, ...tool.dependencies].filter((x) => x)
  await assertDirectory(path.join("tools", tool.category, tool.name))
  const tasks = [promisifyChildProcess(spawnChildProcess(`npm i -D ${packages.join(" ")}`)), writeToolIndex(tool)]
  if (tool.configFileName && tool.configFileContent) {
    tasks.push(writeToolConfig(tool), writeJson(tool.configFileName, tool.configFileContent))
  }
  await Promise.all(tasks)
}

export async function init(): Promise<any> {
  await Promise.all([
    writeJson("instrumenta.json", defaultConfigs),
    Promise.all(defaultConfigs.tools.map(async (tool: Tool) => addTool(tool))),
  ])
}
