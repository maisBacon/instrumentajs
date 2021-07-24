import fs from "fs"
import { promisifyChildProcess, spawnChildProcess } from "./child_process"
import { assertFile } from "./fs"

export async function assertGitInit() {
  if (!fs.existsSync(".git")) {
    await promisifyChildProcess(spawnChildProcess("git init"))
  }
}

export async function assertGitIgnore() {
  const gitIgnoreContent = "node_modules"
  await assertFile(".gitignore", gitIgnoreContent)
}
