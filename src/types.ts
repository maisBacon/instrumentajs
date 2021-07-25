export interface PackageManager {
  name: string
  addCommand: string
  removeCommand: string
}

export interface Tool {
  name: string
  category: string
  configFileName?: string
  configFileContent?: any
  dependencies: string[]
}

export interface Config {
  inputDirectory: string
  outputDirectory: string
  toolsDirectory: string
  packageManager: PackageManager
  tools: Tool[]
}
