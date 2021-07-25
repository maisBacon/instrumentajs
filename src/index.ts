import { promisifyChildProcess, spawnChildProcess } from "src/adapters/child_process"
import { assertDirectory, assertFile, writeJson, writeToolIndex } from "src/adapters/fs"
import defaultConfigs, { configFileName } from "src/config"
import fs from "fs"
import path from "path"
import { assertGitIgnore, assertGitInit } from "./adapters/git"
import { Config, Tool } from "./types"

async function addTool(config: Config, tool: Tool) {
  const packages = [tool.name, ...tool.dependencies].filter((x) => x).join(" ")
  const toolDirectory = path.join(config.toolsDirectory, tool.category, tool.name)
  await assertDirectory(toolDirectory)
  await promisifyChildProcess(
    spawnChildProcess(`${config.packageManager.name} ${config.packageManager.addCommand} ${packages}`)
  )
  await writeToolIndex(tool)

  if (tool.configFileName && tool.configFileContent) {
    if (tool.configFileContent === "string") {
      await assertFile(tool.configFileName, tool.configFileContent)
    } else {
      await writeJson(tool.configFileName, tool.configFileContent)
    }
  }
}

async function uninstallTool(config: Config, tool: Tool) {
  const packages = [tool.name, ...tool.dependencies].filter((x) => x).join(" ")
  await promisifyChildProcess(
    spawnChildProcess(`${config.packageManager.name} ${config.packageManager.removeCommand} ${packages}`)
  )
}

export async function init(): Promise<any> {
  if (fs.existsSync(configFileName)) {
    console.log(`Espaço de trabalho já foi iniciado`)
    return
  }
  await writeJson(configFileName, defaultConfigs)
  const configBuffer = await fs.promises.readFile(configFileName)
  const config: Config = JSON.parse(configBuffer.toString())
  await Promise.all([assertGitInit(), assertGitIgnore()])
  for (const tool of defaultConfigs.tools) {
    await addTool(config, tool)
  }
}

export async function clean(): Promise<any> {
  if (!fs.existsSync(configFileName)) {
    console.log(`Espaço de trabalho não foi iniciado`)
    return
  }
  const configBuffer = await fs.promises.readFile(configFileName)
  const config: Config = JSON.parse(configBuffer.toString())
  await fs.promises.rm(defaultConfigs.toolsDirectory, {
    recursive: true,
    force: true,
  })
  await fs.promises.rm(configFileName, { force: true })
  for (const tool of defaultConfigs.tools) {
    await uninstallTool(config, tool)
  }
}
