import { promisifyChildProcess, spawnChildProcess } from "src/adapters/child_process"
import { assertDirectory, assertFile, writeToolIndex } from "src/adapters/fs"
import defaultConfigs from "src/config"
import fs from "fs"
import path from "path"

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
  const tasks = [promisifyChildProcess(spawnChildProcess(`pnpm i -D ${packages.join(" ")}`)), writeToolIndex(tool)]
  if (tool.configFileName && tool.configFileContent) {
    const configContent =
      typeof tool.configFileContent === "string"
        ? tool.configFileContent
        : JSON.stringify(tool.configFileContent, null, 2)
    tasks.push(
      fs.promises.writeFile(path.join("tools", tool.category, tool.name, tool.configFileName), configContent),
      fs.promises.writeFile(tool.configFileName, configContent)
    )
  }
  await Promise.all(tasks)
}

async function uninstallTool(tool: Tool) {
  const packages = [tool.name, ...tool.dependencies].filter((x) => x)
  await promisifyChildProcess(spawnChildProcess(`pnpm un ${packages.join(" ")}`))
}

async function assertGitInit() {
  try {
    await fs.promises.stat(".git")
  } catch (error) {
    await promisifyChildProcess(spawnChildProcess("git init"))
  }
}

async function assertGitIgnore() {
  const gitIgnoreContent = ["node_modules", "dist"].join("\n")
  await assertFile(".gitignore", gitIgnoreContent)
}

async function assertGit() {
  await Promise.all([assertGitInit(), assertGitIgnore()])
}

export async function init(): Promise<any> {
  await assertConfig()
  await assertGit()
  for (const tool of defaultConfigs.tools) {
    await addTool(tool)
  }
}

export async function assertConfig(): Promise<any> {
  await assertFile("instrumenta.json", JSON.stringify(defaultConfigs))
}

export async function clean(): Promise<any> {
  await fs.promises.rm(defaultConfigs.toolsDirectory, { recursive: true, force: true })
  await fs.promises.rm("instrumenta.json", { force: true })
  for (const tool of defaultConfigs.tools) {
    await uninstallTool(tool)
  }
}
