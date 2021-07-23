import { promisifyChildProcess, spawnChildProcess } from "src/adapters/child_process"
import { assertDirectory, assertFile, writeJson, writeToolConfig, writeToolIndex } from "src/adapters/fs"
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
  const tasks = [promisifyChildProcess(spawnChildProcess(`npm i -D ${packages.join(" ")}`)), writeToolIndex(tool)]
  if (tool.configFileName && tool.configFileContent) {
    tasks.push(writeToolConfig(tool), writeJson(tool.configFileName, tool.configFileContent))
  }
  await Promise.all(tasks)
}

export async function init(): Promise<any> {
  await Promise.all([addConfig(), Promise.all(defaultConfigs.tools.map(async (tool: Tool) => addTool(tool)))])
}

export async function addConfig(): Promise<any> {
  assertFile("instrumenta.json", JSON.stringify(defaultConfigs))
}
