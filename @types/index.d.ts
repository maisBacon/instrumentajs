declare interface PackageManager {
  name: string
  addCommand: string
  removeCommand: string
}

declare interface Tool {
  name: string
  category: string
  configFileName?: string
  configFileContent?: any
  dependencies: string[]
}

declare interface Config {
  inputDirectory: string
  outputDirectory: string
  toolsDirectory: string
  packageManager: PackageManager
  tools: Tool[]
}
