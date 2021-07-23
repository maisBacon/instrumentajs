import fs from "fs"
import path from "path"
import { ChildProcess, spawn } from "child_process"

const spawnChildProcess = (command: string): ChildProcess => {
  const child = spawn(command, { shell: true })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}

const promisifyChildProcess = (child: ChildProcess) => {
  return new Promise((resolve, reject) => {
    child.on("close", resolve)
    child.on("error", reject)
  })
}

interface Tool {
  name: string
  configFileName: string
  configFileContent: any
  dependencies?: string[]
}

interface Config {
  linter: Tool
  formatter: Tool
  typescript: Tool
}

const defaultConfigs: Config = {
  linter: {
    name: "eslint",
    configFileName: ".eslintrc",
    configFileContent: {
      root: true,
      parser: "@typescript-eslint/parser",
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
    dependencies: ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser", "eslint-config-prettier"],
  },
  formatter: {
    name: "prettier",
    configFileName: ".prettierrc",
    configFileContent: {
      arrowParens: "always",
      printWidth: 120,
      semi: false,
      tabWidth: 2,
    },
  },
  typescript: {
    name: "typescript",
    configFileName: "tsconfig.json",
    configFileContent: {
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        allowJs: true,
        checkJs: true,
        jsx: "preserve",
        outDir: "./dist",
        rootDir: "./src",
        strict: false,
        baseUrl: "./src",
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
    },
  },
}

function build(flags = "") {
  return spawnChildProcess(`tsc ${flags}`)
}

function buildDev() {
  return build("-w")
}

function run() {
  return spawnChildProcess(`node ${path.join(defaultConfigs.typescript.configFileContent.outDir, "index.js")}`)
}

export function runDev(): void {
  buildDev()

  let node = run()
  fs.watch(defaultConfigs.typescript.configFileContent.outDir, { recursive: true }, () => {
    node.kill()
    node = run()
  })
}

async function addTool(tool: Tool) {
  await Promise.all([
    fs.promises.writeFile(tool.configFileName, JSON.stringify(tool.configFileContent, null, 2)),
    promisifyChildProcess(spawnChildProcess(`npm i -D ${tool.name}`)),
  ])
}

export async function init(): Promise<any> {
  await Promise.all(Object.values(defaultConfigs).map(async (tool: Tool) => addTool(tool)))
}
