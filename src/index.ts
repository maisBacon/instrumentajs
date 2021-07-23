import { promisifyChildProcess, spawnChildProcess } from "adapters/child_process"
import { assertDirectory, writeJson, writeToolConfig, writeToolIndex } from "adapters/fs"
import fs from "fs"
import path from "path"
import { Config, Tool } from "types"

const defaultConfigs: Config = {
  tools: [
    {
      name: "typescript",
      category: "superset",
      configFileName: "tsconfig.json",
      configFileContent: {
        compilerOptions: {
          target: "ES2020",
          module: "commonjs",
          allowJs: true,
          checkJs: true,
          jsx: "preserve",
          outDir: "./dist",
          rootDirs: ["./src", "./tools"],
          strict: false,
          baseUrl: "./src",
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
      configFileName: ".prettierrc",
      configFileContent: {
        arrowParens: "always",
        printWidth: 120,
        semi: false,
        tabWidth: 2,
      },
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
  return spawnChildProcess(`node dist/index.js`)
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
  await assertDirectory(path.join("tools", tool.category, tool.name)),
    await Promise.all([
      promisifyChildProcess(spawnChildProcess(`npm i -D ${tool.name}`)),
      writeToolConfig(tool),
      writeToolIndex(tool),
      writeJson(tool.configFileName, tool.configFileContent),
    ])
}

export async function init(): Promise<any> {
  await Promise.all([
    writeJson("instrumenta.json", defaultConfigs),
    Promise.all(defaultConfigs.tools.map(async (tool: Tool) => addTool(tool))),
  ])
}
