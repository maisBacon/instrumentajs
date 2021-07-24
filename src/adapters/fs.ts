import fs from "fs"
import path from "path"

export const assertFile = async (file: string, defaultContent: string) => {
  try {
    await fs.promises.stat(file)
  } catch (error) {
    await fs.promises.writeFile(file, defaultContent)
  }
}

export const assertDirectory = async (dir: string): Promise<boolean> => {
  try {
    await fs.promises.stat(dir)
  } catch (error) {
    await fs.promises.mkdir(dir, { recursive: true })
  }
  return true
}

export const writeJson = async (path: string, json: any) => {
  return fs.promises.writeFile(path, JSON.stringify(json, null, 2))
}

export const writeToolIndex = async (tool: Tool) => {
  const line1 = `export const name = "${tool.name}"`
  const line2 = `export const configFileName = "${tool.configFileName}"`
  const content = [line1, line2].join("\n")
  return fs.promises.writeFile(path.join("tools", tool.category, tool.name, "index.ts"), content)
}
