import fs from "fs"
import { promisifyChildProcess, spawnChildProcess } from "./child_process"
import { assertFile } from "./fs"

export async function assertGitInit() {
  try {
    await fs.promises.stat(".git")
  } catch (error) {
    await promisifyChildProcess(spawnChildProcess("git init"))
  }
}

export async function assertGitIgnore() {
  const gitIgnoreContent = ["node_modules", "dist"].join("\n")
  await assertFile(".gitignore", gitIgnoreContent)
}
