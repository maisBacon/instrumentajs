export interface Tool {
  name: string
  category: string
  configFileName: string
  configFileContent: any
  dependencies?: string[]
}

export interface Config {
  tools: Tool[]
}
