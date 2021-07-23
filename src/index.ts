import fs from "fs"
import path from "path"
import { spawnChildProcess } from "utils"

interface Tool {
  name: string
  configFileName: string
  configFileContent: any
}

interface Config {
  linter: Tool
  formatter: Tool
  typescript: any
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
  },
  formatter: {
    name: "prettier",
    configFileName: ".pretterrc",
    configFileContent: {
      arrowParens: "always",
      printWidth: 120,
      semi: false,
      tabWidth: 2,
    },
  },
  typescript: {
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
}

const workflows = {
  build: true,
  run: true,
}

const envs = {
  dev: true,
}

function build(flags = "") {
  return spawnChildProcess(`tsc ${flags}`)
}

function buildDev() {
  return build("-w")
}

function run() {
  return spawnChildProcess(`node ${path.join(defaultConfigs.typescript.outDir, "index.js")}`)
}

async function runDev() {
  const tsc = spawnChildProcess("tsc -w")

  tsc.on("close", () => {
    let node = run()
    fs.watch(defaultConfigs.typescript.outDir, { recursive: true }, () => {
      node.kill()
      node = run()
    })
  })
}

async function addTool(tool: Tool) {
  await fs.promises.writeFile(tool.configFileName, JSON.stringify(tool.configFileContent, null, 2))
}

async function init() {
  await Promise.all(Object.values(defaultConfigs).map(async (tool: Tool) => addTool(tool)))
}
